class Enumeration {
    constructor(values, error) {
        if (typeof values !== 'object') {
            throw new Error('values must be an object of kv pairs')
        }
        if (!(error instanceof Error||error.prototype instanceof Error)) {
            throw new Error('error must be an instance or extension of Error')
        }

        this._values = Object.freeze(values);
        this._error = error;
        // Add the values as properties so they can
        // be accessed directly
        for (const [key, value] of Object.entries(values)) {
            Object.defineProperty(this, key, {
                value: value,
                writable: false,
                enumerable: true,
            })
        }
    }
    /**
     *  Returns bool indicating whether or not a val
     * is a member of the enum
     * 
     * @param {(string|number)} val - the value to test
     * @returns {boolean} is the value contained
     */
    contains(val) {
        return Object.values(this._values).includes(val);
    }
    /**
     * Throws the defined Error instance with a given message
     * if val is not a member of the enum
     * 
     * @param {(string|number)} val - the value to test
     * @param {*} failMsg the message to display upon failure
     */
    validate(val, failMsg) {
        if (!this.contains(val)) {
            const err = new this._error(failMsg);
            Error.captureStackTrace(err, this.validate);
            throw err;
        }
    }
}

module.exports = Enumeration;