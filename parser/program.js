const Command = require('./command.js');
const { InvalidInput } = require('./exceptions.js');

class Program {
  constructor() {
    this._commands = new Map();
  }
  
  /**
   *  Creates a new command definition for the program in the form
   * of a Command object.
   * 
   * @param {string} name - command name
   * @param {string} description - command description
   * @returns reference to the new command
   */
  command(name, description) {
    // add a command to the program
    const newCommand = new Command(name, description);
    this._commands.set(name, newCommand);
    // return a reference to the new command to start
    // chain of responsibility
    return newCommand;
  }

  /**
   *  Looks up and validates the command from the input then
   * calls the appropriate Command objects process method passing the
   * remaining unparsed input to it.
   * 
   * @param {Array} input - the array of raw input
   */
  process(input = process.argv) {
    // Parse and validate the command name before calling
    // discard first two inputs are system generated user starts at i=2
    const inputArgs = input.slice(2);
    // first argument is the command
    const command_input = inputArgs.shift();
    const command = this._commands.get(command_input);

    if (!command) {
      throw new InvalidInput(`command not recognized: ${command_input}`);
    }

    try {
        command.process(inputArgs);
    } catch(err) {
        console.error(err);        
    }
  }
}

module.exports = Program;
