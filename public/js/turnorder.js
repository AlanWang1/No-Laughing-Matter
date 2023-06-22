var turnorder = [];

socket.on("new-user", (data) => {
  turnorder.push([data.name]);
  //console.log("data.name "+ data.name)
  //console.log("id sent to all clients "+ data.name)
  //console.log("should be my current id " + socket.id)
  if (data.name == socket.id) {
    //attempt at adding names
    var len = turnorder.length - 1;
    turnorder[len].push(NAME);
    //console.log(turnorder)
    socket.emit("URGENT_LIST_UPDATE", { list: turnorder });
  }
  socket.on("GLOBAL_URGENT_LIST_UPDATE", (data) => {
    turnorder = data.globallist;
  });
  socket.emit("list-update", { list: turnorder });
});
socket.on("global-list-update", (data) => {
  //console.log(turnorder)
  if (data.globallist.length > turnorder.length) {
    turnorder = data.globallist;
  }
  //console.log("list length update " +turnorder)
  //console.log(turnorder)
});
