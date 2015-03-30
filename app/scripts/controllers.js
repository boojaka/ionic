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

  .controller('ChatsCtrl', function(todoDb,$scope, todo) {
    $scope.online=false;

    $scope.toggle=function(){
      $scope.online=!$scope.online;
      if ($scope.online) {  // Read http://pouchdb.com/api.html#sync
        $scope.sync = todoDb.sync('http://127.0.0.1:5984/todos', {live: true})
          .on('error', function (err) {
            console.log("Syncing stopped");
            console.log(err);
          });
      } else {
        $scope.sync.cancel();
      }
    };
    todoDb.changes({
      live: true,
      onChange: function (change) {
        if (!change.deleted) {
          todoDb.get(change.id, function(err, doc) {
            if (err) console.log(err);
            $scope.$apply(function() { //UPDATE
              for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i]._id === doc._id) {
                  $scope.tasks[i] = doc;
                  return;
                }
              } // CREATE / READ
              $scope.tasks.push(doc);
            });
          })
        } else { //DELETE
          $scope.$apply(function () {
            for (var i = 0; i<$scope.tasks.length; i++) {
              if ($scope.tasks[i]._id === change.id) {
                $scope.tasks.splice(i,1);
              }
            }
          })
        }
      }
    });

    $scope.items=todo.all();
    $scope.data={
      text:''
    };
    $scope.add=function(){
      todo.add($scope.data.text);
      $scope.data.text='';
    };
    $scope.remove=function(id){
      todo.remove(id);
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
  })
  .factory('todoDb', function() {
    var db = new PouchDB('todos');
    return db;
  })
