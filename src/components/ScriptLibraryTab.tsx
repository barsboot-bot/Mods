import { useState } from 'react';
import { scriptSnippets, categories } from '../utils/scriptSnippets';
import { copyToClipboard } from '../utils/exportUtils';
import { Copy, Check, Search, Filter } from 'lucide-react';

export function ScriptLibraryTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState(scriptSnippets[0]);
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">💻 Библиотека скриптов</h2>
        <p className="text-gray-400">Готовые сниппеты Enforce Script для DayZ Standalone</p>
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
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedSnippet.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{selectedSnippet.description}</p>
              </div>
              <button
                onClick={() => handleCopy(selectedSnippet.code)}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-2 rounded-lg text-sm transition-colors shrink-0"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
            <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
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
