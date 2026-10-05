import { useState } from 'react';
import { useStore, ModFile } from '../store';
import { scriptSnippets, categories } from '../utils/scriptSnippets';
import { copyToClipboard } from '../utils/exportUtils';
import { Copy, Check, Search, Filter, ArrowDownToLine, Plus, FilePlus } from 'lucide-react';

export function ScriptLibraryTab() {
  const { project } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState(scriptSnippets[0]);
  const [copied, setCopied] = useState(false);
  const [insertedTo, setInsertedTo] = useState<string | null>(null);
  const [showInsertDialog, setShowInsertDialog] = useState(false);

  const filteredSnippets = scriptSnippets.filter((snippet) => {
    const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory;
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  // Получить все файлы проекта
  const getAllFiles = (files: ModFile[]): ModFile[] => {
    const result: ModFile[] = [];
    for (const f of files) {
      if (f.type === 'file') result.push(f);
      if (f.children) result.push(...getAllFiles(f.children));
    }
    return result;
  };

  const allFiles = getAllFiles(project.files);

  // Вставить код в файл
  const handleInsertToFile = (fileId: string) => {
    const file = allFiles.find(f => f.id === fileId);
    if (file) {
      // Добавляем код в конец существующего содержимого
      const existingContent = file.content || '';
      const newContent = existingContent
        ? existingContent + '\n\n// --- Вставлено из библиотеки скриптов ---\n\n' + selectedSnippet.code
        : selectedSnippet.code;
      
      useStore.getState().updateFileContent(fileId, newContent);
      useStore.getState().setSelectedFileId(fileId);
      useStore.getState().setActiveTab('structure');
      setInsertedTo(file.name);
      setShowInsertDialog(false);
      setTimeout(() => setInsertedTo(null), 3000);
    }
  };

  // Создать новый файл с кодом
  const handleCreateNewFile = () => {
    const fileName = prompt('Имя нового файла (например: CustomZombie.c):');
    if (!fileName) return;
    
    // Найти папку scripts или addons
    const findScriptsFolder = (files: ModFile[]): string | undefined => {
      for (const f of files) {
        if (f.name === 'scripts' && f.type === 'folder') return f.id;
        if (f.children) {
          const found = findScriptsFolder(f.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    const scriptsFolderId = findScriptsFolder(project.files);
    
    const newFile: ModFile = {
      id: Date.now().toString() + Math.random(),
      name: fileName,
      type: 'file',
      content: selectedSnippet.code,
    };
    
    useStore.getState().addFile(newFile, scriptsFolderId);
    useStore.getState().setSelectedFileId(newFile.id);
    useStore.getState().setActiveTab('structure');
    setInsertedTo(fileName);
    setTimeout(() => setInsertedTo(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">💻 Библиотека скриптов</h2>
        <p className="text-gray-400">Готовые сниппеты Enforce Script — копируйте или вставляйте прямо в файлы проекта</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск скриптов..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-500"
          >
            <option value="all">Все категории</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Snippet List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-gray-300">Сниппеты ({filteredSnippets.length})</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {filteredSnippets.map((snippet) => (
                <button
                  key={snippet.id}
                  onClick={() => setSelectedSnippet(snippet)}
                  className={`w-full text-left p-3 border-b border-gray-700/50 transition-colors ${
                    selectedSnippet.id === snippet.id
                      ? 'bg-green-600/20 border-l-2 border-l-green-500'
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-sm font-medium text-white">{snippet.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{snippet.category}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{snippet.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedSnippet.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{selectedSnippet.description}</p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => handleCopy(selectedSnippet.code)}
                  className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Скопировано!' : 'Копировать код'}
                </button>
                <button
                  onClick={() => setShowInsertDialog(true)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <ArrowDownToLine size={14} />
                  {insertedTo ? `✓ Вставлено в ${insertedTo}` : 'Вставить в файл'}
                </button>
                <button
                  onClick={handleCreateNewFile}
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <FilePlus size={14} /> Создать новый файл
                </button>
              </div>
            </div>
            <div className="p-4 overflow-x-auto max-h-[400px] overflow-y-auto">
              <pre className="text-sm font-mono leading-relaxed">
                <code>
                  {selectedSnippet.code.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="text-gray-600 select-none w-8 text-right mr-4 shrink-0">
                        {i + 1}
                      </span>
                      <span className={getLineColor(line)}>
                        {line || ' '}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          {/* Syntax Tips */}
          <div className="mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Подсказки по Enforce Script</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Все классы начинаются с заглавной буквы</li>
              <li>• Используйте <code className="text-green-400">modded class</code> для модификации существующих классов</li>
              <li>• <code className="text-green-400">override</code> обязателен при переопределении методов</li>
              <li>• <code className="text-green-400">Print()</code> — вывод в консоль сервера</li>
              <li>• Файлы .c должны быть в папке scripts/ мода</li>
              <li>• Не забудьте добавить config.cpp для новых классов</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Insert Dialog */}
      {showInsertDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-2">Вставить в файл</h3>
            <p className="text-sm text-gray-400 mb-4">
              Выберите существующий файл проекта для вставки кода "{selectedSnippet.title}":
            </p>
            
            {allFiles.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">Нет файлов в проекте</p>
                <p className="text-gray-600 text-xs mt-1">Добавьте файлы через вкладку "Структура мода"</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto mb-4">
                {allFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => handleInsertToFile(file.id)}
                    className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-blue-400 text-xs">📄</span>
                    <span className="text-sm text-gray-200">{file.name}</span>
                    {file.content && (
                      <span className="text-xs text-gray-500 ml-auto">
                        {file.content.length > 0 ? `${Math.round(file.content.length / 100) * 100}+ симв.` : 'пустой'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowInsertDialog(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateNewFile}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                + Новый файл
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getLineColor(line: string): string {
  const trimmed = line.trim();
  if (trimmed.startsWith('//')) return 'text-gray-500';
  if (trimmed.startsWith('class ') || trimmed.startsWith('modded class ')) return 'text-purple-400';
  if (trimmed.startsWith('void ') || trimmed.startsWith('override ') || trimmed.startsWith('static ')) return 'text-blue-400';
  if (trimmed.startsWith('#include') || trimmed.startsWith('#define')) return 'text-yellow-400';
  if (trimmed.includes('Print(')) return 'text-green-400';
  if (trimmed.startsWith('if ') || trimmed.startsWith('else') || trimmed.startsWith('foreach') || trimmed.startsWith('while')) return 'text-orange-400';
  return 'text-gray-200';
}
