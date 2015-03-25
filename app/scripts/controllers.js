angular.module('starter.controllers', [])
  .run(function($rootScope,auth,$state){
    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){
        var data=auth.getToken();
        $rootScope.expiration=Math.round((data.expire-new Date())/1000);

        if(!auth.isValid() && toState.name!=='login'){
          console.log('not valid');
          $state.go('login');
        }
      })
  })
  .controller('LoginCtrl', function($scope,$state,auth) {
      $scope.loginData={};

      $scope.login=function(){
        if($scope.loginData.user=='admin' && $scope.loginData.pass=='admin'){
            auth.setToken('supertoken');
            $state.go('tab.dash');
            $scope.loginData.pass='';
        }else{
            alert('user admin/admin to signin');
        }
      };
  })
  .controller('DashCtrl', function() {
console.log('dashctrl');
  })

  .controller('ChatsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    }
  })

  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function($scope,$state,auth) {
    $scope.logout = function(){
      auth.logout();
      $state.go('login');
    };
  });
