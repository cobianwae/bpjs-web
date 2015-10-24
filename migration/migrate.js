require('rootpath')();
var config = require('config');
console.log(config.database);
var knex = require('knex')(config.database);
var Schema = require('./schema');
var sequence = require('when/sequence');
var _ = require('lodash');
var Promise = require('bluebird');
var bcrypt =require('bcrypt-nodejs');

function dropTable(tableName){
	return knex.schema.dropTableIfExists(tableName);
}

function createTable(tableName) {
	return  knex.schema.createTable(tableName, function (table) {
		var column;
		var columnKeys = _.keys(Schema[tableName]);
		_.each(columnKeys, function (key) {
			if (Schema[tableName][key].type === 'text' && Schema[tableName][key].hasOwnProperty('fieldtype')) {
				column = table[Schema[tableName][key].type](key, Schema[tableName][key].fieldtype);
			}
			else if (Schema[tableName][key].type === 'string' && Schema[tableName][key].hasOwnProperty('maxlength')) {
				column = table[Schema[tableName][key].type](key, Schema[tableName][key].maxlength);
			}
			else {
				column = table[Schema[tableName][key].type](key);
			}
			if (Schema[tableName][key].hasOwnProperty('nullable') && Schema[tableName][key].nullable === true) {
				column.nullable();
			}
			else {
				column.notNullable();
			}
			if (Schema[tableName][key].hasOwnProperty('primary') && Schema[tableName][key].primary === true) {
				column.primary();
			}
			if (Schema[tableName][key].hasOwnProperty('unique') && Schema[tableName][key].unique) {
				column.unique();
			}
			if (Schema[tableName][key].hasOwnProperty('unsigned') && Schema[tableName][key].unsigned) {
				column.unsigned();
			}
			if (Schema[tableName][key].hasOwnProperty('references')) {
				column.references(Schema[tableName][key].references);
			}
			if (Schema[tableName][key].hasOwnProperty('defaultTo')) {
				column.defaultTo(Schema[tableName][key].defaultTo);
			}
			if (Schema[tableName][key].hasOwnProperty('rawDefaultTo')) {
				column.defaultTo(knex.raw(Schema[tableName][key].rawDefaultTo));
			}
		});
});
}

function dropAndCreateTables(trx){
	var arrCreateTables = [];
	var arrDropTables = [];
	var arrFunctions = [];
	var tableNames = _.keys(Schema);
	arrDropTables = _.map(tableNames, function (tableName) {
		return function() {
			return dropTable(tableName).transacting(trx);
		}
	});
	arrCreateTables = _.map(tableNames, function (tableName) {
		return function(){
			return createTable(tableName).transacting(trx);
		};
	});
	arrFunctions = arrDropTables.concat(arrCreateTables);
	return sequence(arrFunctions);
}


knex.transaction(function (trx) {
	console.log('begin transaction');
	knex.raw('SET foreign_key_checks = 0').transacting(trx)
	.then(function () {
		return 	dropAndCreateTables(trx);		
	})
	.then(function (){
		return knex.raw('SET foreign_key_checks = 1').transacting(trx);
	})
	.then(function(){
		var roles = [
		{title : 'admin'},
		{title : 'operator'},
		{title : 'member'},];
		return knex('roles').insert(roles).transacting(trx)
	})
	.then(function(){
		return knex('roles').where({title: 'admin'}).select('id');
	})
	.then(function(roles){
		var admin = {username:'admin', fullname:'Super Admin',  phone:'08156155290'};
		var salt = bcrypt.genSaltSync(5);
		var hash = bcrypt.hashSync('hagemaru', salt, null);
		admin.password = hash;
		admin.role_id = roles[0].id;
		return knex('users').insert(admin).transacting(trx);
	})
	.then(function(){
		var address = {
			location: 'Jalan Batik Jogja 27, RT 01 / RW 02',
			village : 'Cibeunying Kaler',
			subdistrict : 'Sukaluyu',
			regency : 'Bandung',
			province : 'Jawa Barat'
		};
		return knex('addresses').insert(address).transacting(trx);
	})
	.then(function(){
		return knex('roles').where({title: 'member'}).select('id');
	})
	.then(function(roles){
		var role_id = roles[0].id;
		var salt = bcrypt.genSaltSync(5);
		var hash = bcrypt.hashSync('hagemaru', salt, null);
		var user = {
			username : '1122334455',
			password : hash,
			fullname : 'Pablo Escobar',
			phone: '085222206414',
			role_id: role_id,
			bpjs_number : '1122334455',
			identity_number : '5544332211',
			birth_date : new Date(1988, 8, 3, 0, 0, 0, 0),
			status : 'Beristri Dua',
			blood_type: 'O',
			sex : 'male',
			address_id: 1,
			is_active : 0,
		};
		return knex('users').insert(user).transacting(trx);
	})
	.then(trx.commit)
	.then(function(){
		console.log('Tables created!!!');
		process.exit(0);
	})
	.catch(trx.rollback);
});