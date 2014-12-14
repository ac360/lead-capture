// Clients service used for clients REST endpoint
angular.module('appDashboard').factory('LeadCapture', function($resource) {
    return $resource('', null, {
        listDomains: {
            method: 'GET',
            isArray: true,
            url: '/domains'
        },
        createDomain: {
            method: 'POST',
            isArray: false,
            url: '/domains'
        },
        saveDomain: {
            method: 'PUT',
            isArray: false,
            url: '/domains/:domain'
        }
    });
});