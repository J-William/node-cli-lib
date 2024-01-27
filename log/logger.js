const fs = require('node:fs');
const Enumeration = require('../types/enumeration.js');

const LogLevel = new Enumeration(
    {
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
    }
);

const LogType = new Enumeration(
    {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        WARN: 'WARNING',
        ERROR: 'ERROR',
    }
);

class Logger {
    constructor(filePath, level) {
        this._logs = []
        this._filePath = filePath
        
        if (level) {
            LogLevel.validate(level, `Invalid log level: ${level}!`);
            this._level = level;
        } else {
            const envLevel = parseInt(process.env.CLITELOGLEVEL);
            this._level = envLevel ? envLevel : LogLevel.ERROR;
        }
        
    }
    
    log(message, type) {
        const stamp = new Date();

        switch (type) {
            case LogType.DEBUG:
                if (this._level <= LogLevel.DEBUG) {
                    console.log(message);
                }
                break;
            case LogType.INFO:
                if (this._level <= LogLevel.INFO) {
                    console.info(message);
                }
                break;
            case LogType.WARN:
                if (this._level <= LogLevel.WARN) {
                    console.warn(message);
                }
                break;
            case LogType.ERROR:
                if (this._level <= LogLevel.ERROR) {
                    console.error(message);
                }
                break;
        }

        this._logs.push({
            "timestamp": stamp,
            "type": type,
            "message": message
        });
    }

    debug(msg) {
        this.log(msg, LogType.DEBUG);
    }

    info(msg) {
        this.log(msg, LogType.INFO);
    }

    warn(msg) {
        this.log(msg, LogType.WARN);
    }

    error(msg) {
        this.log(msg, LogType.ERROR);
        this.save();
    }

    save(fileName) {
        const initialValue = '';
        try {
            const content = this._logs.reduce(
                (prev, curr) => {
                    const { timestamp, type, message } = curr;
                    const line = `${timestamp.toLocaleString()} - ${type}: ${message}\n`;
                    return prev + line;
                },
                initialValue
            )
            fs.writeFileSync(this._filePath, content);
        } catch (err) {
            console.error(`Bad news the logger failed to write: ${err}`);
        }
    }
}


module.exports = Logger;
