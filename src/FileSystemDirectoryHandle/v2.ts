type X2ExistAction = 'ThrowError' | 'ignore';
type X2NotExistAction = 'ThrowError' | 'ignore';

const defaultDebugMode = false;
const defaultForce = false;

// 各种操作支持路径: a/b/c/a.js
interface FileSystemDirectoryHandle {
  // ------------------ 目录操作 ------------------
  x2DirectoryCreate: (dirpath: string, opts?: Partial<X2DirCreateOpts>) => Promise<[boolean, FileSystemDirectoryHandle | null]>;
  /** 清空当前目录下的所有文件和子目录:  dirHandle.remove() 方法并非标准方法,chrome110开始支持的 */
  x2Clear: (opts?: Partial<x2ClearOpts>) => Promise<boolean>;
  x2ParentHandle: (sourceFilepathOrDirpath: string, opts?: Partial<x2PHandleOpts>) => Promise<FileSystemDirectoryHandle | null>;
  x2Overview: (opts?: Partial<X2DirOverviewOpts>) => Promise<X2DirOverviewResult | null>;
  // ------------------ 文件操作 ------------------
  x2FileCreate: (filepath: string, opts?: Partial<X2FileCreateOpts>) => Promise<[boolean, FileSystemFileHandle | null]>;
  x2FileSave: (filepath: string, str?: string | File, opts?: Partial<X2FileSaveOpts>) => Promise<boolean>;
  x2FileReadText: (filepath: string, opts?: Partial<X2FileReadOpts>) => Promise<[string | null, File | null]>;
  x2FileReadJSON: (filepath: string, opts?: Partial<X2FileReadJSONOpts>) => Promise<object | null>;
  // ------------------ 其他 - 文件+目录 ------------------
  x2Exist: (fileOrDir: string, opts?: Partial<x2ExistOpts>) => Promise<[boolean, FileSystemHandle | null]>;
  x2DirectoryExist: (dirpath: string, opts?: Partial<X2DirExistOpts>) => Promise<[boolean, FileSystemDirectoryHandle | null]>;
  x2FileExist: (filepath: string, opts?: Partial<X2FileExistOpts>) => Promise<[boolean, FileSystemFileHandle | null]>;
  x2Delete: (filepathOrDirPath: string, opts?: Partial<x2DeleteOpts>) => Promise<boolean>;
  x2Copy: (sourceFilepathOrDirPath: string, targetFilepathOrDirpath: string, opts?: Partial<x2CopyOpts>) => Promise<boolean>;
  x2Move: (sourceFilepathOrDirPath: string, targetFilepathOrDirpath: string, opts?: Partial<x2MoveOpts>) => Promise<boolean>;
  /** 修改 最后一级文件或目录 的名称。dir为空=修改当前目录名 */
  x2Rename: (sourceFilepathOrDirPath: string, targetName: string, opts?: Partial<x2RenameOpts>) => Promise<boolean>;
}


//---------------------------------------------------------------
//--------------------------- 目录相关 ---------------------------
//---------------------------------------------------------------
FileSystemDirectoryHandle.prototype.x2DirectoryCreate = async function (dirpath, _opts) {
  try {
    const opts: X2DirCreateOpts = {
      debugMode: _opts?.debugMode || defaultDebugMode,
      exist: _opts?.exist || 'ignore',
    };
    logger(opts.debugMode, 'x2DirectoryCreate', opts);
  
    const dirList = dirpath.split('/');
    let pHandle: FileSystemDirectoryHandle = this;
  
    for (const item of dirList) {
      let [exist, itemHandle] = await pHandle.xDirectoryExit(item);
      if (!exist) { // 不存在时新增
        [, itemHandle] = await pHandle.xDirectoryCreate(item, { exist: 'ThrowError' });
      }
      pHandle = itemHandle!;
    }
  
    return [true, pHandle]
  } catch(err) {
    console.error(err);
    return [false, null]
  }
}

FileSystemDirectoryHandle.prototype.x2ParentHandle = async function(sourceFilepathOrDirpath, _opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const opts: x2PHandleOpts = { debugMode, sourceNotExist: _opts?.sourceNotExist || 'ignore' };
    const sourcePath = sourceFilepathOrDirpath || '';

    let result: FileSystemDirectoryHandle | null = null;

    const parentDirPath = sourcePath.substring(0, sourcePath.lastIndexOf('/'));
    if (parentDirPath) {
      [, result] = await this.x2DirectoryExist(parentDirPath);
    } else {
      result = this;
    }
    if (!result) throw new Error(`父目录不存在: ${parentDirPath}`);

    if (opts.sourceNotExist === 'ThrowError') {
      const sourceName = sourcePath.split('/').pop() as string;
      const [sExist,sHandle] = await result.x2Exist(sourceName, { debugMode });
      if (!sExist || !sHandle) throw new Error(`源文件不存在: ${sourceName}`);
    }

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }

}

FileSystemDirectoryHandle.prototype.x2Clear = async function(_opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const opts: x2ClearOpts = { debugMode, deleteSelf: _opts?.deleteSelf || false };

    // 1、清空内容
    const promiseList: Promise<boolean>[] = [];
    for await (let childFileName of (await this.keys())) {
      promiseList.push(this.x2Delete(childFileName, { debugMode }));
    }
    const resList = await Promise.all(promiseList);
    if (resList.filter(it => !it).length > 0) throw new Error(`删除失败: 成功${resList.filter(it => it).length}个、失败${resList.filter(it => !it).length}个`);

    // 2、删除自己
    if (opts.deleteSelf) {
      if (typeof this.remove === 'function') throw new Error('目录下的内容已清空, 但无法删除自己: 该浏览器不支持 dirHandle.remove() 函数');
      await (this as any).remove({ recursive: true });
    }

    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
}

FileSystemDirectoryHandle.prototype.x2Overview = async function(_opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const maxLevel = typeof _opts?.maxLevel !== 'number' ? Number.POSITIVE_INFINITY : Math.max(0, _opts?.maxLevel || 0) || Number.POSITIVE_INFINITY;
    const opts: X2DirOverviewOpts = {
      debugMode, maxLevel,
      ignoreList: _opts?.ignoreList || [],
      ignoreDotFile: _opts?.ignoreDotFile || false,
      ignoreDotDir: _opts?.ignoreDotDir || false,
    };
    logger(debugMode, "x2Overview opts:", opts);

    // 根据 maxLevel、ignoreXXX 来校验该 path 是否需要忽略
    const isValidPath = (path: string, kind: FileSystemHandleKind) => {
      const name = path.substring(path.lastIndexOf('/') + 1);
      if (opts.ignoreDotFile && kind === 'file' && /^\./.test(name)) return false;
      if (opts.ignoreDotDir && kind === 'directory' && /^\./.test(name)) return false;
      for (const ignore of opts.ignoreList || []) {
        if (typeof ignore === 'string' && ignore === path) return false;
        if (ignore instanceof RegExp && ignore.test(path)) return false;
      }
      return true;
    }
  
    const resTree: X2DirOverviewResult_TreeItem[] = [];
    const resList: X2DirOverviewResult_Item[] = [];

    async function itemDirOverview(handler: FileSystemDirectoryHandle, prefix: string, level: number): Promise<X2DirOverviewResult_TreeItem[]> {
      if (level > maxLevel) return [];
      const isLastLevel = level >= maxLevel;

      const returnList: X2DirOverviewResult_TreeItem[] = [];

      for await (const [name, subHandler] of (await handler.entries())) {

        const itemPath = getPath(prefix, name);
        if (!isValidPath(itemPath, subHandler.kind)) continue;

        const tempItem: X2DirOverviewResult_Item = { name, path: itemPath, level, isLastLevel, kind: subHandler.kind };
        resList.push(tempItem);
        
        if (subHandler.kind === 'file') {
          resTree.push({ ...tempItem });
          returnList.push({ ...tempItem });
        }
        if (subHandler.kind === 'directory') {
          const children = await itemDirOverview(subHandler as FileSystemDirectoryHandle, itemPath, level+1);

          resTree.push({ ...tempItem, children });
          returnList.push({ ...tempItem, children });
        }
      }
  
      
      return returnList;
    }

    await itemDirOverview(this, '', 1);
    const result: X2DirOverviewResult = {
      tree: resTree,
      list: resList,
      listPath: resList.map(it => it.path),
    };
    return result;
  } catch(err) {
    console.error(err);
    return null;
  }
}



//---------------------------------------------------------------
//--------------------------- 文件相关 ---------------------------
//---------------------------------------------------------------
FileSystemDirectoryHandle.prototype.x2FileCreate = async function (filepath, _opts) {
  try {
    const opts: X2DirCreateOpts = {
      debugMode: _opts?.debugMode || defaultDebugMode,
      exist: _opts?.exist || 'ignore',
    };
    logger(opts.debugMode, 'x2FileCreate', opts);

    const dirList = filepath.split('/');
    const fileName = dirList.pop();
    if (!fileName) throw new Error(`文件名为空: ${fileName}`);
    // 创建前置目录
    let pHandle = this;
    if (dirList.length > 0) {
      const [ok, _pHandle] = await this.x2DirectoryCreate(dirList.join('/'));
      if (!ok || !_pHandle) throw new Error(`前置目录创建失败: ${dirList.join('/')}`);
      pHandle = _pHandle;
    }
    // 文件不存在, 则创建文件
    let [exist, fileHandle] = await pHandle.xFileExit(fileName);
    if (!exist || !fileHandle) { // 文件不存在时: 新增文件
      fileHandle = await pHandle.getFileHandle(fileName, { create: true });  
    }
    return [true, fileHandle]
  } catch(err) {
    console.error(err);
    return [false, null]
  }
}

FileSystemDirectoryHandle.prototype.x2FileSave = async function (filepath, str, _opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const [ok, fileHandle] = await this.x2FileCreate(filepath, { debugMode, exist: 'ignore' })
    if (!ok || !fileHandle) throw new Error(`文件保存失败: ${filepath} 创建失败`);
    await writeFile(fileHandle, str || '');
    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
}

FileSystemDirectoryHandle.prototype.x2FileReadText = async function (filepath, _opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const [exist, fileHandle] = await this.x2FileExist(filepath, { debugMode });
    if (!exist || !fileHandle) throw new Error(`文件不存在: ${filepath}`);

    const file = await fileHandle.getFile();
    const contentStr = await getStringFromFile(file);

    return [contentStr, file];
  } catch(err) {
    console.error(err);
    return [null, null];
  }
}

FileSystemDirectoryHandle.prototype.x2FileReadJSON = async function (filepath, _opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const [exist, fileHandle] = await this.x2FileExist(filepath, { debugMode });
    if (!exist || !fileHandle) throw new Error(`文件不存在: ${filepath}`);

    const file = await fileHandle.getFile();
    if (file.type !== 'application/json') {
      throw new Error(`文件类型错误: ${filepath} 类型为 ${file.type}。而不是 application/json`);
    }
    const contentStr = await getStringFromFile(file);
    const json = JSON.parse(contentStr);

    return json;
  } catch(err) {
    console.error(err);
    return null;
  }
}

//---------------------------------------------------------------
//--------------------------- 其他: 文件+目录 ---------------------
//---------------------------------------------------------------
FileSystemDirectoryHandle.prototype.x2Exist = async function (filepath, _opts) {
  try {
    const opts: X2FileExistOpts = {
      debugMode: _opts?.debugMode || defaultDebugMode,
    };
    logger(opts.debugMode, 'x2FileExist', opts);

    const dirList = filepath.split('/');
    const lastStr = dirList.pop();
    if (!lastStr) throw new Error(`文件名或目录名非法: ${lastStr}`);

    const [dirExist, dirHandle] = await this.x2DirectoryExist(dirList.join('/'));
    if (!dirExist || !dirHandle) throw new Error(`前置目录不存在: ${dirList.join("/")}`);

    let lastHandle: FileSystemHandle = await dirHandle.getDirectoryHandle(lastStr, { create: false });
    if (!lastHandle) lastHandle = await dirHandle.getFileHandle(lastStr, { create: false });

    return [true, lastHandle];
  } catch(err) {
    console.error(err);
    return [false,null];
  }
}
FileSystemDirectoryHandle.prototype.x2DirectoryExist = async function (dirpath, _opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const opts: X2DirExistOpts = { debugMode };
    logger(opts.debugMode, 'x2DirectoryExist', opts);

    const [exist, lastHandle] = await this.x2Exist(dirpath, { debugMode });
    if (!exist || !lastHandle || lastHandle.kind !== 'directory') throw new Error(`结果不符合预期: exist=${exist}, kind=${lastHandle?.kind}`);

    return [true, lastHandle as FileSystemDirectoryHandle]
  } catch(err) {
    console.error(err);
    return [false, null]
  }
}
FileSystemDirectoryHandle.prototype.x2FileExist = async function (filepath, _opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const opts: X2DirExistOpts = { debugMode };
    logger(opts.debugMode, 'x2FileExist', opts);

    const [exist, lastHandle] = await this.x2Exist(filepath, { debugMode });
    if (!exist || !lastHandle || lastHandle.kind !== 'file') throw new Error(`结果不符合预期: exist=${exist}, kind=${lastHandle?.kind}`);

    return [true, lastHandle as FileSystemFileHandle]
  } catch(err) {
    console.error(err);
    return [false, null]
  }
}


FileSystemDirectoryHandle.prototype.x2Delete = async function (filepathOrDirPath, _opts) {
  try {
    if (!filepathOrDirPath) throw new Error(`参数 ${filepathOrDirPath} 不能为空`);
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const force = _opts?.force || defaultForce;
    const opts: x2DeleteOpts = { debugMode, force };
    logger(opts.debugMode, 'x2Delete', opts);

    // 获取 parentHandle
    const parentHandle = await this.x2ParentHandle(filepathOrDirPath, { debugMode, sourceNotExist: 'ignore' });
    if (!parentHandle) throw new Error(`parentHandle 获取失败`);

    // 删除 该目录或文件:  removeEntry删除的文件不存在时会报错
    const lastName = filepathOrDirPath.split('/').pop();
    if (!lastName) throw new Error(`最后一级的文件/目录名非法: ${lastName}`);
    const [exist] = await parentHandle.x2Exist(lastName, { debugMode });
    if (exist) {
      parentHandle.removeEntry(lastName, { recursive: force ? true : false });
    }
    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
}

/**
 * 复制文件: x2Copy('dir1/a.js', 'dir2/b.js')
 * 复制目录: x2Copy('dir1/v1', 'dir2/v2')
 * 
 * 目标已存在时: kind 必须与 source的类型相同
 */
FileSystemDirectoryHandle.prototype.x2Copy = async function(sourceFilepathOrDirPath, targetFilepathOrDirpath, _opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const opts: x2CopyOpts = { debugMode, targetExist: _opts?.targetExist || 'error' };

    if (!sourceFilepathOrDirPath) throw new Error(`参数 sourceFilepathOrDirPath 不能为空`);
    if (!targetFilepathOrDirpath) throw new Error(`参数 targetFilepathOrDirpath 不能为空`);

    // 数据准备 && 异常处理
    const [sExist, sHandle] = await this.x2Exist(sourceFilepathOrDirPath);
    if (!sExist || !sHandle) throw new Error(`源文件或目录不存在: ${sourceFilepathOrDirPath}`);
    const kind = sHandle?.kind;
    const [tExist, tHandle] = await this.x2Exist(targetFilepathOrDirpath);
    if (tExist && !tHandle) throw new Error('程序异常: tExist=true, 但 tHandle 为空');
    if (tExist && kind !== tHandle?.kind) throw new Error(`target已存在, 且与source的类型不同: source=${kind}, target=${tHandle?.kind}`);
    if (tExist && opts.targetExist === 'error') throw new Error(`target已存在: ${targetFilepathOrDirpath}`);
    // target已存在 && 操作对象为目录 && replace模式
    if (tExist && opts.targetExist === 'replace' && tHandle?.kind === 'directory') {
      await (tHandle as FileSystemDirectoryHandle).x2Clear({ debugMode, deleteSelf: false });
    }

    // 操作对象=文件   先创建target(不存在时) --> 再写入
    if (kind === 'file') {
      // 创建
      let tHandle2: FileSystemFileHandle | null = tHandle as FileSystemFileHandle;
      if (!tHandle2) {
        [,tHandle2] = await this.x2FileCreate(targetFilepathOrDirpath, { debugMode, exist: 'ignore' });
      }
      if (!tHandle2) throw new Error(`创建文件失败: tHandle2为空`);
      // 写入
      const sFile = await (sHandle as FileSystemFileHandle).getFile();
      await writeFile(tHandle2, sFile);
    }

    // 操作对象=目录
    if (kind === 'directory') {
      // 创建
      let tHandle2: FileSystemDirectoryHandle | null = tHandle as FileSystemDirectoryHandle;
      if (!tHandle2) {
        [,tHandle2] = await this.x2DirectoryCreate(targetFilepathOrDirpath, { debugMode, exist: 'ignore' });
      }
      if (!tHandle2) throw new Error(`创建文件失败: tHandle2为空`);
      // 复制目录
      await copyDirectory2(sHandle as FileSystemDirectoryHandle, tHandle2);
    }
    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
}

FileSystemDirectoryHandle.prototype.x2Move = async function(sourceFilepathOrDirPath, targetFilepathOrDirpath, _opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const opts: x2MoveOpts = { debugMode, targetExist: _opts?.targetExist || 'error' };

    if (!sourceFilepathOrDirPath) throw new Error(`参数 sourceFilepathOrDirPath 不能为空`);
    if (!targetFilepathOrDirpath) throw new Error(`参数 targetFilepathOrDirpath 不能为空`);

    const copyOk = await this.x2Copy(sourceFilepathOrDirPath, targetFilepathOrDirpath, opts);
    if (!copyOk) throw new Error('复制失败');

    await this.x2Delete(sourceFilepathOrDirPath);

    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
}

FileSystemDirectoryHandle.prototype.x2Rename = async function (sourceFilepathOrDirPath, targetName, _opts) {
  try {
    const debugMode = _opts?.debugMode || defaultDebugMode;
    const opts: x2RenameOpts = { debugMode };

    if (!sourceFilepathOrDirPath) throw new Error(`参数 sourceFilepathOrDirPath 不能为空`);
    if (!targetName) throw new Error(`参数 targetName 不能为空`);
    if (targetName.indexOf('/') >= 0) throw new Error(`参数 targetName 不能包含'/'字符`);

    let [sExist, sHandle] = await this.x2Exist(sourceFilepathOrDirPath, { debugMode });
    if (!sExist || !sHandle) throw new Error(`源文件或目录不存在: ${sourceFilepathOrDirPath}`);

    const pHandle = await this.x2ParentHandle(sourceFilepathOrDirPath);
    if (!pHandle) throw new Error('源文件的父目录不存在');
    const [tExist, tHandle] = await pHandle.x2Exist(targetName, { debugMode });
    if (tExist || tHandle) throw new Error(`目标文件或目录已存在: ${targetName}`);

    // 通过 x2Move 来实现 名称修改
    const sourceName = sourceFilepathOrDirPath.split('/').pop() as string;
    await pHandle.x2Move(sourceName, targetName, { debugMode, targetExist: 'error' });

    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
}


function logger(debugMode: boolean, name: string, ...rest: any[]) {
  if (!debugMode) return;
  console.log(name, ...rest);
}

function getPath(prefix: string, name: string) {
  return prefix ? `${prefix}/${name}` : name;
};

function getStringFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      resolve(e.target.result);
    }
    reader.readAsText(file);
  });
}

async function writeFile(fileHandle: FileSystemFileHandle, fileOrStr: File | string) {
  if (typeof fileOrStr !== 'string' && !(fileOrStr instanceof File)) throw new Error(`参数 fileOrStr 类型不符合预期: ${typeof fileOrStr}`);
  if (fileHandle.kind !== 'file') throw new Error(`不符合预期: fileHandle.kind=${fileHandle.kind}`);
  let writable: FileSystemWritableFileStream | null = null;
  try {
    writable = await fileHandle.createWritable();
    await writable.write(fileOrStr);
    await writable.close();
  } catch(err) {
    if (writable) {
      await writable.close();
      writable = null;
    }
    throw err;
  }
}

async function copyDirectory2(sourceDirHandle: FileSystemDirectoryHandle, targetDirHandle: FileSystemDirectoryHandle) {
  const sourceEntries = await sourceDirHandle.entries();
  for await (let entry of sourceEntries) {
    const [fileName, handleApp] = entry;
    if (handleApp.kind === "file") {
      const sourceFileHandle = await sourceDirHandle.getFileHandle(fileName);
      const sourceFile = await sourceFileHandle.getFile();
      await targetDirHandle.x2FileSave(fileName, sourceFile);
    }
    if (handleApp.kind === "directory") {
      const newSourceDirHandle = await sourceDirHandle.getDirectoryHandle(fileName, { create: false });
      const [, newTargetDirHandle] = await targetDirHandle.x2DirectoryCreate(fileName);
      await copyDirectory2(newSourceDirHandle, newTargetDirHandle!);
    }
  }
}








interface X2OptsBase {
  debugMode: boolean;
}


interface X2DirCreateOpts extends X2OptsBase {
  /** ignore=正常返回 */
  exist: X2ExistAction;
}
interface X2DirDeleteOpts extends X2OptsBase {
  /** ignore=目录不存在时正常返回 */
  notExist: X2NotExistAction;
}
interface X2DirExistOpts extends X2OptsBase {}
interface X2DirOverviewOpts extends X2OptsBase {
  maxLevel?: number;
  /** 
   * 被忽略的文件或目录。
   * 被忽略的目录,其他后代文件及目录也会被忽略
   */
  ignoreList?: (string | RegExp)[];
  /** 是否忽略 . 开头的文件。 */
  ignoreDotFile?: boolean;
  /**
   * 是否忽略 . 开头的目录。
   * 被忽略的目录,其他后代文件及目录也会被忽略
   */
  ignoreDotDir?: boolean;
}


interface X2FileCreateOpts extends X2OptsBase {
  /** ignore=已存在时正常返回 */
  exist: X2ExistAction;
}
interface X2FileDeleteOpts extends X2OptsBase {
  /** ignore=文件不存在时正常返回 */
  notExist: X2NotExistAction;
}
interface X2FileExistOpts extends X2OptsBase {}
interface X2FileSaveOpts extends X2OptsBase {}
interface X2FileReadOpts extends X2OptsBase {}
interface X2FileReadJSONOpts extends X2OptsBase {}
interface x2GetDirHandleOpts extends X2OptsBase {}
interface x2GetFileHandleOpts extends X2OptsBase {}
interface x2CopyOpts extends X2OptsBase {
  /**
   * 目标文件或目录已存在时, 如何处理:
   *    error: 默认值, 控制台报错+返回false
   *    cover: 覆盖,   文件类型=内容完全是新的,等同替换。。。目录类型=不清空目录,直接复制过去,已存在的文件会被覆盖
   *    replace: 替换,  文件类型
   * 文件类型:  cover、replace 效果相同
   * 目录类型:  replace会清空原有子文件,再执行复制。。cover,相当于不清空原target目录内文件,覆盖
   */
  targetExist: 'error' | 'cover' | 'replace',
}
interface x2MoveOpts extends X2OptsBase {
  targetExist: 'error' | 'cover' | 'replace',
}
interface x2DeleteOpts extends X2OptsBase {
  /** force: 删除目录时,不论目录是否为空都删除 */
  force: boolean;
}
interface x2ClearOpts extends X2OptsBase {
  /** 是否删除自己 */
  deleteSelf: boolean;
}

interface x2RenameOpts extends X2OptsBase {}
interface x2ExistOpts extends X2OptsBase {}
interface x2PHandleOpts extends X2OptsBase {
  sourceNotExist: X2NotExistAction
}

interface X2DirOverviewResult_Item {
  /** 文件名 */
  name: string;
  /** 文件路径, eg: abc/def/test.ts */
  path: string;
  /** 所在层级. 初始目录层级为0 */
  level: number;
  /** 是否还有下个层级. 有的话listSubDir=[] */
  isLastLevel: boolean;
  kind: FileSystemHandleKind;
}
type X2DirOverviewResult_TreeItem = X2DirOverviewResult_Item & { children?: X2DirOverviewResult_TreeItem[] };
interface X2DirOverviewResult {
  tree: X2DirOverviewResult_TreeItem[],
  list: X2DirOverviewResult_Item[],
  listPath: string[],
}
