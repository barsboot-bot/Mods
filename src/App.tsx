import { useEffect } from 'react';
import { useStore } from './store';
import { Sidebar } from './components/Sidebar';
import { StructureTab } from './components/StructureTab';
import { ConfigGeneratorTab } from './components/ConfigGeneratorTab';
import { ScriptLibraryTab } from './components/ScriptLibraryTab';
import { WikiCenterTab } from './components/WikiCenterTab';
import { HelpTab } from './components/HelpTab';
import { ExportTab } from './components/ExportTab';

function App() {
  const { activeTab, loadProject } = useStore();

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const renderTab = () => {
    switch (activeTab) {
      case 'structure':
        return <StructureTab />;
      case 'configs':
        return <ConfigGeneratorTab />;
      case 'scripts':
        return <ScriptLibraryTab />;
      case 'wiki':
        return <WikiCenterTab />;
      case 'help':
        return <HelpTab />;
      case 'export':
        return <ExportTab />;
      default:
        return <StructureTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">DZ</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-400">DayZ Mod Maker</h1>
            <p className="text-xs text-gray-400">Конструктор модов для DayZ Standalone</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          v1.0 | Enforce Script Helper
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}

export default App;
