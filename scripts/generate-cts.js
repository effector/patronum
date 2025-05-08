const { readdir, copyFile, stat } = require('node:fs/promises');
const path = require('node:path');

async function getAllFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getAllFiles(res) : res;
    })
  );
  return files.reduce((a, f) => a.concat(f), []);
}

function typesPlugin() {
  return {
    name: 'afterBuild-plugin',
    async writeBundle() {
      try {
        const files = await getAllFiles('dist');
        const dtsFiles = files.filter((file) => file.endsWith('.d.ts'));

        await Promise.all(
          dtsFiles.map((file) => {
            const newFile = file.replace('.d.ts', '.d.cts');
            return copyFile(file, newFile);
          })
        );
        
        console.log('Copied .d.ts files to .d.cts');
      } catch (error) {
        console.error('Error in afterBuild plugin:', error);
      }
    },
  };
}

module.exports = {
	typesPlugin
};