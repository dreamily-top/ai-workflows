const fs = require('fs');
const path = require('path');

function extractSignatures(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const signatures = [];
    const lines = content.split('\n');
    const ext = path.extname(filePath).toLowerCase();

    const regexMap = {
        '.ts': [
            /(?:export\s+)?(?:default\s+)?class\s+\w+(?:\s+extends\s+\w+)?(?:\s+implements\s+[\w\s,]+)?/g,
            /(?:export\s+)?(?:default\s+)?interface\s+\w+/g,
            /(?:export\s+)?type\s+\w+\s*=/g,
            /(?:export\s+)?(?:default\s+)?function\s+\w+\s*\([^)]*\)/g,
            /(?:export\s+)?const\s+\w+\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>/g
        ],
        '.js': [
            /(?:export\s+)?(?:default\s+)?class\s+\w+(?:\s+extends\s+\w+)?/g,
            /(?:export\s+)?(?:default\s+)?function\s+\w+\s*\([^)]*\)/g,
            /(?:export\s+)?const\s+\w+\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>/g
        ],
        '.go': [
            /^func\s+(?:\([^)]+\)\s+)?\w+\s*\([^)]*\)/g,
            /^type\s+\w+\s+struct\b/g,
            /^type\s+\w+\s+interface\b/g
        ],
        '.py': [
            /^class\s+\w+(?:\([^)]*\))?:/g,
            /^(?:async\s+)?def\s+\w+\s*\([^)]*\)/g
        ],
        '.java': [
            /(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?class\s+\w+/g,
            /(?:public|private|protected)?\s*interface\s+\w+/g,
            /(?:public|private|protected)\s+(?:static\s+)?(?:final\s+)?[\w<>\[\]]+\s+\w+\s*\(/g
        ]
    };

    // For tsx and jsx, alias to ts and js
    if (ext === '.tsx') regexMap['.tsx'] = regexMap['.ts'];
    if (ext === '.jsx') regexMap['.jsx'] = regexMap['.js'];

    const regexes = regexMap[ext] || [];

    lines.forEach((line, index) => {
        // Skip comment lines
        if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('#')) return;

        for (const regex of regexes) {
            const match = line.match(regex);
            if (match) {
                signatures.push({ line: index + 1, signature: match[0].trim() });
            }
        }
    });

    return signatures;
}

function walkDir(dir, extFilter = ['.ts', '.tsx', '.js', '.jsx', '.go', '.py', '.java']) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist') && !file.includes('.next')) {
                results = results.concat(walkDir(file, extFilter));
            }
        } else {
            if (extFilter.includes(path.extname(file))) {
                results.push(file);
            }
        }
    });
    return results;
}

const targetDir = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : process.cwd();
const files = walkDir(targetDir);

const repoMap = {};
files.forEach(file => {
    const relPath = path.relative(process.cwd(), file);
    const sigs = extractSignatures(file);
    if (sigs.length > 0) {
        repoMap[relPath] = sigs;
    }
});

console.log("# Repo AST Map\n");
for (const [file, sigs] of Object.entries(repoMap)) {
    console.log(`## ${file}`);
    sigs.forEach(s => {
        console.log(`- [L${s.line}] \`${s.signature}\``);
    });
    console.log("");
}
