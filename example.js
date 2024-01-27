const Program = require('./program.js');
const { ArgumentTypes, OptionTypes} = require('./types.js');

const f = new Program();

f.command("foo")
  .option("optA", "optA is a boolean option", "-a,--attack")
  .option("optB", "optB is a value option", "--begin", OptionTypes.VALUE)
  .argument("cal", "description")
  .argument("dor", "anotha description")
  .action((input) => {
      console.log(input);
  });

f.command("bar")
  .option("optC", "value options expect arguments", "-c", OptionTypes.VALUE)
  .option("optD", "boolean options do not", "-d")
  .action((input) => {
    console.log(input);
});

f.process();
