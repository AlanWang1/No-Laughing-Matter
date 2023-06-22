const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

const prompts = [
  "mario judah",
  "xxxtentacion",
  "AIYY LMAO",
  "we got this guys",
  "unfunny joke 5",
];

// temporary (replace/edit later)
app.use("/results", (req, res) => {
  res.render("results");
});

app.post("/submit", (req, res) => {
  //console.log(req.body) //you will get your data in this as object.
  res.cookie("context", req.body.name, { httpOnly: true });
  req.body.room = req.body.room.toUpperCase();
  res.redirect(req.body.room);
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/:room", (req, res) => {
  const context = req.cookies["context"];
  res.clearCookie("context", { httpOnly: true });
  res.render("room", { roomId: req.params.room, name: context });
  //console.log(req.params)
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    io.emit("new-user", { name: socket.id });
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });

    socket.on("cur_score", (data) => {
      io.emit("update_score", { score: data.current_score });
    });

    socket.on("URGENT_LIST_UPDATE", (data) => {
      //console.log(data)
      io.emit("GLOBAL_URGENT_LIST_UPDATE", { globallist: data.list });
    });

    socket.on("list-update", (data) => {
      //console.log('list update')
      io.emit("global-list-update", { globallist: data.list });
    });

    socket.on("start-game", (data) => {
      console.log(`${socket.id} sent to ${data.cur_turn}`); //if not the target user it does not send?????
      io.emit("GAME_STARTED");
      //console.log(data) /// EMPTY OBJECT WHAT
      var address = data.cur_turn[0];

      //if turn
      io.to(address).emit("your_turn");
    });

    socket.on("prompt", (data) => {
      console.log(prompts[data.turnNum]);
      //console.log(data)
      console.log(data.cur_turn);
      io.to(data.cur_turn[0]).emit("start-judging", { turn: data.cur_turn });
      io.emit("displayPrompt", {
        PROMPT: prompts[data.turnNum],
        DisplayName: data.curName,
        turn: data.cur_turn,
      });
    });
    // socket.on('start-judging', (data) =>{
    //   io.to.emit('check-score', {turn: data.cur_turn})
    //     //code to check if score reaches below threshold
    // })
    socket.on("round-over", (data) => {
      console.log("round-over sent!");
      //console.log(data) //EMPTY OBJECT
      io.emit("new-round", { turn: data.cur_turn });
    });
    socket.on("game-over", () => {
      io.emit("GAMEOVER");
      setTimeout(res.render("results"), 1000);
    });
  });
});

PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
