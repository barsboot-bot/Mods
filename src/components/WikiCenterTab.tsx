import { ExternalLink, BookOpen, FileText, Globe } from 'lucide-react';

const wikiLinks = [
  {
    title: 'DayZ Wiki — Официальная документация',
    url: 'https://community.bistudio.com/wiki/DayZ:Official_Documentation',
    description: 'Официальная документация по DayZ Standalone от Bohemia Interactive',
    icon: BookOpen,
  },
  {
    title: 'DayZ Scripting API',
    url: 'https://community.bistudio.com/wiki/DayZ:Scripting_API',
    description: 'Полный API справочник по Enforce Script для DayZ',
    icon: FileText,
  },
  {
    title: 'Enforce Script — Руководство',
    url: 'https://community.bistudio.com/wiki/DayZ:Enforce_Script',
    description: 'Руководство по языку Enforce Script (основан на C-like синтаксисе)',
    icon: FileText,
  },
  {
    title: 'DayZ Modding Guide',
    url: 'https://community.bistudio.com/wiki/DayZ:Modding',
    description: 'Гайд по моддингу DayZ Standalone — от создания до публикации',
    icon: Globe,
  },
  {
    title: 'DayZ Central Economy',
    url: 'https://community.bistudio.com/wiki/DayZ:Central_Economy',
    description: 'Документация по системе Central Economy (CE) — спавн лута',
    icon: BookOpen,
  },
  {
    title: 'DayZ Server Config',
    url: 'https://community.bistudio.com/wiki/DayZ:Server_Configuration',
    description: 'Все параметры конфигурации сервера DayZ',
    icon: FileText,
  },
];

const guides = [
  {
    title: 'DayZ Modding — Полный гайд (YouTube)',
    url: 'https://www.youtube.com/results?search_query=dayz+modding+tutorial+2024',
    description: 'Видеоуроки по созданию модов для DayZ',
  },
  {
    title: 'DayZ Workshop (Steam)',
    url: 'https://steamcommunity.com/app/221100/workshop/',
    description: 'Мастерская Steam — готовые моды и примеры',
  },
  {
    title: 'DayZ Modding Discord',
    url: 'https://discord.gg/dayz',
    description: 'Официальный Discord сервер DayZ — помощь сообщества',
  },
];

export function WikiCenterTab() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">📚 Справочный центр</h2>
        <p className="text-gray-400">Ссылки на документацию, гайды и ресурсы для моддинга DayZ</p>
      </div>

      {/* Official Documentation */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-green-400" />
          Официальная документация
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wikiLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-green-600/50 transition-colors group"
              >
                <Icon size={20} className="text-green-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white group-hover:text-green-400 transition-colors flex items-center gap-1">
                    {link.title}
                    <ExternalLink size={12} className="opacity-50" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{link.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Community Guides */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe size={20} className="text-blue-400" />
          Гайды и сообщество
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guides.map((guide, i) => (
            <a
              key={i}
              href={guide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-600/50 transition-colors group"
            >
              <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                {guide.title}
                <ExternalLink size={12} className="opacity-50" />
              </div>
              <p className="text-xs text-gray-400 mt-2">{guide.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Installation Guide */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">📋 Как установить мод на сервер</h3>
        <div className="space-y-3">
          {[
            'Скачайте DayZ Tools через Steam (библиотека → Инструменты)',
            'Создайте папку мода: @YourModName',
            'Скопируйте файлы мода в созданную папку',
            'Откройте DayZ Tools → Package Builder',
            'Выберите папку addons/ и создайте PBO архив',
            'Подпишите PBO ключом: DayZ Tools → Sign Tool',
            'Скопируйте .bikey в папку keys/',
            'Загрузите папку @YourModName на сервер',
            'Добавьте в параметры запуска: -mod=@YourModName',
            'Перезапустите сервер',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="bg-green-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-gray-300">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PBO Building */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">📦 Как собрать PBO архивы</h3>
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-300">
            ⚠️ Браузер не может создавать бинарные PBO архивы. Используйте внешние инструменты!
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Рекомендуемые инструменты:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-400">●</span>
                <div>
                  <span className="text-sm text-white font-medium">DayZ Tools</span>
                  <span className="text-xs text-gray-400 ml-2">(Steam → Инструменты → DayZ Tools)</span>
                  <p className="text-xs text-gray-500 mt-0.5">Официальный инструмент от Bohemia. Включает Package Builder и Sign Tool.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">●</span>
                <div>
                  <span className="text-sm text-white font-medium">PBO Manager</span>
                  <span className="text-xs text-gray-400 ml-2">(бесплатно)</span>
                  <p className="text-xs text-gray-500 mt-0.5">Позволяет открывать, создавать и редактировать PBO архивы.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">●</span>
                <div>
                  <span className="text-sm text-white font-medium">Mikero's MakePBO</span>
                  <span className="text-xs text-gray-400 ml-2">(продвинутый)</span>
                  <p className="text-xs text-gray-500 mt-0.5">Профессиональный инструмент для сборки PBO. Используется опытными моддерами.</p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Процесс сборки:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              <li>Откройте DayZ Tools → Package Builder</li>
              <li>Выберите исходную папку (ваш мод)</li>
              <li>Укажите выходной PBO файл</li>
              <li>Нажмите "Build" для создания архива</li>
              <li>Подпишите PBO: DayZ Tools → Sign Tool → выберите .bikey/.biprivateKey</li>
              <li>Поместите .bikey в папку keys/ вашего мода</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
