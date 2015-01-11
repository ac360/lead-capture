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
        },
        listTags: {
            method: 'GET',
            isArray: true,
            url: '/tags'
        },
        saveTag: {
            method: 'POST',
            isArray: false,
            url: '/tags'
        },
        destroyTag: {
            method: 'DELETE',
            isArray: false,
            url: '/tags/:tagID'
        },
        destroyDomain: {
            method: 'DELETE',
            isArray: false,
            url: '/domains/:domain_name'
        }
    });
});