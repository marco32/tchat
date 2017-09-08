  $(function () {
var username;
var userface= "http://api.adorable.io/avatar/50/"+username+".png";
var check = false;
$("#Valid").click(function(){
  username= $("#Pseudo").val();
  $("#connect").toggle();
  $('main').toggle();
  $("footer").toggle();
  userco();
})
    var socket = io();
    $('form').submit(function(){
      // e.preventDefaut();
      socket.emit('chat message',$('#m').val(),username );
      $('#m').val('');
      return false;
    });
     socket.on('chat message', function(msg,user,time){
        //  $('#messages').append($('<li><img class="img" src="http://api.adorable.io/avatar/10/'+user+'.png" alt="">')).append($('<div>').text(user+" à dit : "+msg));
          $('#messages').append($('<div class="chip"><div><img class="img" src="http://api.adorable.io/avatar/10/'+user+'.png" alt="">'+user+": "+msg+'<div>'+time+'</div></div></div>'));         
          window.scrollTo(0, document.body.scrollHeight);
        });
      socket.on('user connected', function(user, newuser){
        $("#user").html("")
        for (var i = 0; i < user.length; i++) {
          
        $("#user").append('<li><div class="chip"><img class="img" src="http://api.adorable.io/avatar/10/'+user[i].user+'.png" alt="">'+user[i].user+'</div></li>')
        }
        $("#messages").append('<div>'+newuser.user+' c\'est connecté</div')
      })
      socket.on('user left', function(user, userleft){
        $("#user").html("")
        for (var i = 0; i < user.length; i++) {
          
        $("#user").append('<div>'+user[i].user+'</div>')
        }
        $("#messages").append('<div>'+userleft.user+' c\'est déconnecté</div')
      })
      socket.on('oldmsg', function(allmsg){
         if(allmsg != null && check == false ){
          check = true;
          for (var j = 0; j < allmsg.length; j++) {
          $('#messages').append($('<div class="chip"><div><img class="img" src="http://api.adorable.io/avatar/10/'+allmsg[j].nom+'.png" alt="">'+allmsg[j].nom+": "+allmsg[j].msg+'<div>'+allmsg[j].time+'</div></div></div>'));                   
          }
        }
      })      

 function userco (){
  socket.emit('user connected', username); 
 }
  });
