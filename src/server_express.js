import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
// 정적파일 제공하기 - image, cssFile, jsFile
// 가상경로, 절대경로
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`)

// 3000port에서 서버 실행
app.listen(3000, handleListen);