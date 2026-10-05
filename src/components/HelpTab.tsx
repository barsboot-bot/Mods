import { AlertTriangle, CheckCircle, Wrench, BookOpen, Lightbulb } from 'lucide-react';

export function HelpTab() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">❓ Помощь</h2>
        <p className="text-gray-400">Пошаговые инструкции и полезные советы для моддинга DayZ</p>
      </div>

      {/* Step-by-step Guide */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-green-400" />
          Пошаговый гайд: Создание мода с нуля
        </h3>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: 'Создание папки мода',
              description: 'Создайте папку @YourModName в директории DayZ сервера. Внутри создайте подпапки: addons/, keys/, scripts/.',
              tip: 'Используйте вкладку "Структура мода" для визуального управления файлами.',
            },
            {
              step: 2,
              title: 'Генерация конфигов',
              description: 'Создайте mod.cpp (описание мода), serverDZ.cfg (настройки сервера), types.xml (спавн лута).',
              tip: 'Используйте "Генератор конфигов" для автоматического создания файлов с правильным синтаксисом.',
            },
            {
              step: 3,
              title: 'Написание скриптов',
              description: 'Создайте .c файлы в папке scripts/. Используйте Enforce Script для логики мода.',
              tip: 'В "Библиотеке скриптов" есть готовые сниппеты для типичных задач.',
            },
            {
              step: 4,
              title: 'Упаковка в PBO',
              description: 'Используйте DayZ Tools (Package Builder) для создания PBO архивов из папки addons/.',
              tip: 'Не забудьте подписать PBO ключом! .bikey файл должен быть в keys/.',
            },
            {
              step: 5,
              title: 'Загрузка на сервер',
              description: 'Скопируйте папку @YourModName на сервер. Добавьте -mod=@YourModName в параметры запуска.',
              tip: 'Перезапустите сервер после загрузки. Проверьте логи на наличие ошибок.',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {item.step}
                </div>
                {item.step < 5 && <div className="w-0.5 h-full bg-gray-700 mt-2" />}
              </div>
              <div className="pb-4">
                <h4 className="text-white font-medium">{item.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                <div className="flex items-start gap-1.5 mt-2">
                  <Lightbulb size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-yellow-300/80">{item.tip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Syntax Warnings */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-yellow-400" />
          Предупреждения о синтаксисе Enforce Script
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Точки с запятой обязательны',
              description: 'Каждое утверждение должно заканчиваться ; (точка с запятой).',
              bad: 'int x = 5\nPrint("hello")',
              good: 'int x = 5;\nPrint("hello");',
            },
            {
              title: 'Классы с заглавной буквы',
              description: 'Имена классов всегда начинаются с заглавной буквы.',
              bad: 'class myClass {}',
              good: 'class MyClass {}',
            },
            {
              title: 'Override обязателен',
              description: 'При переопределении метода родительского класса используйте override.',
              bad: 'void OnInit() {}',
              good: 'override void OnInit() {}',
            },
            {
              title: 'Modded для модификации',
              description: 'Для модификации существующих классов используйте modded.',
              bad: 'class PlayerBase { ... }',
              good: 'modded class PlayerBase { ... }',
            },
            {
              title: 'Типы данных',
              description: 'Enforce Script строго типизирован. Указывайте типы переменных.',
              bad: 'x = 5;',
              good: 'int x = 5;',
            },
            {
              title: 'String конкатенация',
              description: 'Используйте + для объединения строк.',
              bad: 'Print("Value: " x)',
              good: 'Print("Value: " + x)',
            },
          ].map((warning, i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm font-medium text-yellow-400 mb-2">{warning.title}</h4>
              <p className="text-xs text-gray-400 mb-3">{warning.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-red-400 font-medium">✗ Неправильно:</span>
                  <pre className="text-xs text-red-300/80 bg-red-900/20 rounded p-2 mt-1 overflow-x-auto">
                    {warning.bad}
                  </pre>
                </div>
                <div>
                  <span className="text-xs text-green-400 font-medium">✓ Правильно:</span>
                  <pre className="text-xs text-green-300/80 bg-green-900/20 rounded p-2 mt-1 overflow-x-auto">
                    {warning.good}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Tools */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Wrench size={20} className="text-blue-400" />
          Необходимые инструменты
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'DayZ Tools',
              description: 'Официальный набор инструментов от Bohemia Interactive. Включает Package Builder, Sign Tool, и Workbench.',
              install: 'Steam → Библиотека → Инструменты → DayZ Tools',
              required: true,
            },
            {
              name: 'Notepad++ / VS Code',
              description: 'Редактор кода с подсветкой синтаксиса. Для VS Code есть расширение "Enforce Script".',
              install: 'Скачать с официального сайта',
              required: true,
            },
            {
              name: 'PBO Manager',
              description: 'Бесплатный инструмент для работы с PBO архивами. Позволяет открывать, создавать и распаковывать.',
              install: 'armaholic.com или GitHub',
              required: true,
            },
            {
              name: 'DayZ Server',
              description: 'Выделенный сервер DayZ. Нужен для тестирования модов.',
              install: 'Steam → Библиотека → Инструменты → DayZ Server',
              required: true,
            },
            {
              name: 'Texture Tool',
              description: 'Конвертация текстур в формат .paa. Часть DayZ Tools.',
              install: 'Входит в DayZ Tools',
              required: false,
            },
            {
              name: 'Object Builder',
              description: 'Создание и редактирование 3D моделей. Часть DayZ Tools.',
              install: 'Входит в DayZ Tools',
              required: false,
            },
          ].map((tool, i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className={tool.required ? 'text-green-400' : 'text-gray-500'} />
                <h4 className="text-sm font-medium text-white">{tool.name}</h4>
                {tool.required && (
                  <span className="text-xs bg-green-600/20 text-green-400 px-1.5 py-0.5 rounded">Обязательно</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-2">{tool.description}</p>
              <p className="text-xs text-gray-500">
                <span className="text-gray-400">Установка:</span> {tool.install}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
