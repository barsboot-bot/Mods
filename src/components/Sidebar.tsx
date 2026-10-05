import { useStore } from '../store';
import { FolderTree, Settings, Code, BookOpen, HelpCircle, Download } from 'lucide-react';

const tabs = [
  { id: 'structure', label: 'Структура мода', icon: FolderTree },
  { id: 'configs', label: 'Генератор конфигов', icon: Settings },
  { id: 'scripts', label: 'Библиотека скриптов', icon: Code },
  { id: 'wiki', label: 'Справочник', icon: BookOpen },
  { id: 'help', label: 'Помощь', icon: HelpCircle },
  { id: 'export', label: 'Экспорт проекта', icon: Download },
];

export function Sidebar() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col gap-2">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Навигация
        </h2>
      </div>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              isActive
                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        );
      })}
      
      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          <p>DayZ Mod Maker</p>
          <p className="mt-1">Данные сохраняются в браузере</p>
        </div>
      </div>
    </aside>
  );
}
