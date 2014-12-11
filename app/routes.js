module.exports = function(app) {

	// Application Routes
	var application = require('../app/controllers/application');
	var leads = require('../app/controllers/leads');

	// Lead Capture API Route – TODO: Create Middleware that checks domain and authorizes it
	app.post('/api/1/:domain', leads.capture);

	// Other Routes
	app.get('/servant/callback', application.authenticationCallback)
	app.get('/logout', application.logout);
	app.get('/', application.index);

};