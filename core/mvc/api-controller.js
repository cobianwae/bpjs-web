/**
* `Controller` constructor
*
* @api public
*/

function APIController() {
	this.beforeFilters = {};
	this.afterFilters = {};
}

APIController.prototype.before = function(actionName, handler) {
	this.beforeFilters[actionName] = handler;
};

APIController.prototype.after = function(actionName, handler){
	this.afterFilters[actionName] = handler;
};

module.exports = APIController;