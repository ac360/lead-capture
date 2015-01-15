var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_KEY);


var listTemplates = function(callback) {
    // var label = "example-label";
    mandrill_client.templates.list({}, function(result) {
        return callback(null, result);
    }, function(error) {
        return callback(error, null);
    });
};

module.exports = {
    listTemplates: listTemplates
};