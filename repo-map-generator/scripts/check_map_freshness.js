const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

function usage() {
    console.error('Usage: node repo-map-generator/scripts/check_map_freshness.js <map-file>');
    process.exit(2);
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

function readMetadata(mapPath) {
    if (!fs.existsSync(mapPath)) {
        return { ok: false, reason: `repo map not found: ${mapPath}` };
    }

    const content = fs.readFileSync(mapPath, 'utf8');
    const match = content.match(/<!-- spec-os-repo-map\s*([\s\S]*?)\s*-->/);
    if (!match) {
        return { ok: false, reason: 'repo map metadata missing' };
    }

    try {
        return { ok: true, metadata: JSON.parse(match[1]) };
    } catch (error) {
        return { ok: false, reason: `repo map metadata invalid: ${error.message}` };
    }
}

const mapFile = process.argv[2];
if (!mapFile) usage();

const mapPath = path.resolve(process.cwd(), mapFile);
const parsed = readMetadata(mapPath);
if (!parsed.ok) {
    console.error(JSON.stringify({ status: 'stale', reason: parsed.reason }, null, 2));
    process.exit(1);
}

const metadata = parsed.metadata;
const currentHead = getGitHead();
const problems = [];

if (metadata.gitHead && currentHead && metadata.gitHead !== currentHead) {
    problems.push(`git HEAD changed: ${metadata.gitHead} -> ${currentHead}`);
}

for (const file of metadata.files || []) {
    const filePath = path.resolve(process.cwd(), file.path);
    if (!fs.existsSync(filePath)) {
        problems.push(`file missing: ${file.path}`);
        continue;
    }

    const currentHash = hashFile(filePath);
    if (currentHash !== file.sha256) {
        problems.push(`file changed: ${file.path}`);
    }
}

if (problems.length > 0) {
    console.error(JSON.stringify({
        status: 'stale',
        map: path.relative(process.cwd(), mapPath),
        target: metadata.target,
        problems
    }, null, 2));
    process.exit(1);
}

console.log(JSON.stringify({
    status: 'fresh',
    map: path.relative(process.cwd(), mapPath),
    target: metadata.target,
    gitHead: metadata.gitHead || null,
    files: (metadata.files || []).length
}, null, 2));
