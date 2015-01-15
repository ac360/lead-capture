// Angular Router
angular.module('appDashboard').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// For any unmatched url, redirect to '/'
		$urlRouterProvider.otherwise('/campaigns');
		// Now set up the states
		$stateProvider
			.state('capture', {
				url: '/capture',
				templateUrl: 'views/dashboard/capture.html'
			});
		$stateProvider
			.state('campaigns', {
				url: '/campaigns',
				templateUrl: 'views/dashboard/campaigns.html'
			});
	}
]);

// Setting HTML5 Location Mode
angular.module('appDashboard').config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);