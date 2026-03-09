const { execSync } = require('child_process');

function runChecks() {
    try {
        // 获取所有未生成的改动（无论是staged还是unstaged，包括HEAD对比）
        const diff = execSync('git diff HEAD', { encoding: 'utf-8' });
        if (!diff) {
            console.log(JSON.stringify({ status: 'pass', message: 'No changes detected.' }));
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

                // 1. 中文硬编码拦截 (全球化标准 + 纯英文注释规范)
                // 哪怕是注释，也强制要求英文
                if (/[\u4e00-\u9fa5]/.test(content) && !currentFile.includes('locales')) {
                    violations.push({ file: currentFile, line: currentLine, reason: 'Detected Chinese characters! All UI text must use i18n, and CODE COMMENTS must be strictly in English.' });
                }

                // 2. 断点和废弃调试语句拦截
                if (/console\.log\s*\(/.test(content)) {
                    violations.push({ file: currentFile, line: currentLine, reason: 'Detected console.log. Please thoroughly remove all debugging code before handing off.' });
                }
                if (/\bdebugger\b/.test(content)) {
                    violations.push({ file: currentFile, line: currentLine, reason: 'Detected debugger statement. Remove immediately.' });
                }

                // 3. Typescript 隐式 Any 拦截
                if (/\bany\b/.test(content) && !content.includes('eslint-disable')) {
                    violations.push({ file: currentFile, line: currentLine, reason: 'Detected "any" type. You must strictly follow L1 contracts and define a proper TypeScript interface.' });
                }

                // 4. IP/Port 和硬编码 URL 拦截
                if (/https?:\/\/[0-9a-zA-Z]|:\d{4,5}[^0-9]|\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(content)) {
                    if (!currentFile.includes('test') && !currentFile.includes('spec') && !currentFile.includes('example')) {
                        violations.push({ file: currentFile, line: currentLine, reason: 'Hardcoded URL/IP/Port detected. Use environment variables defined in conventions.' });
                    }
                }

                // 5. 密码与密钥硬编码拦截
                if (/(?:password|secret|api_?key|token|credential)\s*[:=]\s*['"][^'"]+['"]/i.test(content)) {
                    violations.push({ file: currentFile, line: currentLine, reason: 'Potential hardcoded secret detected. Use environment variables.' });
                }

                // 6. i18n 冗余写法拦截 (严禁 t('key', 'fallback') 写法)
                if (/t\s*\(\s*['"][^'"]+['"]\s*,\s*['"][^'"]+['"]\s*\)/.test(content)) {
                    violations.push({ file: currentFile, line: currentLine, reason: 'Redundant i18n translation fallback detected. Use pure keys only, e.g., t("error.notFound").' });
                }
            } else if (!line.startsWith('-') && !line.startsWith('\\')) {
                if (currentLine !== 0) currentLine++;
            }
        }

        if (violations.length > 0) {
            console.log(JSON.stringify({ status: 'fail', violations }, null, 2));
            process.exit(1);
        } else {
            console.log(JSON.stringify({ status: 'pass', message: 'L3 Code checks passed with flying colors.' }));
            process.exit(0);
        }
    } catch (e) {
        console.error(JSON.stringify({ status: 'error', message: e.message }));
        process.exit(1);
    }
}

runChecks();
