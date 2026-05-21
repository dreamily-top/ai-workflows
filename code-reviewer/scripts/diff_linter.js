const { execSync } = require('child_process');

function runChecks() {
    try {
        // 获取所有未生成的改动（无论是staged还是unstaged，包括HEAD对比）
        const diff = execSync('git diff HEAD', { encoding: 'utf-8' });
        if (!diff) {
            console.log(JSON.stringify({ status: 'pass', message: '未检测到代码变更。' }));
            return;
        }

        const lines = diff.split('\n');
        const violations = [];
        let currentFile = '';
        let currentLine = 0;

        for (const line of lines) {
            if (line.startsWith('+++ b/')) {
                currentFile = line.substring(6);
            } else if (line.startsWith('@@ ')) {
                // 解析行号 @@ -1,3 +1,4 @@
                const match = line.match(/\+([0-9]+)/);
                if (match) {
                    currentLine = parseInt(match[1], 10) - 1;
                }
            } else if (line.startsWith('+') && !line.startsWith('+++')) {
                currentLine++;
                const content = line.substring(1);

                // 忽略被移除的行，重点查新增和修改的行

                // 1. 中文 UI 文案拦截：注释、文档、测试和本地化资源允许中文。
                if (hasChineseTextViolation(content, currentFile)) {
                    violations.push({ file: currentFile, line: currentLine, reason: '检测到疑似中文 UI 硬编码。界面文案请进入本地化资源；代码注释、文档和恢复说明默认允许中文。' });
                }

                // 2. 断点和废弃调试语句拦截
                if (/console\.log\s*\(/.test(content) && !isToolingFile(currentFile)) {
                    violations.push({ file: currentFile, line: currentLine, reason: '检测到 console.log。交付前请移除调试代码。' });
                }
                if (/^\s*debugger\s*;?\s*$/.test(content)) {
                    violations.push({ file: currentFile, line: currentLine, reason: '检测到 debugger 语句，请立即移除。' });
                }

                // 3. Typescript 隐式 Any 拦截
                if (/\bany\b/.test(content) && /\.(ts|tsx)$/.test(currentFile) && !content.includes('eslint-disable')) {
                    violations.push({ file: currentFile, line: currentLine, reason: '检测到 any 类型。请遵循契约定义明确的 TypeScript 接口。' });
                }

                // 4. IP/Port 和硬编码 URL 拦截
                if (/https?:\/\/[0-9a-zA-Z]|:\d{4,5}[^0-9]|\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(content)) {
                    if (!isDocumentationFile(currentFile) && !currentFile.includes('test') && !currentFile.includes('spec') && !currentFile.includes('example')) {
                        violations.push({ file: currentFile, line: currentLine, reason: '检测到硬编码 URL/IP/端口。请改用项目规约中定义的环境变量。' });
                    }
                }

                // 5. 密码与密钥硬编码拦截
                if (/(?:password|secret|api_?key|token|credential)\s*[:=]\s*['"][^'"]+['"]/i.test(content)) {
                    violations.push({ file: currentFile, line: currentLine, reason: '检测到疑似硬编码密钥。请改用环境变量。' });
                }

                // 6. i18n 冗余写法拦截 (严禁 t('key', 'fallback') 写法)
                if (/t\s*\(\s*['"][^'"]+['"]\s*,\s*['"][^'"]+['"]\s*\)/.test(content)) {
                    violations.push({ file: currentFile, line: currentLine, reason: '检测到冗余 i18n fallback。请只保留翻译键，例如 t("error.notFound")。' });
                }
            } else if (!line.startsWith('-') && !line.startsWith('\\')) {
                if (currentLine !== 0) currentLine++;
            }
        }

        if (violations.length > 0) {
            console.log(JSON.stringify({ status: 'fail', violations }, null, 2));
            process.exit(1);
        } else {
            console.log(JSON.stringify({ status: 'pass', message: 'L3 代码审查通过。' }));
            process.exit(0);
        }
    } catch (e) {
        console.error(JSON.stringify({ status: 'error', message: e.message }));
        process.exit(1);
    }
}

function hasChineseTextViolation(content, currentFile) {
    if (!/[\u4e00-\u9fa5]/.test(content)) return false;
    if (isDocumentationFile(currentFile)) return false;
    if (isToolingFile(currentFile)) return false;
    if (currentFile.includes('locales') || currentFile.includes('i18n')) return false;
    if (currentFile.includes('test') || currentFile.includes('spec') || currentFile.includes('example')) return false;
    const trimmed = content.trim();
    if (/^(\/\/|\/\*|\*|#)/.test(trimmed)) return false;
    return /['"`][^'"`]*[\u4e00-\u9fa5][^'"`]*['"`]/.test(content);
}

function isDocumentationFile(currentFile) {
    return /\.(md|mdx|txt|json|ya?ml)$/i.test(currentFile);
}

function isToolingFile(currentFile) {
    return currentFile.includes('/scripts/') || currentFile.includes('\\scripts\\');
}

runChecks();
