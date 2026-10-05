import { useState } from 'react';
import { useStore, ModFile } from '../store';
import { Folder, File, Plus, Trash2, ChevronRight, ChevronDown, FileCode, FileText, Save } from 'lucide-react';

function FileTreeNode({ file, depth = 0 }: { file: ModFile; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const { removeFile, updateFileContent } = useStore();

  const getFileIcon = () => {
    if (file.type === 'folder') return <Folder size={16} className="text-yellow-400" />;
    if (file.name.endsWith('.c') || file.name.endsWith('.cpp')) return <FileCode size={16} className="text-blue-400" />;
    if (file.name.endsWith('.xml') || file.name.endsWith('.json')) return <FileText size={16} className="text-green-400" />;
    return <File size={16} className="text-gray-400" />;
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:bg-gray-700/50 group ${
          depth > 0 ? 'ml-4' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {file.type === 'folder' && (
          <button onClick={() => setExpanded(!expanded)} className="text-gray-400">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        {file.type === 'file' && <span className="w-3.5" />}
        {getFileIcon()}
        <span className="text-sm text-gray-200 flex-1 truncate">{file.name}</span>
        <div className="hidden group-hover:flex items-center gap-1">
          {file.type === 'file' && (
            <button
              onClick={() => setEditing(!editing)}
              className="text-gray-400 hover:text-green-400 p-1"
              title="Редактировать"
            >
              <FileCode size={14} />
            </button>
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

      {editing && file.type === 'file' && (
        <div className="ml-8 mr-4 mb-2">
          <textarea
            value={file.content}
            onChange={(e) => updateFileContent(file.id, e.target.value)}
            className="w-full h-40 bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm font-mono text-green-300 resize-y focus:outline-none focus:border-green-500"
            placeholder="// Введите содержимое файла..."
          />
          <button
            onClick={() => setEditing(false)}
            className="mt-1 flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
          >
            <Save size={12} /> Сохранить
          </button>
        </div>
      )}

      {file.type === 'folder' && expanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeNode key={child.id} file={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StructureTab() {
  const { project, setProjectName, setProjectDescription, setProjectAuthor, addFile, saveProject } = useStore();
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    const newFile: ModFile = {
      id: Date.now().toString(),
      name: newFileName,
      type: newFileType,
      content: '',
      children: newFileType === 'folder' ? [] : undefined,
    };
    addFile(newFile);
    setNewFileName('');
  };

  const standardFiles = [
    { name: 'mod.cpp', type: 'file' as const },
    { name: 'serverDZ.cfg', type: 'file' as const },
    { name: 'init.c', type: 'file' as const },
    { name: 'types.xml', type: 'file' as const },
    { name: 'econ.xml', type: 'file' as const },
    { name: 'cfggameplay.json', type: 'file' as const },
    { name: 'config.cpp', type: 'file' as const },
    { name: 'scripts', type: 'folder' as const },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">📁 Структура мода</h2>
        <p className="text-gray-400">Визуализация и управление файловой структурой вашего мода DayZ</p>
      </div>

      {/* Project Info */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Информация о проекте</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Название мода</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Автор</label>
            <input
              type="text"
              value={project.author}
              onChange={(e) => setProjectAuthor(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Описание</label>
            <input
              type="text"
              value={project.description}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
        <button
          onClick={saveProject}
          className="mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Save size={16} /> Сохранить проект
        </button>
      </div>

      {/* File Tree */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Файловое дерево</h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 max-h-96 overflow-y-auto">
          {project.files.map((file) => (
            <FileTreeNode key={file.id} file={file} />
          ))}
          {project.files.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              Файлы не добавлены. Используйте кнопки ниже для добавления.
            </p>
          )}
        </div>
      </div>

      {/* Add File */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Добавить файл/папку</h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Имя</label>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
              placeholder="например: MyScript.c"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Тип</label>
            <select
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value as 'file' | 'folder')}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
            >
              <option value="file">Файл</option>
              <option value="folder">Папка</option>
            </select>
          </div>
          <button
            onClick={handleAddFile}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} /> Добавить
          </button>
        </div>
      </div>

      {/* Quick Add Standard Files */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">⚡ Быстрое добавление стандартных файлов</h3>
        <div className="flex flex-wrap gap-2">
          {standardFiles.map((sf) => (
            <button
              key={sf.name}
              onClick={() => {
                addFile({
                  id: Date.now().toString() + Math.random(),
                  name: sf.name,
                  type: sf.type,
                  content: '',
                  children: sf.type === 'folder' ? [] : undefined,
                });
              }}
              className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 px-3 py-2 rounded-lg text-xs transition-colors"
            >
              {sf.type === 'folder' ? <Folder size={12} className="text-yellow-400" /> : <File size={12} className="text-blue-400" />}
              {sf.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
