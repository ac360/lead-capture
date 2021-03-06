module.exports = function(app) {

	// Defaults
	var cors = require('cors');
	var application = require('../app/controllers/application');
	var api = require('../app/controllers/api');

	// Redirect if not HTTPS
	if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
		app.get('*',function(req,res,next){
			if(req.headers['x-forwarded-proto']!=='https')
			    res.redirect('https://lead-capture.herokuapp.com'+req.url)
			else
			    next() /* Continue to other routes if we're not redirecting */
		});
	}
	
	// API Routes – TODO: Create Middleware that checks domain and authorizes it
	app.get('/api/1/:domain', cors(), api.initializeDomain);
	app.post('/api/1/:domain/capture/form', cors(), api.captureForm);

	// Application Routes
	app.get('/templates', application.listMandrillTemplates);
	app.get('/campaigns', application.listCampaigns);
	app.post('/campaigns', application.saveCampaign);
	app.delete('/campaigns/:campaignID', application.deleteCampaign);
	app.get('/domains', application.checkSession, application.listDomains);
	app.post('/domains', application.checkSession, application.createDomain);
	app.delete('/domains/:domain_name', application.checkSession, application.destroyDomain);
	app.put('/domains', application.checkSession, application.saveDomain);
	app.delete('/tags/:tagID', application.checkSession, application.destroyTag);
	app.get('/tags', application.checkSession, application.listTags);
	app.post('/tags', application.checkSession, application.saveTag);
	app.post('/signup', application.signup);
	app.post('/signin', application.signin);
	app.get('/logout', application.logout);
	app.get('/preview/:domain_name', application.preview);
	app.get('/', application.index);

};