const fs = require('fs-extra');
const path = require('path');
const cfg = require('./conf.json');
const Bcrypt = require('bcrypt');
const Hapi = require('hapi');
const Inert = require('inert');
const request = require('request-json');

const Basic = require('hapi-auth-basic');
const page = require('./lib/page.js');

const filesPath = cfg.filePath;
const server = new Hapi.Server();
server.connection({ port: 8642 });
server.register(Inert, () => {
});

const users = cfg.users;
var client = request.createClient('http://localhost:38163/');

const validate = function (request, username, password, callback) {
	const user = users[username];
	if (!user) {
		return callback(null, false);
	}

	Bcrypt.compare(password, user.password, (err, isValid) => {
		callback(err, isValid, { id: user.id, name: user.name, pushoveruser: user.pushoveruser, pushovertoken: user.pushovertoken});
	});
};

server.register(Basic, (err) => {
	server.auth.strategy('simple', 'basic', { validateFunc: validate });
	server.route({
		method: 'GET',
		path: '/',
		config: {
			auth: 'simple',
			handler: function (request, reply) {
				page.folder(filesPath, function (err, result) {
					reply(result);
				});
			}
		}
	});
	server.route({
		method: 'GET',
		path: '/gettag/{datumstag}',
		config: {
			auth: 'simple',
			handler: function (request, reply) {
				const tag = request.params.datumstag ? encodeURIComponent(request.params.datumstag) : '';
				page.collagen(path.join(filesPath, tag), tag, function (err, result) {
					reply(result);
				});
			}
		}
	});
	server.route({
		method: 'GET',
		path: '/sendJob',
		config: {
			auth: 'simple',
			handler: function (request, reply) {
				data = {
					'file': path.join(filesPath, request.query.tag, request.query.filename.replace('collage_mini_','collage_')),
					'count': 1
				};
				if(request.auth.credentials.pushoveruser != '' && request.auth.credentials.pushovertoken != ''){
					data.perroruser = request.auth.credentials.pushoveruser;
					data.perrortoken = request.auth.credentials.pushovertoken;
				}
				client.post('setJob', data, function(err, res, body) {

					if(err || !body.success){
						reply({success:false, message:err +' '+ body.message})
					}else{
						reply({success:true, id: body.id});
					}
				});
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/pictures/{filename*}',
		handler: function (request, reply) {
			reply.file(path.join(filesPath, request.params.filename));

		}
	});
	server.route({
		method: 'GET',
		path: '/public/{filename*}',
		handler: function (request, reply) {
			reply.file(path.join(__dirname, 'public', request.params.filename));

		}
	});

	server.start(() => {
		console.log('server running at: ' + server.info.uri);
	});
});
