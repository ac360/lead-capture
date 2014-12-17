angular.module('appDashboard').controller('DashboardController', ['$rootScope', '$scope', '$timeout', '$modal', 'LeadCapture',
	function($rootScope, $scope, $timeout, $modal, LeadCapture) {

		// Set Defaults
		$scope.domains = [];
		$scope.new_domain;
		$scope.new_option;
		$scope.field_types = [
			'email',
			'full_name',
			'select'
		];
		$scope.field = 'email';
		// Fields
		$scope.fields = {};
		$scope.fields.email = {
			type:"email"
		};
		$scope.fields.full_name = {
			type:"full_name"
		};
		$scope.fields.select = {
			type:"select",
			title: "Untitled Select Field",
			options: ['Option one', 'Option two']
		};
		// Events
		$scope.events = [
			{type: 'timer', time: 2000}
		];
		// Default Form
		var defaultForm = {
			title: 'Untitled Form',
			cta1: 'Get Updates',
			cta2: 'Sign up to receive updates about our service',
			blocks: [$scope.fields.full_name, $scope.fields.email],
			events: [{type: 'timer', time: 2000}]
		}

		$scope.initialize = function() {
			// Defaults
			$scope.form_index = 0;
			$scope.domain_index = 0;
			// Get Domains
			$scope.listDomains(function() {
				// Add Form, If None
				if (!$scope.domains[$scope.domain_index].forms[0]) $scope.domains[$scope.domain_index].forms[$scope.form_index] = angular.copy(defaultForm);
			});

			// Watch Domain
			$scope.$watch('domain_index', function(newDomain, oldDomain) {
			    if (newDomain !== oldDomain) {
			    	console.log("Changed Domain")
					$scope.form_index = 0;
					// Add Form, If None
					if (!$scope.domains[$scope.domain_index].forms[0]) $scope.domains[$scope.domain_index].forms[$scope.form_index] = angular.copy(defaultForm);
			    }
			});
		};

		/**
		 * Domain Functions
		 */

		$scope.listDomains = function(callback) {
			LeadCapture.listDomains(function(response) {
				console.log("Domains Fetched: ", response);
				$scope.domains = response;
				if (callback) callback();
			}, function(error) {
				console.log(error);
			});
		};

		$scope.createDomain = function() {
			LeadCapture.createDomain({}, { domain: $scope.new_domain }, function(response) {
				$scope.listDomains(function() {
					$scope.new_domain = '';
					// Add Form, If None
					if (!$scope.domains[$scope.domain_index].forms[0]) $scope.domains[$scope.domain_index].forms[$scope.form_index] = angular.copy(defaultForm);
				});
			}, function(error) {
				console.log(error);
			});
		};

		/**
		 * Form Functions
		 */
		$scope.saveAndPreview = function() {
			LeadCapture.saveDomain(null, $scope.domains[$scope.domain_index], function(response) {
				$scope.domains[$scope.domain_index] = response;
				window.location = '/preview/' + response.domain;
			}, function(error) {
				console.log(error);
			});
		};

		$scope.addField = function() {
			$scope.domains[$scope.domain_index].forms[$scope.form_index].blocks.push($scope.fields[$scope.field]);
			$scope.field = 'email';
			console.log("Field Added: ", $scope.domains[$scope.domain_index]);
		};	

		$scope.addOption = function(block_index) {
			console.log($scope.new_option)
			$scope.domains[$scope.domain_index].forms[$scope.form_index].blocks[block_index].options.push($scope.new_option);
			$scope.new_option = '';
		};	

		$scope.moveBlock = function(item, index, direction) {
            if (direction === 'up' && index > 0) {
                $scope.domains[$scope.domain_index].forms[$scope.form_index].blocks.splice(index, 1);
                $scope.domains[$scope.domain_index].forms[$scope.form_index].blocks.splice(index - 1, 0, item);
            }
            if (direction === 'down' && index < $scope.form.blocks.length) {
                $scope.domains[$scope.domain_index].forms[$scope.form_index].blocks.splice(index, 1);
                $scope.domains[$scope.domain_index].forms[$scope.form_index].blocks.splice(index + 1, 0, item);
            }
        }
	}
]);	