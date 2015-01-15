angular.module('appDashboard').controller('CampaignsController', ['$rootScope', '$scope', '$timeout', '$modal', 'LeadCapture',
    function($rootScope, $scope, $timeout, $modal, LeadCapture) {

        // Set Defaults
        $scope.show_campaigns = false;
        $scope.show_templates = false;
        $scope.templates = [];
        $scope.new_campaign = {
            autoresponse_template: '',
            type: '',
            sequence: []
        };

        $scope.initialize = function() {
            // List Campaigns
            $scope.listCampaigns();
            // List Templates
            $scope.listTemplates();
            // Add New Template
            $scope.campaign = angular.copy($scope.new_campaign);
            console.log($scope.campaign);
        };

        $scope.selectCampaign = function(campaign) {
            $scope.campaign = campaign;
        };

        $scope.newCampaign = function() {
            $scope.campaign = angular.copy($scope.new_campaign);
        };

        $scope.listCampaigns = function() {
            LeadCapture.listCampaigns(function(response) {
                $scope.campaigns = response;
                console.log($scope.campaigns);
            }, function(error) {
                console.log(error)
            });
        };

        $scope.listTemplates = function() {
            LeadCapture.listTemplates(function(response) {
                $scope.templates = response;
                console.log($scope.templates);
            }, function(error) {
                console.log(error)
            });
        };

        $scope.saveCampaign = function() {
            if (!$scope.campaign.name) return alert("A campaign name is required.")
            LeadCapture.saveCampaign({}, $scope.campaign, function(response) {
                console.log(response);
                $scope.listCampaigns();
            }, function(error) {
                console.log(error)
            });
        };

        $scope.addToSequence = function(template) {
            $scope.campaign.sequence.push({
                template: template.name,
                number: 1,
                interval: 'Days'
            });
        };

        $scope.moveEmail = function(item, index, direction) {
            if (direction === 'up' && index > 0) {
                $scope.campaign.sequence.splice(index, 1);
                $scope.campaign.sequence.splice(index - 1, 0, item);
            }
            if (direction === 'down' && index < $scope.campaign.sequence.length) {
                $scope.campaign.sequence.splice(index, 1);
                $scope.campaign.sequence.splice(index + 1, 0, item);
            }
        };

        $scope.adjustNumber = function(index, direction) {
            if (direction === 'up' && $scope.campaign.sequence[index].number < 24) $scope.campaign.sequence[index].number = $scope.campaign.sequence[index].number + 1;
            if (direction === 'down' && $scope.campaign.sequence[index].number !== 1) $scope.campaign.sequence[index].number = $scope.campaign.sequence[index].number - 1;
        };

        $scope.adjustInterval = function(index) {
            if ($scope.campaign.sequence[index].interval === 'Days') $scope.campaign.sequence[index].interval = 'Hours';
            else $scope.campaign.sequence[index].interval = 'Days';
        };

    }
]);


// End