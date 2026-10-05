import { useState } from 'react';
import { useStore, ModFile } from '../store';
import { generateModCpp, generateServerDZCfg, generateTypesXml, generateEconXml, generateCfgGameplay } from '../utils/configGenerators';
import { copyToClipboard } from '../utils/exportUtils';
import { Copy, Check, Info, ArrowDownToLine, FileCode } from 'lucide-react';

type ConfigType = 'mod' | 'server' | 'types' | 'econ' | 'gameplay';

// Маппинг: какой конфиг в какой файл
const configFileMap: Record<ConfigType, string> = {
  mod: 'mod.cpp',
  server: 'serverDZ.cfg',
  types: 'types.xml',
  econ: 'econ.xml',
  gameplay: 'cfggameplay.json',
};

export function ConfigGeneratorTab() {
  const { modConfig, setModConfig, serverConfig, setServerConfig, project } = useStore();
  const [activeConfig, setActiveConfig] = useState<ConfigType>('mod');
  const [copied, setCopied] = useState(false);
  const [insertedTo, setInsertedTo] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Вставить код в файл
  const handleInsertToFile = () => {
    const targetFileName = configFileMap[activeConfig];
    const file = findFileByName(project.files, targetFileName);
    
    if (file) {
      useStore.getState().updateFileContent(file.id, getPreview());
      useStore.getState().setSelectedFileId(file.id);
      useStore.getState().setActiveTab('structure');
      setInsertedTo(targetFileName);
      setTimeout(() => setInsertedTo(null), 3000);
    } else {
      alert(`Файл "${targetFileName}" не найден в проекте. Добавьте его через вкладку "Структура мода".`);
    }
  };

  const getPreview = () => {
    switch (activeConfig) {
      case 'mod': return generateModCpp(modConfig);
      case 'server': return generateServerDZCfg(serverConfig);
      case 'types': return generateTypesXml();
      case 'econ': return generateEconXml();
      case 'gameplay': return generateCfgGameplay();
      default: return '';
    }
  };

  const configTabs = [
    { id: 'mod' as ConfigType, label: 'mod.cpp', desc: 'Описание мода' },
    { id: 'server' as ConfigType, label: 'serverDZ.cfg', desc: 'Настройки сервера' },
    { id: 'types' as ConfigType, label: 'types.xml', desc: 'Спавн лута' },
    { id: 'econ' as ConfigType, label: 'econ.xml', desc: 'Экономика' },
    { id: 'gameplay' as ConfigType, label: 'cfggameplay.json', desc: 'Геймплей' },
  ];

  const targetFile = findFileByName(project.files, configFileMap[activeConfig]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">⚙️ Генератор конфигов</h2>
        <p className="text-gray-400">Настройте параметры и вставьте сгенерированный код прямо в файлы проекта</p>
      </div>

      {/* Config Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {configTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveConfig(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeConfig === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div>{tab.label}</div>
            <div className="text-xs opacity-70">{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* Config Form */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        {activeConfig === 'mod' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">mod.cpp — Описание мода</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Название мода <span title="Отображается в списке модов" className="text-gray-500">ⓘ</span>
                </label>
                <input type="text" value={modConfig.modName} onChange={(e) => setModConfig({ modName: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Директория <span title="Папка мода, начинается с @" className="text-gray-500">ⓘ</span>
                </label>
                <input type="text" value={modConfig.modDir} onChange={(e) => setModConfig({ modDir: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Тултип (описание)</label>
                <input type="text" value={modConfig.modTooltip} onChange={(e) => setModConfig({ modTooltip: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Картинка (.paa)</label>
                <input type="text" value={modConfig.modPicture} onChange={(e) => setModConfig({ modPicture: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
              </div>
            </div>
          </div>
        )}

        {activeConfig === 'server' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">serverDZ.cfg — Настройки сервера</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Имя сервера</label>
                <input type="text" value={serverConfig.hostname} onChange={(e) => setServerConfig({ hostname: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Макс. игроков</label>
                <input type="number" value={serverConfig.maxPlayers} onChange={(e) => setServerConfig({ maxPlayers: parseInt(e.target.value) || 60 })}
                  min={1} max={120}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Пароль сервера</label>
                <input type="text" value={serverConfig.password} onChange={(e) => setServerConfig({ password: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Пароль админа</label>
                <input type="text" value={serverConfig.adminPassword} onChange={(e) => setServerConfig({ adminPassword: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Время респавна (сек)</label>
                <input type="number" value={serverConfig.respawnTime} onChange={(e) => setServerConfig({ respawnTime: parseInt(e.target.value) || 5 })}
                  min={0}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ускорение времени</label>
                <input type="number" value={serverConfig.timeAcceleration} onChange={(e) => setServerConfig({ timeAcceleration: parseFloat(e.target.value) || 1 })}
                  min={0} step={0.1}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={serverConfig.battlEye} onChange={(e) => setServerConfig({ battlEye: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-700 text-green-500" />
                  BattlEye
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={serverConfig.enableWhitelist} onChange={(e) => setServerConfig({ enableWhitelist: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-700 text-green-500" />
                  Вайтлист
                </label>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={serverConfig.disablePersonalLight} onChange={(e) => setServerConfig({ disablePersonalLight: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-700 text-green-500" />
                  Без личного света
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={serverConfig.enableDebugMonitor} onChange={(e) => setServerConfig({ enableDebugMonitor: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-700 text-green-500" />
                  Debug Monitor
                </label>
              </div>
            </div>
          </div>
        )}

        {activeConfig === 'types' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">types.xml — Спавн лута</h3>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-2 text-sm text-yellow-300">
                <Info size={16} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium mb-1">Подсказки:</p>
                  <ul className="list-disc list-inside text-yellow-200/80 space-y-1 text-xs">
                    <li><strong>nominal</strong> — макс. кол-во предмета на карте</li>
                    <li><strong>lifetime</strong> — время жизни в секундах</li>
                    <li><strong>restock</strong> — время до пополнения (0 = не пополняется)</li>
                    <li><strong>min</strong> — мин. кол-во для начала рестока</li>
                    <li><strong>category</strong> — weapons, tools, clothes, food, containers</li>
                    <li><strong>usage</strong> — Military, Village, Town, Coast, Hunting</li>
                    <li><strong>value</strong> — Tier1-Tier4, Unique</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeConfig === 'econ' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">econ.xml — Экономика сервера</h3>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-2 text-sm text-blue-300">
                <Info size={16} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium mb-1">Настройки Central Economy:</p>
                  <ul className="list-disc list-inside text-blue-200/80 space-y-1 text-xs">
                    <li>Флаги работы CE</li>
                    <li>Категории и теги предметов</li>
                    <li>Usage зоны спавна</li>
                    <li>Тиры редкости</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeConfig === 'gameplay' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">cfggameplay.json — Настройки геймплея</h3>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-2 text-sm text-purple-300">
                <Info size={16} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium mb-1">Параметры:</p>
                  <ul className="list-disc list-inside text-purple-200/80 space-y-1 text-xs">
                    <li><strong>disableBaseDamage</strong> — урон по базам</li>
                    <li><strong>disableContainerDamage</strong> — урон по контейнерам</li>
                    <li><strong>disableRespawnDialog</strong> — диалог респавна</li>
                    <li><strong>StaminaData</strong> — выносливость</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview & Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Превью файла: {configFileMap[activeConfig]}</h3>
          <div className="flex items-center gap-2">
            {/* Вставить в файл */}
            <button
              onClick={handleInsertToFile}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                targetFile
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!targetFile}
              title={targetFile ? `Вставить код в ${configFileMap[activeConfig]}` : `Сначала добавьте файл ${configFileMap[activeConfig]} в структуру`}
            >
              {insertedTo === configFileMap[activeConfig] ? (
                <><Check size={16} className="text-green-300" /> Вставлено!</>
              ) : (
                <><ArrowDownToLine size={16} /> Вставить в {configFileMap[activeConfig]}</>
              )}
            </button>
            {/* Копировать */}
            <button
              onClick={() => handleCopy(getPreview())}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              {copied ? 'Скопировано!' : 'Копировать'}
            </button>
          </div>
        </div>

        {!targetFile && (
          <div className="mb-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
            <p className="text-xs text-yellow-300">
              ⚠️ Файл <strong>{configFileMap[activeConfig]}</strong> не найден в проекте. 
              Добавьте его через вкладку "Структура мода" или используйте "Быстрое добавление".
            </p>
          </div>
        )}

        <pre className="bg-gray-900 rounded-lg p-4 border border-gray-700 overflow-x-auto text-sm font-mono text-green-300 max-h-96 overflow-y-auto">
          {getPreview()}
        </pre>
      </div>
    </div>
  );
}
