var Promise = require('bluebird');

Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
});

module.exports = Promise;

