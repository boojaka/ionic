angular.module('starter.controllers', [])
  .run(function($rootScope,auth,$state,$timeout){
    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){
        $rootScope.expiration=Math.round((auth.getToken().expire-new Date())/1000);

        if(!auth.isValid() && toState.name!=='login'){
          console.log('not valid');
          $state.go('login');
        }
      });

  })
  .controller('LoginCtrl', function($scope,$state,auth) {
      $scope.loginData={};

      if(auth.isValid()){
        $state.go('tab.dash');
      }

      $scope.login=function(){
        if($scope.loginData.user=='admin' && $scope.loginData.pass=='admin'){
            auth.setToken('supertoken');
            $state.go('tab.dash');
            $scope.loginData.pass='';
        }else{
            alert('use admin/admin');
        }
      };
  })
  .controller('DashCtrl', function($rootScope,$scope,auth,$state) {
    $scope.refresh=function(){
          $rootScope.expiration=Math.round((auth.getToken().expire-new Date())/1000);
          if($rootScope.expiration<=0){
            console.log('expired');
            $state.go('login');
          }
          $scope.$broadcast('scroll.refreshComplete');

    };
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
