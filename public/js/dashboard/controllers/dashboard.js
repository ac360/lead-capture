angular.module('appDashboard').controller('DashboardController', ['$rootScope', '$scope', '$timeout', '$modal', 'LeadCapture',
	function($rootScope, $scope, $timeout, $modal, LeadCapture) {

		// Set Defaults
		$scope.domains = [];
		$scope.new_domain = '';
		$scope.domain;
		$scope.form;
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
			options: []
		};
		// Default Form
		var defaultForm = {
			title: 'Untitled Form',
			cta1: 'Get Updates',
			cta2: 'Sign up to receive updates about our service',
			blocks: [$scope.fields.full_name, $scope.fields.email]
		}

		$scope.initialize = function() {
			// Get Domains
			$scope.listDomains();
		};

		$scope.listDomains = function(callback) {
			LeadCapture.listDomains(function(response) {
				$scope.domains = response;
				console.log("Domains Fetched: ", $scope.domains);
				$scope.domain = $scope.domains[0];
				$scope.form = $scope.domain.forms[0];
				if ($scope.form === undefined) $scope.form = defaultForm;
			}, function(error) {
				console.log(error);
			});
		};

		$scope.createDomain = function() {
			LeadCapture.createDomain({}, { domain: $scope.new_domain }, function(response) {
				$scope.new_domain = '';
				$scope.listDomains();
			}, function(error) {
				console.log(error);
			});
		};

		$scope.addField = function() {
			$scope.form.blocks.push($scope.fields[$scope.field]);
			$scope.field = 'email';
			console.log("Field Added: ", $scope.form)
		};	

		$scope.moveSortable = function(item, index, direction) {
            if (direction === 'up' && index > 0) {
                $scope.form.blocks.splice(index, 1);
                $scope.form.blocks.splice(index - 1, 0, item);
            }
            if (direction === 'down' && index < $scope.form.blocks.length) {
                $scope.form.blocks.splice(index, 1);
                $scope.form.blocks.splice(index + 1, 0, item);
            }
        }

        $scope.removeSortable = function(index) {
            $scope.form.blocks.splice(index, 1);
        }

	}
]);	