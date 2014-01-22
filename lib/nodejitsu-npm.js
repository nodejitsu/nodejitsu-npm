var path = require('path');
var flatiron = require('flatiron');

var nn = module.exports = flatiron.app;

nn.use(flatiron.plugins.cli, {
  version: true,
  source: path.join(__dirname, 'commands'),
  usage: [
    'Welcome to nodejitsu-npm!',
    '',
    'Available Commands',
    '',
    'Setup',
    '',
    '  nodejitsu-npm setup <subdomain>',
    ''
  ]
});

