import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ModFile } from '../store';
import { generateModCpp, generateServerDZCfg, generateInitC, generateTypesXml, generateEconXml, generateCfgGameplay } from './configGenerators';

function flattenFiles(files: ModFile[], path: string = ''): Array<{ path: string; content: string }> {
  const result: Array<{ path: string; content: string }> = [];
  
  for (const file of files) {
    const currentPath = path ? `${path}/${file.name}` : file.name;
    
    if (file.type === 'folder') {
      if (file.children && file.children.length > 0) {
        result.push(...flattenFiles(file.children, currentPath));
      } else {
        // Пустая папка — добавляем её тоже
        result.push({ path: currentPath, content: '' });
      }
    } else {
      result.push({ path: currentPath, content: file.content || '' });
    }
  }
  
  return result;
}

export async function exportProjectAsZip(
  files: ModFile[],
  modConfig: { modName: string; modDir: string; modTooltip: string; modPicture: string },
  serverConfig: any
): Promise<void> {
  const zip = new JSZip();
  
  // Генерируем содержимое для стандартных файлов
  const modCppContent = generateModCpp(modConfig);
  const serverCfgContent = generateServerDZCfg(serverConfig);
  const initCContent = generateInitC();
  const typesXmlContent = generateTypesXml();
  const econXmlContent = generateEconXml();
  const cfgGameplayContent = generateCfgGameplay();
  
  // Добавляем файлы проекта
  const flatFiles = flattenFiles(files);
  
  for (const file of flatFiles) {
    let content = file.content;
    
    // Если файл пустой — генерируем стандартное содержимое
    if (!content || content.trim() === '') {
      if (file.path.endsWith('mod.cpp')) {
        content = modCppContent;
      } else if (file.path.endsWith('init.c')) {
        content = initCContent;
      } else if (file.path.endsWith('types.xml')) {
        content = typesXmlContent;
      } else if (file.path.endsWith('econ.xml')) {
        content = econXmlContent;
      } else if (file.path.endsWith('cfggameplay.json')) {
        content = cfgGameplayContent;
      }
    }
    
    if (content) {
      zip.file(file.path, content);
    } else if (file.path && !file.path.includes('.')) {
      // Это папка
      zip.folder(file.path);
    }
  }
  
  // Добавляем serverDZ.cfg в корень
  zip.file('serverDZ.cfg', serverCfgContent);
  
  // Добавляем README
  zip.file('README.md', `# ${modConfig.modName}

## Описание
${modConfig.modTooltip}

## Автор
${modConfig.modName}

## Установка
1. Распакуйте архив в папку сервера DayZ
2. Соберите PBO архивы с помощью DayZ Tools
3. Добавьте мод в стартовые параметры сервера: -mod=${modConfig.modDir}
4. Перезапустите сервер

## Структура
- mod.cpp - описание мода
- addons/ - PBO архивы
- keys/ - ключи подписи
- mpmissions/ - миссии сервера

## Инструменты
- DayZ Tools (Steam)
- PBO Manager
- Notepad++ / VS Code

---
Создано с помощью DayZ Mod Maker
`);
  
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${modConfig.modName}_mod.zip`);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
