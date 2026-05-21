const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

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

    // tsx 和 jsx 分别复用 ts 与 js 的签名规则。
    if (ext === '.tsx') regexMap['.tsx'] = regexMap['.ts'];
    if (ext === '.jsx') regexMap['.jsx'] = regexMap['.js'];

    const regexes = regexMap[ext] || [];

    lines.forEach((line, index) => {
        // 跳过注释行，避免把说明文字误判为代码签名。
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
    const rootStat = fs.statSync(dir);
    if (rootStat.isFile()) {
        return extFilter.includes(path.extname(dir)) ? [path.resolve(dir)] : [];
    }
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

function parseArgs(argv) {
    const args = { target: null, out: null };
    for (let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--out') {
            args.out = argv[++i];
        } else if (!args.target) {
            args.target = arg;
        }
    }
    return args;
}

function getGitHead() {
    try {
        return execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (_) {
        return null;
    }
}

function hashFile(filePath) {
    return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function buildMetadata(targetPath, files) {
    return {
        tool: 'repo-map-generator',
        target: path.relative(process.cwd(), targetPath) || '.',
        generatedAt: new Date().toISOString(),
        gitHead: getGitHead(),
        files: files.map(file => ({
            path: path.relative(process.cwd(), file),
            sha256: hashFile(file)
        }))
    };
}

function renderMap(repoMap, metadata) {
    const lines = [];
    lines.push('<!-- spec-os-repo-map');
    lines.push(JSON.stringify(metadata, null, 2));
    lines.push('-->');
    lines.push('');
    lines.push('# 仓库 AST 地图');
    lines.push('');

    for (const [file, sigs] of Object.entries(repoMap)) {
        lines.push(`## ${file}`);
        sigs.forEach(s => {
            lines.push(`- [L${s.line}] \`${s.signature}\``);
        });
        lines.push('');
    }

    return lines.join('\n');
}

const args = parseArgs(process.argv);
if (!args.target) {
    console.error('Usage: node repo-map-generator/scripts/ast_extractor.js <file-or-directory> --out .ai/tmp/repo-map.md');
    process.exit(1);
}

const targetDir = path.resolve(process.cwd(), args.target);
if (targetDir === process.cwd()) {
    console.error('Refuse to scan repository root. Pass a specific file or subdirectory.');
    process.exit(1);
}

const files = walkDir(targetDir).sort();

const repoMap = {};
files.forEach(file => {
    const relPath = path.relative(process.cwd(), file);
    const sigs = extractSignatures(file);
    if (sigs.length > 0) {
        repoMap[relPath] = sigs;
    }
});

const metadata = buildMetadata(targetDir, files);
const output = renderMap(repoMap, metadata);

if (args.out) {
    const outPath = path.resolve(process.cwd(), args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, output, 'utf8');
    console.log(`Repo map written: ${path.relative(process.cwd(), outPath)}`);
} else {
    console.log(output);
}
