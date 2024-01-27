const Enumeration = require('./enumeration.js');
const { InvalidOptionType, InvalidArgumentType } = require('./exceptions.js')

const OptionTypes = new Enumeration(
    {BOOL: 'BOOL', VALUE: 'VALUE'},
    InvalidOptionType
)

const ArgumentTypes = new Enumeration(
    {TEXT: 'TEXT', LIST: 'LIST' },
    InvalidArgumentType
)

module.exports =  { OptionTypes, ArgumentTypes };