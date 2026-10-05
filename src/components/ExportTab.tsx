import { useState } from 'react';
import { useStore } from '../store';
import { exportProjectAsZip, copyToClipboard } from '../utils/exportUtils';
import { generateModCpp, generateServerDZCfg, generateInitC, generateTypesXml, generateEconXml, generateCfgGameplay } from '../utils/configGenerators';
import { Download, Copy, Check, FileArchive, FileText, Loader2 } from 'lucide-react';

export function ExportTab() {
  const { project, modConfig, serverConfig } = useStore();
  const [exporting, setExporting] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const handleExportZip = async () => {
    setExporting(true);
    try {
      await exportProjectAsZip(project.files, modConfig, serverConfig);
    } catch (err) {
      console.error('Export error:', err);
    }
    setExporting(false);
  };

  const handleCopyFile = (content: string, fileName: string) => {
    copyToClipboard(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const generatedFiles = [
    { name: 'mod.cpp', content: generateModCpp(modConfig), desc: 'Описание мода' },
    { name: 'serverDZ.cfg', content: generateServerDZCfg(serverConfig), desc: 'Конфиг сервера' },
    { name: 'init.c', content: generateInitC(), desc: 'Инициализация миссии' },
    { name: 'types.xml', content: generateTypesXml(), desc: 'Спавн лута' },
    { name: 'econ.xml', content: generateEconXml(), desc: 'Экономика CE' },
    { name: 'cfggameplay.json', content: generateCfgGameplay(), desc: 'Настройки геймплея' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">📦 Экспорт проекта</h2>
        <p className="text-gray-400">Скачайте структуру мода в виде ZIP-архива или скопируйте отдельные файлы</p>
      </div>

      {/* Export ZIP */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileArchive size={20} className="text-green-400" />
              Скачать структуру мода (ZIP)
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Архив будет содержать все файлы проекта с автоматически сгенерированным содержимым
            </p>
          </div>
          <button
            onClick={handleExportZip}
            disabled={exporting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {exporting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Создание...
              </>
            ) : (
              <>
                <Download size={18} />
                Скачать ZIP
              </>
            )}
          </button>
        </div>
        
        <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Содержимое архива:</p>
          <div className="font-mono text-xs text-gray-300 space-y-0.5">
            <div className="text-yellow-400">📁 {modConfig.modDir}/</div>
            <div className="ml-4">📄 mod.cpp</div>
            <div className="ml-4 text-yellow-400">📁 addons/</div>
            <div className="ml-4 text-yellow-400">📁 keys/</div>
            <div className="ml-4 text-yellow-400">📁 scripts/</div>
            <div className="ml-4 text-yellow-400">📁 mpmissions/dayzOffline.chernarusplus/</div>
            <div className="ml-8">📄 init.c</div>
            <div className="ml-8">📄 types.xml</div>
            <div className="ml-8">📄 econ.xml</div>
            <div className="ml-8">📄 cfggameplay.json</div>
            <div className="ml-4">📄 serverDZ.cfg</div>
            <div className="ml-4">📄 README.md</div>
          </div>
        </div>
      </div>

      {/* Individual Files */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={20} className="text-blue-400" />
          Сгенерированные файлы
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Скопируйте содержимое каждого файла и вставьте в соответствующий файл вашего мода
        </p>
        
        <div className="space-y-4">
          {generatedFiles.map((file) => (
            <div key={file.name} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <div>
                  <span className="text-sm font-medium text-white">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">— {file.desc}</span>
                </div>
                <button
                  onClick={() => handleCopyFile(file.content, file.name)}
                  className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded text-xs transition-colors"
                >
                  {copiedFile === file.name ? (
                    <>
                      <Check size={12} className="text-green-400" />
                      Скопировано!
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Копировать
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-xs font-mono text-green-300 overflow-x-auto max-h-40 overflow-y-auto">
                {file.content}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">💡 Что делать после экспорта</h3>
        <div className="space-y-2">
          {[
            'Распакуйте ZIP-архив в рабочую директорию DayZ',
            'Отредактируйте файлы под ваши нужды (особенно types.xml и init.c)',
            'Соберите PBO архивы через DayZ Tools → Package Builder',
            'Подпишите PBO ключом через Sign Tool',
            'Загрузите папку мода на сервер',
            'Добавьте -mod=@YourModName в параметры запуска сервера',
            'Перезапустите сервер и проверьте логи',
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400">→</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
