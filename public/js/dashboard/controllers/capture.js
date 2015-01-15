angular.module('appDashboard').controller('CaptureController', ['$rootScope', '$scope', '$timeout', '$modal', 'LeadCapture',
    function($rootScope, $scope, $timeout, $modal, LeadCapture) {

        // Set Defaults
        $scope.domains = [];
        $scope.tags = [];
        $scope.default_tag_index;
        $scope.new_domain;
        $scope.new_popup;
        $scope.new_option = {
            option: '',
            tag: ''
        };
        $scope.new_event = 'timer';
        $scope.field_types = [
            'email',
            'full_name',
            'select'
        ];
        $scope.field = 'email';
        // Fields
        $scope.fields = {};
        $scope.fields.email = {
            type: "email"
        };
        $scope.fields.full_name = {
            type: "full_name"
        };
        $scope.fields.select = {
            type: "select",
            title: "Untitled Select Field",
            select_options: []
        };
        // Default Popup
        var defaultPopup = {
            title: 'Untitled Pop-Up',
            cta1: 'Get Updates',
            cta2: 'Sign up to receive updates about our service',
            blocks: [$scope.fields.full_name, $scope.fields.email],
            events: [{
                type: 'timer',
                time: 2000
            }],
            default_tags: []
        }

        $scope.initialize = function() {
            // Defaults
            $scope.popup_index = 0;
            $scope.domain_index = 0;
            // Get Domains
            $scope.listDomains();
            // Watch Domain
            $scope.$watch('domain_index', function(newDomain, oldDomain) {
                if (newDomain !== oldDomain) {
                    $scope.popup_index = 0;
                }
            });
            // Load Tags
            $scope.listTags();
        };


        /**
         * ------------------ PopUp Design Functions
         */


        $scope.saveAndPreview = function() {
            LeadCapture.saveDomain(null, $scope.domains[$scope.domain_index], function(response) {
                $scope.domains[$scope.domain_index] = response;
                window.location = '/preview/' + response.domain_name;
            }, function(error) {
                console.log(error);
            });
        };

        $scope.addField = function() {
            $scope.domains[$scope.domain_index].popups[$scope.popup_index].blocks.push($scope.fields[$scope.field]);
            $scope.field = 'email';
            console.log("Field Added: ", $scope.domains[$scope.domain_index]);
        };

        $scope.addOption = function(block_index) {
            var tempOption = angular.copy($scope.new_option);
            tempOption.tag = $scope.tags[$scope.new_option.tag];
            $scope.domains[$scope.domain_index].popups[$scope.popup_index].blocks[block_index].select_options.push(tempOption);
            // Reset Field Option
            $scope.new_option = {
                option: '',
                tag: ''
            };
        };

        $scope.addEvent = function() {

            // Check for non-allowed duplicate events
            for (i = 0; i < $scope.domains[$scope.domain_index].popups[$scope.popup_index].events.length; i++) {
                if ($scope.domains[$scope.domain_index].popups[$scope.popup_index].events[i].type === $scope.new_event && $scope.new_event !== 'click') return alert("You can only add one of these events");
            }

            // Events 
            if ($scope.new_event === 'timer') $scope.domains[$scope.domain_index].popups[$scope.popup_index].events.push({
                type: 'timer',
                time: 2000
            });
            if ($scope.new_event === 'click') $scope.domains[$scope.domain_index].popups[$scope.popup_index].events.push({
                type: 'click',
                elementID: ''
            });
            if ($scope.new_event === 'scroll') $scope.domains[$scope.domain_index].popups[$scope.popup_index].events.push({
                type: 'scroll'
            });
            if ($scope.new_event === 'exit') $scope.domains[$scope.domain_index].popups[$scope.popup_index].events.push({
                type: 'exit'
            });
            $scope.new_event = 'timer';
        };

        $scope.addDefaultTag = function() {
            $scope.domains[$scope.domain_index].popups[$scope.popup_index].default_tags.push($scope.tags[$scope.default_tag_index]);
        };

        $scope.moveBlock = function(item, index, direction) {
            if (direction === 'up' && index > 0) {
                $scope.domains[$scope.domain_index].popups[$scope.popup_index].blocks.splice(index, 1);
                $scope.domains[$scope.domain_index].popups[$scope.popup_index].blocks.splice(index - 1, 0, item);
            }
            if (direction === 'down' && index < $scope.domains[$scope.domain_index].popups[$scope.popup_index].blocks.length) {
                $scope.domains[$scope.domain_index].popups[$scope.popup_index].blocks.splice(index, 1);
                $scope.domains[$scope.domain_index].popups[$scope.popup_index].blocks.splice(index + 1, 0, item);
            }
        }


        /**
         * ------------------ Domain Functions
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

        $scope.setDomainIndex = function(index) {
            $scope.domain_index = index;
        };

        $scope.createDomain = function() {
            LeadCapture.createDomain({}, {
                domain_name: $scope.new_domain
            }, function(response) {
                $scope.listDomains(function() {
                    $scope.new_domain = '';
                });
            }, function(error) {
                console.log(error);
            });
        };

        $scope.destroyDomain = function(domain, index) {
            LeadCapture.destroyDomain({
                domain_name: domain.domain_name
            }, function(response) {
                $scope.listDomains(function() {
                    $scope.domain_index = 0;
                });
            }, function(error) {
                console.log(error);
            });
        };

        /**
         * ------------------ Popup Functions
         */

        $scope.createPopup = function() {
            if (!$scope.new_popup || !$scope.new_popup.length) return;
            if ($scope.domains[$scope.domain_index].popups && $scope.domains[$scope.domain_index].popups.length >= 4) {
                alert("You have the maximum amount of popups allowed for a domain");
                return;
            }
            var newPopup = angular.copy(defaultPopup);
            newPopup.title = $scope.new_popup;
            if (!$scope.domains[$scope.domain_index].popups) $scope.domains[$scope.domain_index].popups = [];
            $scope.domains[$scope.domain_index].popups.push(newPopup);
            $scope.new_popup = '';
            $scope.popup_index = $scope.domains[$scope.domain_index].popups.length - 1;
        };

        $scope.setPopupIndex = function(index) {
            $scope.popup_index = index;
        };

        $scope.removePopup = function(index) {
            var c = confirm("Are you sure you want to delete this Pop-Up?");
            if (c) $scope.domains[$scope.domain_index].popups.splice(index, 1);
            $scope.popup_index = $scope.domains[$scope.domain_index].popups.length - 1;
        };

        /**
         * ------------------ Tag Functions
         */
        $scope.listTags = function() {
            LeadCapture.listTags(function(response) {
                console.log(response);
                $scope.tags = response;
            }, function(error) {
                console.log(error);
            });
        };
        $scope.saveTag = function() {
            // Check Tag Exists
            if (!$scope.new_tag || !$scope.new_tag.length) return false;
            // Check Tags Created
            if ($scope.tags.length >= 40) {
                alert("You have the maximum amount of tags currently allowed.");
                return false;
            }
            LeadCapture.saveTag({}, {
                tag: $scope.new_tag
            }, function(response) {
                console.log(response);
                $scope.new_tag = '';
                $scope.listTags();
            }, function(error) {
                console.log(error);
            });
        };

        $scope.removeTag = function(tag) {
            var c = confirm("Are you sure you want to delete this Tag?  You will need to edit all ofthe Pop-Ups that use this tag.");
            if (c) {
                LeadCapture.destroyTag({
                    tagID: tag._id
                }, function(response) {
                    console.log(response);
                    $scope.listTags();
                }, function(error) {
                    console.log(error);
                });
            }
        };
    }
]);