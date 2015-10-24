var Schema = {
	roles: {
		id: {type: 'increments', nullable: false, primary: true},
		title: {type: 'string', maxlength: 150, nullable: false},
	},
	users: {
		id: {type: 'increments', nullable: false, primary: true},
		username : {type:'string', maxlength:65, nullable:true, unique:true},
		fullname : {type:'string', maxlength:100, nullable:false},
		email: {type: 'string', maxlength: 70, nullable: true, unique: true},
		phone: {type: 'string', maxlength: 254, nullable: true, unique: true},
		password: {type: 'string', maxlength: 150, nullable: true},
		role_id: {type: 'integer', nullable: false, unsigned:true, references:'roles.id'},
		bpjs_number : {type:'string', nullable:true, unique:true},
		identity_number : {type:'string', nullable:true, unique:true},
		birth_date : {type:'date', nullable:true},
		status : {type:'string', nullable:true},
		blood_type: {type:'string', nullable:true, maxlength:1},
		sex : {type:'string', nullable:true},
		address_id: {type: 'integer', nullable: true, unsigned:true, references:'addresses.id'},
		is_active : {type: 'boolean', nullable:false, defaultTo:true},
	},
	addresses : {
		id: {type: 'increments', nullable: false, primary: true},
		location : {type:'string', nullable:false},
		village :{type:'string', nullable:false},
		subdistrict : {type:'string', nullable:false},
		regency :  {type:'string', nullable:false},
		province : {type:'string', nullable:false},
	},
	complaints : {
		id : {type: 'increments', nullable: false, primary: true},
		disease : {type:'string', nullable:false},
		date : {type:'date', nullable:false},
		created_at : {type:'timestamp', nullable:false,  rawDefaultTo:'CURRENT_TIMESTAMP'},
		user_id: {type: 'integer', nullable: false, unsigned:true, references:'users.id'},
		location_reference :  {type:'string', nullable:false},
	},
	hospitals : {
		id : {type: 'increments', nullable: false, primary: true},
		name : {type:'string', nullable:false},
		address_id: {type: 'integer', nullable: false, unsigned:true, references:'addresses.id'},
		lat : {type:'string', nullable:false},
		lang : {type:'string', nullable:false}
	},
	services : {
		id : {type: 'increments', nullable: false, primary: true},
		name :{ type:'string', nullable:false},
	},
	hospital_services :{
		id : {type: 'increments', nullable: false, primary: true},
		hospital_id: {type: 'integer', nullable: false, unsigned:true, references:'hospitals.id'},
		service_id: {type: 'integer', nullable: false, unsigned:true, references:'services.id'},
	},
	daily_queues : {
		id : {type: 'increments', nullable: false, primary: true},
		hospital_id: {type: 'integer', nullable: false, unsigned:true, references:'hospitals.id'},
		service_id: {type: 'integer', nullable: false, unsigned:true, references:'services.id'},
		latest_number :{type: 'integer', nullable: false, defaultTo:1},
		remains : {type: 'integer', nullable: false},
		time_average : {type: 'integer', nullable: false},
		date : {type: 'date', nullable: false},
	},
	user_queues:{
		id : {type: 'increments', nullable: false, primary: true},
		daily_queue_id: {type: 'integer', nullable: false, unsigned:true, references:'daily_queues.id'},
		number : {type: 'integer', nullable: false},
	}
};

module.exports = Schema;