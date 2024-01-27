const { execSync } = require('child_process');


class Shell {
    constructor(shellPath) {
        this._options = { shell : shellPath, encoding: 'utf8' };
    }
    
    execute(command) {
        try {
            const stdout = execSync(
                command,
                this._options,
            )
            return { stdout, stderr: null };
        } catch (error) {
            return { stdout: null, stderr: error.stderr };
        }
    }
}


module.exports = Shell;
