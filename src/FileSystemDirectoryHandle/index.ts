type ExistAction = 'ThrowError' | 'ignore';
type NotExistAction = 'ThrowError' | 'ignore';

interface FileSystemDirectoryHandle {
  // 子目录 - 基础操作
  xDirectoryCreate: (dir: string, options?: { exist: ExistAction }) => Promise<[boolean, FileSystemDirectoryHandle | null]>;
  xDirectoryDelete: (dir: string, options?: { recursive: boolean, notExist: NotExistAction }) => Promise<boolean>;
  xDirectoryRename: (sourceName: string, targetName: string, options?: { sourceNotExist: NotExistAction, targetExist: ExistAction }) => Promise<boolean>;
  xDirectoryExit: (dir: string) => Promise<[boolean, FileSystemDirectoryHandle | null]>;
  // 子文件 - 基础操作
  xFileCreate: (filename: string, content: FileSystemWriteChunkType, options?: { exist: ExistAction }) => Promise<[boolean, FileSystemFileHandle | null]>;
  xFileDelete: (filename: string, options?: { notExist: NotExistAction }) => Promise<boolean>;
  xFileRename: (oldName: string, newName: string, options?: { sourceNotExist: NotExistAction, targetExist: ExistAction }) => Promise<boolean>;
  xFileRewrite: (fileName: string, content: FileSystemWriteChunkType, options?: { notExist: NotExistAction | 'create' }) => Promise<boolean>;
  xFileAppend: (fileName: string, content: FileSystemWriteChunkType, options?: { notExist: NotExistAction | 'create' }) => Promise<boolean>;
  xFileExit: (fileName: string) => Promise<[boolean, FileSystemFileHandle | null]>;
  // 移动、复制
  xDirectoryCopy: (sourceDir: string, targetDirHandle: FileSystemDirectoryHandle, options?: { sourceNotExist: NotExistAction }) => Promise<boolean>;
  xDirectoryMove: (sourceDir: string, targetDirHandle: FileSystemDirectoryHandle, options?: { sourceNotExist: NotExistAction }) => Promise<boolean>;
  xFileCopy: (sourceDir: string, targetFileHandle: FileSystemFileHandle, options?: { sourceNotExist: NotExistAction }) => Promise<boolean>;
  xFileMove: (sourceDir: string, targetFileHandle: FileSystemFileHandle, options?: { sourceNotExist: NotExistAction }) => Promise<boolean>;
  // 其他 - 杂项
  xGetDirectoryHandle: (dir: string) => Promise<FileSystemDirectoryHandle | null>;
  xGetFileHandle: (dir: string) => Promise<FileSystemFileHandle | null>;
  // 其他 - 内置函数的 TypeScript 定义
  entries: () => Promise<AsyncGenerator<[string, FileSystemHandle], void, void>>;
  keys: () => Promise<AsyncGenerator<string, void, void>>;
  remove: (opts?: { recursive?: boolean; }) => Promise<undefined>;
}





FileSystemDirectoryHandle.prototype.xDirectoryCreate = async function (dir: string, _options?: { exist: ExistAction }) {
  const options = {
    exist: 'ignore',
    ..._options,
  };
  try {
    const [exist, handle] = await this.xDirectoryExit(dir);
    if (exist) {
      if (options.exist === 'ThrowError') {
        throw new Error(`Directory ${dir} already exists.`);
      }
      return [false, null];
    }
    const newHandle = await this.getDirectoryHandle(dir, { create: true });
    return [true, newHandle];
  } catch(err) {
    return [false, null];
  }
}

FileSystemDirectoryHandle.prototype.xDirectoryDelete = async function (dir: string, _options?: { recursive: boolean, notExist: NotExistAction }) {
  const options = {
    notExist: 'ignore',
    recursive: true,
    ..._options,
  };
  try {
    const [exist, handle] = await this.xDirectoryExit(dir);
    if (!exist) {
      if (options.notExist === 'ignore') {
        return false;
      }
      throw new Error(`Directory ${dir} does not exist.`);
    }
    await handle!.removeEntry(dir, { recursive: options.recursive });
    return true;
  } catch(err) {
    return false;
  }
}

FileSystemDirectoryHandle.prototype.xDirectoryRename = async function (sourceName: string, targetName: string, _options?: { sourceNotExist: NotExistAction, targetExist: ExistAction }) {
  const options = {
    sourceNotExist: 'ignore',
    targetExist: 'ignore',
    ..._options,
  };
  try {
    const [exist, sourceHandle] = await this.xDirectoryExit(sourceName);
    if (!exist) {
      if (options.sourceNotExist === 'ignore') {
        return false;
      }
      throw new Error(`Directory ${sourceName} does not exist.`);
    }
    const [exist2, targetHandle] = await this.xDirectoryExit(targetName);
    if (exist2) {
      if (options.targetExist === 'ThrowError') {
        throw new Error(`Directory ${targetName} already exists.`);
      }
      return false;
    }
    await this.xDirectoryMove(sourceName, targetHandle!);
    return true;
  } catch(err) {
    return false;
  }
}

FileSystemDirectoryHandle.prototype.xDirectoryExit = async function (dir: string) {
  try {
    const handle = await this.getDirectoryHandle(dir, { create: false });
    return [true, handle];
  } catch(err) {
    return [false, null];
  }
}





FileSystemDirectoryHandle.prototype.xFileCreate = async function (filename: string, content: FileSystemWriteChunkType, _options?: { exist: ExistAction }) {
  const options = {
    exist: 'ignore',
    ..._options,
  };
  try {
    const [exist, handle] = await this.xFileExit(filename);
    if (exist) {
      if (options.exist === 'ThrowError') {
        throw new Error(`File ${filename} already exists.`);
      }
      return [false, null];
    }
    const newHandle = await this.getFileHandle(filename, { create: true });
    const writable = await newHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return [true, newHandle];
  } catch(err) {
    return [false, null];
  }
}

FileSystemDirectoryHandle.prototype.xFileDelete = async function (filename: string, _options?: { notExist: NotExistAction }) {
  const options = {
    notExist: 'ignore',
    ..._options,
  };
  try {
    const [exist, handle] = await this.xFileExit(filename);
    if (!exist) {
      if (options.notExist === 'ignore') {
        return false;
      }
      throw new Error(`File ${filename} does not exist.`);
    }
    await this.removeEntry(filename, { recursive: false });
    return true;
  } catch(err) {
    return false;
  }
}

FileSystemDirectoryHandle.prototype.xFileRename = async function (oldName: string, newName: string, _options?: { sourceNotExist: NotExistAction, targetExist: ExistAction }) {
  const options = {
    sourceNotExist: 'ignore',
    targetExist: 'ignore',
    ..._options,
  };
  try {
    const [exist, sourceHandle] = await this.xFileExit(oldName);
    if (!exist) {
      if (options.sourceNotExist === 'ignore') {
        return false;
      }
      throw new Error(`File ${oldName} does not exist.`);
    }
    const [exist2, targetHandle] = await this.xFileExit(newName);
    if (exist2) {
      if (options.targetExist === 'ThrowError') {
        throw new Error(`File ${newName} already exists.`);
      }
      return false;
    }
    const file = await sourceHandle!.getFile();
    const writable = await targetHandle!.createWritable();
    await writable.write(file);
    await writable.close();
    return true;
  } catch(err) {
    return false;
  }
}

FileSystemDirectoryHandle.prototype.xFileRewrite = async function (fileName: string, content: FileSystemWriteChunkType, _options?: { notExist: NotExistAction | 'create' }) {
  const options = {
    notExist: 'create',
    ..._options,
  };
  try {
    const [exist, handle] = await this.xFileExit(fileName);
    if (!exist) {
      if (options.notExist === 'create') {
        await this.xFileCreate(fileName, content, { exist: 'ignore' });
        return await this.xFileRewrite(fileName, content, _options);
      }
      if (options.notExist === 'ignore') {
        return false;
      }
      throw new Error(`File ${fileName} does not exist.`);
    }
    const writable = await handle!.createWritable({ keepExistingData: false });
    await writable.write(content);
    await writable.close();
    return true;
  } catch(err) {
    return false;
  }
}

FileSystemDirectoryHandle.prototype.xFileAppend = async function (fileName: string, content: FileSystemWriteChunkType, _options?: { notExist: NotExistAction | 'create' }) {
  const options = {
    notExist: 'create',
    ..._options,
  };
  try {
    const [exist, handle] = await this.xFileExit(fileName);
    if (!exist) {
      if (options.notExist === 'create') {
        await this.xFileCreate(fileName, content, { exist: 'ignore' });
        return await this.xFileAppend(fileName, content, _options);
      }
      if (options.notExist === 'ignore') {
        return false;
      }
      throw new Error(`File ${fileName} does not exist.`);
    }
    const writable = await handle!.createWritable({ keepExistingData: true });
    await writable.write(content);
    await writable.close();
    return true;
  } catch(err) {
    return false;
  }
}

FileSystemDirectoryHandle.prototype.xFileExit = async function (fileName: string) {
  try {
    const handle = await this.getFileHandle(fileName, { create: false });
    return [true, handle];
  } catch(err) {
    return [false, null];
  }
}





FileSystemDirectoryHandle.prototype.xDirectoryCopy = async function (sourceDir: string, targetDirHandle: FileSystemDirectoryHandle, _options?: { sourceNotExist: NotExistAction }) {
  const options = {
    sourceNotExist: 'ignore',
    ..._options,
  };
  try {
    const [exist, sourceHandle] = await this.xDirectoryExit(sourceDir);
    if (!exist) {
      if (options.sourceNotExist === 'ignore') {
        return false;
      }
      throw new Error(`Directory ${sourceDir} does not exist.`);
    }
    await copyDirectory(sourceHandle!, targetDirHandle);
    return true;
  } catch(err) {
    return false;
  }
}

FileSystemDirectoryHandle.prototype.xDirectoryMove = async function (sourceDir: string, targetDirHandle: FileSystemDirectoryHandle, _options?: { sourceNotExist: NotExistAction }) {
  try {
    const copyOk = await this.xDirectoryCopy(sourceDir, targetDirHandle, _options);
    if (!copyOk) return false;
    await this.removeEntry(sourceDir, { recursive: true });
    return true;
  } catch(err) {
    return false;
  }
}

FileSystemDirectoryHandle.prototype.xFileCopy = async function (sourceDir: string, targetFileHandle: FileSystemFileHandle, _options?: { sourceNotExist: NotExistAction }) {
  const options = {
    sourceNotExist: 'ignore',
    ..._options,
  };
  try {
    const [exist, sourceHandle] = await this.xFileExit(sourceDir);
    if (!exist) {
      if (options.sourceNotExist === 'ignore') {
        return false;
      }
      throw new Error(`File ${sourceDir} does not exist.`);
    }
    const file = await sourceHandle!.getFile();
    const writeable = await targetFileHandle.createWritable({ keepExistingData: false });
    await writeable.write(file);
    await writeable.close();
    return true;
  } catch(err) {
    return false;
  }
}

FileSystemDirectoryHandle.prototype.xFileMove = async function (sourceDir: string, targetFileHandle: FileSystemFileHandle, _options?: { sourceNotExist: NotExistAction }) {
  try {
    const copyOk = await this.xFileCopy(sourceDir, targetFileHandle, _options);
    if (!copyOk) return false;
    await this.removeEntry(sourceDir, { recursive: false });
    return true;
  } catch(err) {
    return false;
  }
}





FileSystemDirectoryHandle.prototype.xGetDirectoryHandle = async function (dir: string) {
  try {
    return await this.getDirectoryHandle(dir, { create: false });
  } catch(err) {
    return null;
  }
}

FileSystemDirectoryHandle.prototype.xGetFileHandle = async function (dir: string) {
  try {
    return await this.getFileHandle(dir, { create: false });
  } catch(err) {
    return null;
  }
}










async function copyDirectory(sourceDirHandle: FileSystemDirectoryHandle, targetDirHandle: FileSystemDirectoryHandle) {
  const sourceEntries = await sourceDirHandle.entries();
  for await (let entry of sourceEntries) {
    const [fileName, handleApp] = entry;
    if (handleApp.kind === "file") {
      const sourceFileHandle = await sourceDirHandle.getFileHandle(fileName);
      const sourceFile = await sourceFileHandle.getFile();
      await targetDirHandle.xFileCreate(fileName, sourceFile);
    }
    if (handleApp.kind === "directory") {
      const newSourceDirHandle = await sourceDirHandle.getDirectoryHandle(fileName, { create: false });
      const [_, newTargetDirHandle] = await targetDirHandle.xDirectoryCreate(fileName);
      await copyDirectory(newSourceDirHandle, newTargetDirHandle!);
    }
  }
}

