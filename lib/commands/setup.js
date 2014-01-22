var fs = require('fs');
var path = require('path');
var nn = require('../../');
var ini = require('ini');
var tilde = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

var npmrcPath = path.join(tilde, '.npmrc');
var registryUrl = 'https://<replace>.registry.nodejitsu.com';

module.exports = function setup () {
  var args = Array.prototype.slice.call(arguments);
  var callback = args[args.length - 1];
  var subdomain = args.length === 2 ? args[0] : null;

  if (args.length > 2) {
    return callback(new Error('Too many arguments, just specify subdomain :)'));
  }
  if (subdomain) {
    return setupNpmrc(subdomain, callback);
  }
  //
  // Otherwise we msut get the subdomain
  //
  nn.prompt.get([{
    name: 'subdomain',
    required: true
  }], function (err, res) {
    if (err) {
      return callback(err);
    }
    setupNpmrc(res['subdomain'], callback);
  });

};

function setupNpmrc(subdomain, callback) {
  var npmrc,
      noAuth;

  try { npmrc = ini.parse(fs.readFileSync(npmrcPath, 'utf8')) }
  catch(err) { return callback(new Error('malformed .npmrc!')) }
  //
  // Start setting correct values
  //
  npmrc['always-auth'] = true;
  npmrc['strict-ssl'] = false;
  npmrc['registry'] = registryUrl.replace('<replace>', subdomain);

  noAuth = !npmrc['_auth'];

  fs.writeFile(npmrcPath, ini.stringify(npmrc), function (err) {
    if (err) {
      callback(new Error('.npmrc failed to write, please try again!'));
    }
    if (noAuth) nn.log.warn('Please run `npm login` and you will be all set :)');
    callback();
  });
}
