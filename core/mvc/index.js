// require('./extensions/array-extensions')();
// require('./extensions/string-extensions')();

var MVC = require('./mvc'),
Controller = require('./controller'),
APIController = require('./api-controller'),
/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new MVC();
exports.Controller = Controller;
exports.APIController = APIController;