module.exports = function(app) {

	// Defaults
	var cors = require('cors');

	// Application Routes
	var application = require('../app/controllers/application');
	var leads = require('../app/controllers/leads');

	// Lead Capture API Route – TODO: Create Middleware that checks domain and authorizes it
	app.get('/api/1/:domain/initialize', cors(), leads.initialize);
	app.post('/api/1/:domain/capture/form', cors(), leads.captureForm);

	// Other Routes
	app.post('/login', application.login);
	app.get('/logout', application.logout);
	app.get('/', application.index);

};