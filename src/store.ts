import { create } from 'zustand';

export interface ModFile {
  id: string;
  name: string;
  type: 'folder' | 'file';
  content: string;
  children?: ModFile[];
}

export interface ModProject {
  id: string;
  name: string;
  description: string;
  author: string;
  files: ModFile[];
  createdAt: string;
}

interface ModConfig {
  modName: string;
  modDir: string;
  modTooltip: string;
  modPicture: string;
}

interface ServerConfig {
  hostname: string;
  maxPlayers: number;
  password: string;
  adminPassword: string;
  enableWhitelist: boolean;
  battlEye: boolean;
  disablePersonalLight: boolean;
  enableDebugMonitor: boolean;
  timeAcceleration: number;
  nightTimeAcceleration: number;
  respawnTime: number;
  serverTimeAcceleration: number;
}

interface AppState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Project
  project: ModProject;
  setProjectName: (name: string) => void;
  setProjectDescription: (desc: string) => void;
  setProjectAuthor: (author: string) => void;
  
  // File operations with parent support
  addFile: (file: ModFile, parentId?: string) => void;
  removeFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  renameFile: (id: string, newName: string) => void;
  
  // UI state
  selectedFileId: string | null;
  setSelectedFileId: (id: string | null) => void;
  
  // Configs
  modConfig: ModConfig;
  setModConfig: (config: Partial<ModConfig>) => void;
  serverConfig: ServerConfig;
  setServerConfig: (config: Partial<ServerConfig>) => void;
  
  // Persistence
  saveProject: () => void;
  loadProject: () => void;
}

const defaultModConfig: ModConfig = {
  modName: 'MyDayZMod',
  modDir: '@MyDayZMod',
  modTooltip: 'Описание мода',
  modPicture: 'mod.paa',
};

const defaultServerConfig: ServerConfig = {
  hostname: 'DayZ Server',
  maxPlayers: 60,
  password: '',
  adminPassword: '',
  enableWhitelist: false,
  battlEye: true,
  disablePersonalLight: false,
  enableDebugMonitor: false,
  timeAcceleration: 1,
  nightTimeAcceleration: 1,
  respawnTime: 5,
  serverTimeAcceleration: 1,
};

const defaultFiles: ModFile[] = [
  {
    id: '1',
    name: '@MyDayZMod',
    type: 'folder',
    content: '',
    children: [
      { id: '2', name: 'mod.cpp', type: 'file', content: '' },
      {
        id: '3',
        name: 'addons',
        type: 'folder',
        content: '',
        children: [],
      },
      {
        id: '4',
        name: 'keys',
        type: 'folder',
        content: '',
        children: [],
      },
    ],
  },
  {
    id: '5',
    name: 'mpmissions',
    type: 'folder',
    content: '',
    children: [
      {
        id: '6',
        name: 'dayzOffline.chernarusplus',
        type: 'folder',
        content: '',
        children: [
          { id: '7', name: 'init.c', type: 'file', content: '' },
          { id: '8', name: 'types.xml', type: 'file', content: '' },
          { id: '9', name: 'econ.xml', type: 'file', content: '' },
          { id: '10', name: 'cfggameplay.json', type: 'file', content: '' },
        ],
      },
    ],
  },
];

const defaultProject: ModProject = {
  id: 'default',
  name: 'MyDayZMod',
  description: 'Мой мод для DayZ',
  author: 'Author',
  files: defaultFiles,
  createdAt: new Date().toISOString(),
};

export const useStore = create<AppState>((set, get) => ({
  activeTab: 'structure',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  project: defaultProject,
  setProjectName: (name) => set((state) => ({
    project: { ...state.project, name }
  })),
  setProjectDescription: (desc) => set((state) => ({
    project: { ...state.project, description: desc }
  })),
  setProjectAuthor: (author) => set((state) => ({
    project: { ...state.project, author }
  })),
  
  addFile: (file, parentId) => {
    if (!parentId) {
      // Добавляем в корень
      set((state) => ({
        project: { ...state.project, files: [...state.project.files, file] }
      }));
    } else {
      // Добавляем в указанную папку
      const addToParent = (files: ModFile[]): ModFile[] => {
        return files.map(f => {
          if (f.id === parentId && f.type === 'folder') {
            return { ...f, children: [...(f.children || []), file] };
          }
          if (f.children) {
            return { ...f, children: addToParent(f.children) };
          }
          return f;
        });
      };
      set((state) => ({
        project: { ...state.project, files: addToParent(state.project.files) }
      }));
    }
  },
  
  removeFile: (id) => {
    const removeById = (files: ModFile[]): ModFile[] => {
      return files
        .filter(f => f.id !== id)
        .map(f => ({
          ...f,
          children: f.children ? removeById(f.children) : undefined
        }));
    };
    set((state) => ({
      project: { ...state.project, files: removeById(state.project.files) }
    }));
  },
  
  updateFileContent: (id, content) => {
    const updateContent = (files: ModFile[]): ModFile[] => {
      return files.map(f => {
        if (f.id === id) return { ...f, content };
        if (f.children) return { ...f, children: updateContent(f.children) };
        return f;
      });
    };
    set((state) => ({
      project: { ...state.project, files: updateContent(state.project.files) }
    }));
  },
  
  renameFile: (id, newName) => {
    const renameById = (files: ModFile[]): ModFile[] => {
      return files.map(f => {
        if (f.id === id) return { ...f, name: newName };
        if (f.children) return { ...f, children: renameById(f.children) };
        return f;
      });
    };
    set((state) => ({
      project: { ...state.project, files: renameById(state.project.files) }
    }));
  },
  
  selectedFileId: null,
  setSelectedFileId: (id) => set({ selectedFileId: id }),
  
  modConfig: defaultModConfig,
  setModConfig: (config) => set((state) => ({
    modConfig: { ...state.modConfig, ...config }
  })),
  serverConfig: defaultServerConfig,
  setServerConfig: (config) => set((state) => ({
    serverConfig: { ...state.serverConfig, ...config }
  })),
  
  saveProject: () => {
    const state = get();
    localStorage.setItem('dayz-mod-project', JSON.stringify({
      project: state.project,
      modConfig: state.modConfig,
      serverConfig: state.serverConfig,
    }));
  },
  loadProject: () => {
    const saved = localStorage.getItem('dayz-mod-project');
    if (saved) {
      const data = JSON.parse(saved);
      set({
        project: data.project || defaultProject,
        modConfig: data.modConfig || defaultModConfig,
        serverConfig: data.serverConfig || defaultServerConfig,
      });
    }
  },
}));
