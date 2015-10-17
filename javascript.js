angular.module('PortalApp')

.controller('widgetIdeasCtrl', ['$scope', '$http', '$q', 'widgetIdeasFactory', function ($scope, $http, $q,
widgetIdeasFactory) {

    // Widget Configuration
    $scope.portalHelpers.config = {
        // make 'widgetMenu.html' the template for the top right menu
        "widgetMenu": "widgetMenu.html"
    };

    // Import variables and functions from service
    $scope.loading = widgetIdeasFactory.loading;
    $scope.links = widgetIdeasFactory.links;
    $scope.newIdea = widgetIdeasFactory.newIdea;
    $scope.currentIdea = widgetIdeasFactory.currentIdea;
    $scope.ideas = widgetIdeasFactory.ideas;

    // initialize the service
    widgetIdeasFactory.init($scope);

    // watch for changes in the loading variable
    $scope.$watch('loading.value', function () {
        // if loading
        if ($scope.loading.value) {
            // show loading screen in the first column, and don't append it to browser history
            $scope.portalHelpers.showView('loading.html', 1, false);
            // show loading animation in place of menu button
            $scope.portalHelpers.toggleLoading(true);
        } else {
            $scope.portalHelpers.showView('main.html', 1);
            $scope.portalHelpers.toggleLoading(false);
        }
    });

    $scope.showCreateView = function() {
        $scope.portalHelpers.showView('createView.html', 2);
    };
    
    // Create table, invoked by a button press from database test example
    $scope.createTable = function () {
        $scope.portalHelpers.invokeServerFunction('createTable').then(function (
            result) {
            $scope.dbData.value = [];
        });
    }

    // Handle form submit in the database test example
    $scope.insertIdea = function () {
        if ($scope.insertValue.value.length > 50)
            alert('value should be less than 50 characters');
        else {
            $scope.portalHelpers.invokeServerFunction('insert', {
                value: $scope.insertValue.value
            }).then(function (result) {
                $scope.dbData.value = result;
            });
            $scope.insertValue.value = "";
        }
    };

    // Handle click on an item in the list and search example
    $scope.showIdea = function (idea) {
        // Set which item to show in the details view
        $scope.currentIdea = idea;
        $scope.portalHelpers.invokeServerFunction('getComments', { path: idea.path }).then(function(result) {
           	$scope.currentIdea.comments = result.comments; 
            console.log(result);
        });
        // Show details view in the second column
        $scope.portalHelpers.showView('ideaView.html', 2);
    };

    // Handle "previous item" click from the details page
    $scope.prevItem = function () {
        // get previous items in the list
        var prevItem = $scope.portalHelpers.getPrevListItem();
        // refresh details view with the new item
        $scope.showIdea(prevItem);
    }

    $scope.nextItem = function () {
        var nextItem = $scope.portalHelpers.getNextListItem();
        $scope.showIdea(nextItem);
    }

}])
    // Factory maintains the state of the widget
    .factory('widgetIdeasFactory', ['$http', '$rootScope', '$filter', '$q', function ($http, $rootScope,
        $filter, $q) {
        var initialized = {
            value: false
        };

        // Your variable declarations
        var loading = {
            value: true
        };
        var newIdea = {
            title: null,
            description: null,
            category: null
        };
        var ideas = {
            value: null
        };
        var currentIdea = {
            title: null,
            description: null,
            category: null
        };

        var init = function ($scope) {
            if (initialized.value)
                return;
            initialized.value = true;

            $scope.portalHelpers.invokeServerFunction('getSuggestions').then(function(result) {
                console.log(result);
                $scope.ideas = result.suggestions;
                loading.value = false;
            });
            
            // Place your init code here:
			
            //$scope.portalHelpers.invokeServerFunction('getIdeas').then(function (result) {
            //    ideas.value = result;
            //    loading.value = false;
            //});
        }

        return {
            init: init,
            loading: loading,
            newIdea: newIdea,
            currentIdea: currentIdea,
            ideas: ideas
        };

    }])
    // Custom directive example
    .directive('widgetIdeasDirectiveName', ['$http', function ($http) {
        return {
            link: function (scope, el, attrs) {

            }
        };
    }])
    // Custom filter example
    .filter('widgetIdeasFilterName', function () {
        return function (input, arg1, arg2) {
            // Filter your output here by iterating over input elements
            var output = input;
            return output;
        }
    });