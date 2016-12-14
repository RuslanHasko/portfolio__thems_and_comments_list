'use strict';

var app = angular.module('testApp', []);

// App Controller
app.controller('appController', appController);
appController.$inject = ['$anchorScroll', '$location', '$scope', '$http'];

function appController($anchorScroll, $location, $scope, $http) {
  $scope.currentItemComments = [];
  $scope.currentItem = null;
	$scope.saved = localStorage.getItem('commentsData');
	$scope.commentsData = (localStorage.getItem('commentsData')!==null) ? JSON.parse($scope.saved) : [];

  // Update Local storage function
  $scope.updateLocalStorage = function() {
    localStorage.setItem('commentsData', JSON.stringify($scope.commentsData));
  }
  // End of Update Local storage function

  // Scroll to id function
  $scope.goToArchor = function(id, x) {
    var newHash = id + x;
    if ($location.hash() !== newHash) {
      $location.hash(id + x);
    } else {
      $anchorScroll();
    }
  };
  // End of Scroll to id function

  // Add Item function
  $scope.addItem = function() {
    if ($scope.newItemName) {
      $scope.commentsData.push({
        itemName: $scope.newItemName,
        itemComments: []
      });
  		$scope.newItemName = '';
  		$scope.updateLocalStorage();
      $scope.setCurrentItem($scope.commentsData.length - 1);
      $scope.goToArchor('item', $scope.commentsData.length - 1);
    } else {
      alert("Item name can not be empty!")
    }
	};
  // End of Add Item function

  // Delete Item function
  $scope.deleteItem = function(i) {
    var deleteQwestion = confirm("Are You sure?");
    if(deleteQwestion) {
      if($scope.commentsData.length == 1) {
        $scope.currentItemComments = [];
        $scope.currentItem = null;
      } else {
        if (i == 0) {
          $scope.setCurrentItem(i);
        } else {
          $scope.setCurrentItem(i-1);
        }
      }
      $scope.newItemComment = '';
      $scope.commentsData.splice(i, 1);
      $scope.updateLocalStorage();
    }
  }
  // End of Delete Item function

  // Get current Item function
  $scope.setCurrentItem = function(i) {
    $scope.currentItem = i;
    $scope.currentItemComments = $scope.commentsData[i].itemComments;
  }
  // End of Get current Item function

  // Add Comment function
  $scope.addComment = function() {
    if ($scope.newItemComment) {
      $scope.commentsData[$scope.currentItem].itemComments.push({
          text: $scope.newItemComment
      });
  		$scope.newItemComment = '';
  		$scope.updateLocalStorage();
      var x = $scope.commentsData[$scope.currentItem].itemComments.length - 1;
      $scope.goToArchor('comment', x);
    } else {
      alert("Comment field can not be empty!")
    }
	};
  // End of Add Comment function
}
// End of App Controller

// "Enter" keymap directive
app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown", function(e) {
      if(e.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter, {'e': e});
        });
        e.preventDefault();
      }
    });
  };
});
// End of "Enter" keymap directive
