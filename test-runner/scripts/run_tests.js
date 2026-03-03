const { execSync } = require('child_process');
const fs = require('fs');

function runTests() {
    let command = '';

    // 1. 探测项目类型
    if (fs.existsSync('package.json')) {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
        const scripts = pkg.scripts || {};
        if (scripts['test']) {
            // 优先使用 npm run test
            command = 'npm run test';
        } else {
            console.log(JSON.stringify({ status: 'no-tests', message: 'package.json found, but no "test" script defined.' }));
            return;
        }
    } else if (fs.existsSync('go.mod')) {
        command = 'go test ./...';
    } else if (fs.existsSync('pyproject.toml') || fs.existsSync('requirements.txt')) {
        command = 'pytest';
    } else if (fs.existsSync('pom.xml')) {
        command = 'mvn test';
    }

    if (!command) {
        console.log(JSON.stringify({ status: 'no-tests', message: 'No recognizable test framework found.' }));
        return;
    }

    // 2. 执行命令
    try {
        const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
        console.log(JSON.stringify({
            status: 'pass',
            message: 'All tests passed.',
            output: output.substring(0, 1000)
        }, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(JSON.stringify({
            status: 'fail',
            message: 'Tests failed.',
            output: (error.stdout || error.message).substring(0, 2000)
        }, null, 2));
        process.exit(1);
    }
}

runTests();
