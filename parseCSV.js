var fs = require('fs');
var parse = require('csv-parse');

var workflows = {};
fs.createReadStream('./sample.csv')
  .pipe(parse({delimiter: ':'}))
  .on('data', function (row) {
    var values = row.toString().split(',');
    if (!workflows[values[3]]) {
      workflows[values[3]] = {
        states: {}
      };
    }
    if (!workflows[values[3]].states[values[0]]) {
      workflows[values[3]].states[values[0]] = {
        initial: values[1] === 'Y',
        final: values[2] === 'Y',
        colour: 'fill: ' + (values[6] !== '' ? values[6] : '#f5f5f5'),
        actions: {}
      };
    }
    if (values[4] !== 'NULL') {
      if (!workflows[values[3]].states[values[0]].actions[values[4]]) {
        workflows[values[3]].states[values[0]].actions[values[4]] = [];
      }
      workflows[values[3]].states[values[0]].actions[values[4]].push(values[5]);
    }
  })
  .on('end', function () {
    fs.writeFile('workflows.json', 'var workflows = `' + JSON.stringify(workflows) + '`', 'utf8', function () {});
  });
