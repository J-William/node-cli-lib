const { ArgumentTypes, OptionTypes } = require('./enums.js');
const { InvalidFlagSpecification, InvalidInput } = require('./exceptions.js');

class Command {
    constructor(name, description) {
      this._name = name;
      this._description = description;
      this._options = [];
      this._arguments = [];
      this._multiValueArgument;
  }

  /**
   *  Set the command name
   * 
   * @param {string} name 
   * @returns 
   */
  name(name) {
    this._name = name;
    return this;
  }

  /**
   *  Set the command description
   * 
   * @param {string} description 
   * @returns 
   */
  description(description) {
    this._description = description;
    return this;
  }

  /**
   *  Creates an option definition for the command.
   * 
   * @param {string} name - option name
   * @param {string} description - option description
   * @param {string} flagString - a comma sepearted string of valid flags
   * @param {OptionTypes} type -one of the option types enumeration
   * @returns chain of responsibility
   */
  option(name, description, flagString, type=OptionTypes.BOOL) {    
    OptionTypes.validate(type, type);
    // break flagString; trim whitespace
    // '--f, --flag' -> ['--f', '--flag']
    const flags = flagString.split(",").map((val) => val.trim());

    // flag validation
    flags.forEach((e) => {
      if (!e.startsWith("-")) {
        throw new InvalidFlagSpecification(e);
      }
    });

    this._options.push({
      name,
      flags,
      description,
      type,
    });
    return this;
  }

  /**
   *  Creates an argument definition for the command.
   * 
   * @param {string} name - the name of the argument
   * @param {string} description - u know
   * @param {ArgumentTypes} type - one of the argument types enumeration
   * @returns chain of responsibility
   */
  argument(name, description, type=ArgumentTypes.TEXT) {
    ArgumentTypes.validate(type, type);
    const newArgDef = { name, description, type };
    // multiValueArguments are stored in their own
    // field two avoid filtering them from the array later
    if (type == ArgumentTypes.LIST) {
      this._multiValueArgument = newArgDef;
    } else {
      this._arguments.push(newArgDef);
    }
    return this;
  }

  /**
   *  Defines the action for the command. This is a function that
   * will receive an object in the form {options[], arguments[], unused[]}
   * containing the parsed input and used it to implment the logic of the command
   * 
   * @param {Function} call - The function that implements the command logic
   * @returns chain of responsibility
   */
  action(call) {
    this._call = call;
    return this;
  }

  /**
   *  Matches an input flag such as '-f' or '--force' to a defined
   * option and returns it.
   * 
   * @param {string} inputFlag - an input flag such as '-f' or '--force'
   * @returns {object} An option definition object
   */
  matchOption(inputFlag) {
    // Match an inputFlag to an option
    for (let i = 0; i < this._options.length; i++) {
      const opt = this._options[i];
      if (opt.flags.includes(inputFlag)) {
        return opt;
      }
    }
  }

  /**
   *  Uses the definitions in this._arguments to collect values
   * for defined arguments from the remaining input. If a multi-val arg
   * is defined remaining input is collected into it.
   * 
   * @param {Array} remainingInput - the remaining input array
   * @returns {Array} An array of argument definitions with the values attached
   */
  collectArguments(remainingInput) {
    const parsedArgs = [];
    // collect values for argument definitions 
    // in the order of definition
    for (let i = 0; i < this._arguments.length; i++) {
      const arg = this._arguments[i];
      arg.value = remainingInput.shift();
      parsedArgs.push(arg);
    }
    // if a multiValueArgument is defined collect the rest
    // of the arguments into it
    if (this._multiValueArgument) {
      // consume remaining input
      this._multiValueArgument.value = [...remainingInput];
      remainingInput.length = 0;

      parsedArgs.push(this._multiValueArgument);
    }
    return parsedArgs;
  }

  /**
   *  Parses the raw input for the command matching options and arguments
   * to definitions and performing some validations in the process.
   * returns an object that contains lists of objects similar to the definition
   * objects but with associated values attached. This is the object passed to
   * the commands action function.
   * 
   * @param {Array} inputArgs - array of ordered input to the command
   * @returns {object} {options[], arguments[], unused[]}
   */
  parse(inputArgs) {
    // TODO write a comment here 
    let parsedOptions = [];
    let parsedArguments = [];

    let arg = inputArgs.shift(); // prime first arg
    while (arg) {
      // Match the argument to an option
      const option = this.matchOption(arg);

      if (!option) {
        // no options left; start argument collection
        inputArgs.unshift(arg)
        parsedArguments = this.collectArguments(inputArgs);
        break;
      } else {
        // option matched..
        if (option.type != OptionTypes.BOOL) {
          // If a type is specified a value must be provided
          // else it is a bool true flag
          option.value = inputArgs.shift();
          
          if (!option.value) {
            throw new InvalidInput(option.name);
          }
        } else {
          option.value = true;
        }
        parsedOptions.push(option);
      }
      arg = inputArgs.shift();
    }

    return { options: parsedOptions, arguments: parsedArguments, unused: inputArgs };
  }

  /**
   *  Invokes this.parse passing inputArgs and then passing the
   * resulting parsed input to the defined action functin for this
   * command.
   * 
   * @param {Array} inputArgs - array of ordered input to the command
   */
  process(inputArgs) {
    // Invoke action with parsed input
    if (!this._call) {
      throw new Error('process called with null call attribute!')
    }
    const parsedInput = this.parse(inputArgs);
    this._call(parsedInput);
  }
}

module.exports = Command;