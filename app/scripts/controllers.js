angular.module('starter.controllers', [])

  .controller('LoginCtrl', function($scope,$state) {
      $scope.loginData={};

      $scope.login=function(){
        $state.go('tab.dash');
        console.log($scope.loginData);
      };
  })
  .controller('DashCtrl', function($scope) {})

  .controller('ChatsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    }
  })

  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
