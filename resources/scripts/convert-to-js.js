import fs from "fs";
import path from "path";
import ts from "typescript";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");
const srcDir = path.join(rootDir, "src");

function getAllFiles(dir, extensions) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, extensions));
    } else if (item.isFile()) {
      const ext = path.extname(item.name);
      if (extensions.includes(ext) && !item.name.endsWith(".d.ts")) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

console.log("🚀 Starting TypeScript to JavaScript conversion...");

const tsAndTsxFiles = getAllFiles(srcDir, [".ts", ".tsx"]);
console.log(`Found ${tsAndTsxFiles.length} TypeScript files to convert in src/`);

for (const filePath of tsAndTsxFiles) {
  const isTsx = filePath.endsWith(".tsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Transpile to remove types while preserving JSX
  const result = ts.transpileModule(content, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      removeComments: false,
    },
  });

  let jsContent = result.outputText;

  // Clean up any remaining TypeScript export/import artifact syntax if needed
  jsContent = jsContent.replace(/\.tsx(["'])/g, ".jsx$1");
  jsContent = jsContent.replace(/\.ts(["'])/g, ".js$1");

  const newExt = isTsx ? ".jsx" : ".js";
  const newFilePath = filePath.replace(/\.tsx?$/, newExt);

  fs.writeFileSync(newFilePath, jsContent, "utf-8");
  fs.unlinkSync(filePath);
  console.log(`Converted: ${path.relative(rootDir, filePath)} -> ${path.relative(rootDir, newFilePath)}`);
}

// Remove vite-env.d.ts if it exists
const viteEnvPath = path.join(srcDir, "vite-env.d.ts");
if (fs.existsSync(viteEnvPath)) {
  fs.unlinkSync(viteEnvPath);
  console.log("Removed vite-env.d.ts");
}

console.log("✅ All src/ TypeScript files converted to JavaScript successfully!");
