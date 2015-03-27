angular.module('starter.services', [])

  .factory('auth', function() {

    var expSeconds=6000;

    return {
      logout:function(){
        localStorage.setItem("token", JSON.stringify({
          'token':null,
          'expire':new Date()-1-expSeconds*1000
        }));
      },
      setToken:function(str){
        localStorage.setItem("token", JSON.stringify({
          'token':str,
          'expire':new Date()-1+expSeconds*1000
        }));
      },
      getToken:function(){
        return JSON.parse(localStorage.getItem("token")) || {
            'token':'',
            'expire':0
          };
      },
      isValid:function(){
        var token=this.getToken();
        console.log('expire in='+(token.expire-(new Date()-1)));
        return (token && token.token && token.expire>new Date()-1) ? 1: 0;
      }
    }
  })
  .factory('todo',function(){
    var arr=['First item','Second item'];
    return {
      all:function(){
        return arr;
      },
      add:function(str){
        arr.push(str);
      },
      remove:function(id){
        arr.splice(id,1);
      }
    }
  })
;
