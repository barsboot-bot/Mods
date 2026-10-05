import { useState, useEffect } from 'react';
import { useStore, ModFile } from '../store';
import { Folder, File, Plus, Trash2, ChevronRight, ChevronDown, FileCode, FileText, Save, Edit3, X, FolderPlus, FilePlus, ArrowDownToLine } from 'lucide-react';

function FileTreeNode({ file, depth = 0, onSelect }: { file: ModFile; depth?: number; onSelect: (id: string) => void }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const { removeFile, selectedFileId } = useStore();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const isSelected = selectedFileId === file.id;

  const getFileIcon = () => {
    if (file.type === 'folder') return <Folder size={16} className="text-yellow-400" />;
    if (file.name.endsWith('.c') || file.name.endsWith('.cpp')) return <FileCode size={16} className="text-blue-400" />;
    if (file.name.endsWith('.xml') || file.name.endsWith('.json')) return <FileText size={16} className="text-green-400" />;
    return <File size={16} className="text-gray-400" />;
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1.5 px-2 rounded cursor-pointer group transition-colors ${
          isSelected
            ? 'bg-green-600/20 border-l-2 border-l-green-500'
            : 'hover:bg-gray-700/50'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {file.type === 'folder' ? (
          <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-white">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-3.5" />
        )}
        {getFileIcon()}
        <span
          className="text-sm text-gray-200 flex-1 truncate cursor-pointer"
          onClick={() => {
            if (file.type === 'file') {
              onSelect(file.id);
            } else {
              setExpanded(!expanded);
            }
          }}
        >
          {file.name}
        </span>
        <div className="hidden group-hover:flex items-center gap-0.5">
          {file.type === 'folder' && (
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="text-gray-400 hover:text-green-400 p-1"
                title="Добавить в папку"
              >
                <Plus size={14} />
              </button>
              {showAddMenu && (
                <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 min-w-[160px]">
                  <button
                    onClick={() => {
                      const name = prompt('Имя файла:');
                      if (name) {
                        useStore.getState().addFile({
                          id: Date.now().toString() + Math.random(),
                          name,
                          type: 'file',
                          content: '',
                        }, file.id);
                      }
                      setShowAddMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    <FilePlus size={14} className="text-blue-400" /> Новый файл
                  </button>
                  <button
                    onClick={() => {
                      const name = prompt('Имя папки:');
                      if (name) {
                        useStore.getState().addFile({
                          id: Date.now().toString() + Math.random(),
                          name,
                          type: 'folder',
                          content: '',
                          children: [],
                        }, file.id);
                      }
                      setShowAddMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    <FolderPlus size={14} className="text-yellow-400" /> Новая папка
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => removeFile(file.id)}
            className="text-gray-400 hover:text-red-400 p-1"
            title="Удалить"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {file.type === 'folder' && expanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeNode key={child.id} file={child} depth={depth + 1} onSelect={onSelect} />
          ))}
          {file.children.length === 0 && (
            <div
              className="text-xs text-gray-600 italic py-1"
              style={{ paddingLeft: `${(depth + 1) * 16 + 28}px` }}
            >
              пусто — нажмите + чтобы добавить
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CodeEditor() {
  const { project, selectedFileId, updateFileContent, setSelectedFileId } = useStore();
  const [localContent, setLocalContent] = useState('');
  const [saved, setSaved] = useState(false);

  // Найти файл по ID
  const findFile = (files: ModFile[], id: string): ModFile | null => {
    for (const f of files) {
      if (f.id === id) return f;
      if (f.children) {
        const found = findFile(f.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedFile = selectedFileId ? findFile(project.files, selectedFileId) : null;

  // Синхронизация контента при смене файла
  useEffect(() => {
    if (selectedFile) {
      setLocalContent(selectedFile.content || '');
      setSaved(false);
    }
  }, [selectedFileId]);

  const handleSave = () => {
    if (selectedFileId) {
      updateFileContent(selectedFileId, localContent);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleClose = () => {
    setSelectedFileId(null);
  };

  if (!selectedFile) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center min-h-[300px]">
        <FileCode size={48} className="text-gray-600 mb-3" />
        <p className="text-gray-500 text-sm">Выберите файл в дереве для редактирования</p>
        <p className="text-gray-600 text-xs mt-1">Кликните на файл с иконкой 📄</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <FileCode size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-white">{selectedFile.name}</span>
          <span className="text-xs text-gray-500">
            {selectedFile.name.endsWith('.c') || selectedFile.name.endsWith('.cpp') ? 'Enforce Script' :
             selectedFile.name.endsWith('.xml') ? 'XML' :
             selectedFile.name.endsWith('.json') ? 'JSON' :
             selectedFile.name.endsWith('.cfg') || selectedFile.name.endsWith('.cpp') ? 'Config' : 'Text'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-green-400">✓ Сохранено</span>}
          <button
            onClick={handleSave}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs transition-colors"
          >
            <Save size={12} /> Сохранить
          </button>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <textarea
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        className="w-full h-[400px] bg-gray-900 p-4 text-sm font-mono text-green-300 resize-none focus:outline-none leading-relaxed"
        placeholder={`// Содержимое файла ${selectedFile.name}\n// Начните вводить код...`}
        spellCheck={false}
      />
    </div>
  );
}

export function StructureTab() {
  const { project, setProjectName, setProjectDescription, setProjectAuthor, addFile, saveProject, setSelectedFileId, selectedFileId } = useStore();
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');
  const [targetFolderId, setTargetFolderId] = useState<string>('root');

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    const newFile: ModFile = {
      id: Date.now().toString() + Math.random(),
      name: newFileName,
      type: newFileType,
      content: '',
      children: newFileType === 'folder' ? [] : undefined,
    };
    const parentId = targetFolderId === 'root' ? undefined : targetFolderId;
    addFile(newFile, parentId);
    setNewFileName('');
  };

  // Получить список всех папок для выбора
  const getFolders = (files: ModFile[], depth = 0): Array<{ id: string; name: string; depth: number }> => {
    const result: Array<{ id: string; name: string; depth: number }> = [];
    for (const f of files) {
      if (f.type === 'folder') {
        result.push({ id: f.id, name: f.name, depth });
        if (f.children) {
          result.push(...getFolders(f.children, depth + 1));
        }
      }
    }
    return result;
  };

  const folders = getFolders(project.files);

  const standardFiles = [
    { name: 'mod.cpp', type: 'file' as const },
    { name: 'config.cpp', type: 'file' as const },
    { name: 'init.c', type: 'file' as const },
    { name: 'types.xml', type: 'file' as const },
    { name: 'econ.xml', type: 'file' as const },
    { name: 'cfggameplay.json', type: 'file' as const },
    { name: 'PlayerBase.c', type: 'file' as const },
    { name: 'scripts', type: 'folder' as const },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">📁 Структура мода</h2>
        <p className="text-gray-400">Управление файлами и редактирование кода мода</p>
      </div>

      {/* Project Info */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Название мода</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Автор</label>
            <input
              type="text"
              value={project.author}
              onChange={(e) => setProjectAuthor(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Описание</label>
            <input
              type="text"
              value={project.description}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={saveProject}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors w-full justify-center"
            >
              <Save size={14} /> Сохранить
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* File Tree */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Файловое дерево</h3>
            <span className="text-xs text-gray-500">Кликните на файл для редактирования</span>
          </div>
          <div className="p-2 max-h-[400px] overflow-y-auto">
            {project.files.map((file) => (
              <FileTreeNode
                key={file.id}
                file={file}
                onSelect={(id) => setSelectedFileId(id)}
              />
            ))}
            {project.files.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                Добавьте файлы или папки
              </p>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div>
          <CodeEditor />
        </div>
      </div>

      {/* Add File Section */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <ArrowDownToLine size={16} className="text-green-400" />
          Добавить в проект
        </h3>
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Имя</label>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
              placeholder="например: MyScript.c"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Тип</label>
            <select
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value as 'file' | 'folder')}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-green-500"
            >
              <option value="file">Файл</option>
              <option value="folder">Папка</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Куда добавить</label>
            <select
              value={targetFolderId}
              onChange={(e) => setTargetFolderId(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-green-500 min-w-[180px]"
            >
              <option value="root">📁 Корень проекта</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {' '.repeat(f.depth)}📁 {f.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddFile}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            <Plus size={14} /> Добавить
          </button>
        </div>
      </div>

      {/* Quick Add Standard Files */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-white mb-3">⚡ Быстрое добавление стандартных файлов</h3>
        <div className="flex flex-wrap gap-2">
          {standardFiles.map((sf) => (
            <button
              key={sf.name}
              onClick={() => {
                const parentId = targetFolderId === 'root' ? undefined : targetFolderId;
                addFile({
                  id: Date.now().toString() + Math.random(),
                  name: sf.name,
                  type: sf.type,
                  content: '',
                  children: sf.type === 'folder' ? [] : undefined,
                }, parentId);
              }}
              className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              {sf.type === 'folder' ? <Folder size={12} className="text-yellow-400" /> : <File size={12} className="text-blue-400" />}
              {sf.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Файлы будут добавлены в: <span className="text-green-400">
            {targetFolderId === 'root' ? 'Корень проекта' : folders.find(f => f.id === targetFolderId)?.name || 'Корень'}
          </span>
        </p>
      </div>
    </div>
  );
}
