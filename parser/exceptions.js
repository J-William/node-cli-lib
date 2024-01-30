
class InvalidOptionType extends Error {
    constructor(message) {
        super(`Invalid option type!!: ${message}`);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}


class InvalidArgumentType extends Error {
    constructor(message) {
        super(`Invalid argument type!!: ${message}`);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class InvalidFlagSpecification extends Error {
    constructor(message) {
        super(`Invalid flag specification!!: ${message}`);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class InvalidInput extends Error {
    constructor(message)    {
        super(`Invalid input: ${message}`);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { InvalidArgumentType, InvalidOptionType, InvalidFlagSpecification, InvalidInput };