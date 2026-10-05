import { useState, useEffect } from 'react';
import { useStore, ModFile } from '../store';
import { exportProjectAsZip, copyToClipboard } from '../utils/exportUtils';
import { generateModCpp, generateServerDZCfg, generateInitC, generateTypesXml, generateEconXml, generateCfgGameplay } from '../utils/configGenerators';
import { Download, Copy, Check, FileArchive, FileText, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

// Найти файл по имени
const findFileByName = (files: ModFile[], name: string): ModFile | null => {
  for (const f of files) {
    if (f.name === name && f.type === 'file') return f;
    if (f.children) {
      const found = findFileByName(f.children, name);
      if (found) return found;
    }
  }
  return null;
};

export function ExportTab() {
  const { project, modConfig, serverConfig, updateFileContent } = useStore();
  const [exporting, setExporting] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [appliedAll, setAppliedAll] = useState(false);

  // Автоматически применяем конфиги при открытии вкладки
  useEffect(() => {
    const applyConfigs = () => {
      const configs = [
        { fileName: 'mod.cpp', content: generateModCpp(modConfig) },
        { fileName: 'serverDZ.cfg', content: generateServerDZCfg(serverConfig) },
        { fileName: 'init.c', content: generateInitC() },
        { fileName: 'types.xml', content: generateTypesXml() },
        { fileName: 'econ.xml', content: generateEconXml() },
        { fileName: 'cfggameplay.json', content: generateCfgGameplay() },
      ];

      configs.forEach(({ fileName, content }) => {
        const file = findFileByName(project.files, fileName);
        if (file && (!file.content || file.content.trim() === '')) {
          updateFileContent(file.id, content);
        }
      });
    };

    applyConfigs();
  }, []);

  const handleExportZip = async () => {
    setExporting(true);
    try {
      await exportProjectAsZip(project.files, modConfig, serverConfig);
    } catch (err) {
      console.error('Export error:', err);
      alert('Ошибка при создании архива. Проверьте консоль.');
    }
    setExporting(false);
  };

  const handleCopyFile = (content: string, fileName: string) => {
    copyToClipboard(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Применить все конфиги к файлам проекта
  const handleApplyAllConfigs = () => {
    const configs = [
      { fileName: 'mod.cpp', content: generateModCpp(modConfig) },
      { fileName: 'serverDZ.cfg', content: generateServerDZCfg(serverConfig) },
      { fileName: 'init.c', content: generateInitC() },
      { fileName: 'types.xml', content: generateTypesXml() },
      { fileName: 'econ.xml', content: generateEconXml() },
      { fileName: 'cfggameplay.json', content: generateCfgGameplay() },
    ];

    let appliedCount = 0;
    configs.forEach(({ fileName, content }) => {
      const file = findFileByName(project.files, fileName);
      if (file) {
        updateFileContent(file.id, content);
        appliedCount++;
      }
    });

    setAppliedAll(true);
    setTimeout(() => setAppliedAll(false), 3000);
    alert(`Применено конфигов к ${appliedCount} файлам. Теперь при экспорте будут использованы ваши настройки.`);
  };

  // Превью файлов, которые попадут в архив
  const getPreviewFiles = () => {
    return [
      { name: 'mod.cpp', content: generateModCpp(modConfig), desc: 'Описание мода', exists: !!findFileByName(project.files, 'mod.cpp') },
      { name: 'serverDZ.cfg', content: generateServerDZCfg(serverConfig), desc: 'Конфиг сервера', exists: !!findFileByName(project.files, 'serverDZ.cfg') },
      { name: 'init.c', content: generateInitC(), desc: 'Инициализация миссии', exists: !!findFileByName(project.files, 'init.c') },
      { name: 'types.xml', content: generateTypesXml(), desc: 'Спавн лута', exists: !!findFileByName(project.files, 'types.xml') },
      { name: 'econ.xml', content: generateEconXml(), desc: 'Экономика CE', exists: !!findFileByName(project.files, 'econ.xml') },
      { name: 'cfggameplay.json', content: generateCfgGameplay(), desc: 'Настройки геймплея', exists: !!findFileByName(project.files, 'cfggameplay.json') },
    ];
  };

  const previewFiles = getPreviewFiles();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">📦 Экспорт проекта</h2>
        <p className="text-gray-400">Скачайте структуру мода в виде ZIP-архива или скопируйте отдельные файлы</p>
      </div>

      {/* Warning & Apply Button */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-300 mb-1">Важно! Перед экспортом</h3>
            <p className="text-xs text-yellow-200/80 mb-3">
              Чтобы ваши настройки из "Генератора конфигов" попали в ZIP-архив, нажмите кнопку ниже. 
              Это запишет сгенерированный код в файлы проекта.
            </p>
            <button
              onClick={handleApplyAllConfigs}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {appliedAll ? (
                <>
                  <Check size={16} />
                  Конфиги применены!
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Применить все конфиги к файлам
                </>
              )}
            </button>
          </div>
        </div>
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
              Архив будет содержать все файлы проекта с применёнными настройками
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

      {/* Preview of Generated Files */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={20} className="text-blue-400" />
          Превью файлов (что попадёт в архив)
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Здесь показаны файлы с <strong className="text-green-400">вашими текущими настройками</strong>. 
          Скопируйте их или нажмите "Применить все конфиги" выше.
        </p>
        
        <div className="space-y-4">
          {previewFiles.map((file) => (
            <div key={file.name} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{file.name}</span>
                  <span className="text-xs text-gray-500">— {file.desc}</span>
                  {file.exists ? (
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded">✓ в проекте</span>
                  ) : (
                    <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded">✗ нет в проекте</span>
                  )}
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
