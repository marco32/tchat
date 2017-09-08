var express = require('express');
var app= express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment= require('moment')
http.listen(3000);
var userList=[];
var userco={};
app.use(express.static(__dirname+"/client"));
// Mongoose //
var mongoose= require('mongoose');
var db= mongoose.connection;
mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});
  console.log('ok')
  // User //
   var chatuserSchema= mongoose.Schema({
     nom: {type:String, required:true},
     msg: {type:String, required:true},
     time: String
   })
   var chatuser= mongoose.model('chatuser', chatuserSchema);

app.get('/admin/admin/admin',function(req,res){
  chatuser.remove(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Base remise à zéro");
    }
  });
});
// ///  
io.emit('some event', { for: 'everyone' });
io.on('connection', function(socket){
  socket.on('user connected', function(user){
    var allmsg;
    socket.username=user;
    userco={
      user: socket.username
    }
    userList.push(userco);
     chatuser.find(function(err, chatusers){
     if(err){
       console.log(err);
     }else{
       allmsg= chatusers
    io.emit('oldmsg', allmsg);
     }
   })
    io.emit('user connected', userList, userco);
    return userList;
  })
  socket.on('chat message', function(msg,user){
    var instant= moment().format('MMMM Do YYYY, h:mm:ss a');
    var chatusers= new chatuser({
      nom: user,
      msg: msg,
      time: instant
    });
    chatusers.save(function(err, chatuser){
      if(err) return console.error(err);
      console.log(user);
    });
   io.emit('chat message', msg, user, instant);
 })
  socket.on('disconnect', function(){
    var userdeco={
      user: socket.username
    }
    var del;
    for (var i = 0; i < userList.length; i++) {
      if(userList[i].user === userdeco.user){
        del = i
      }
    }
    if(del != undefined){
        userList.splice(del, 1)
    }
    io.emit('user left', userList, userdeco)
  })

});

