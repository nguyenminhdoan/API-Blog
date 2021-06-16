const express = require("express");
const app = express();
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join(__dirname, "/images")));
require("../src/config/mongo-connect");
app.use(morgan("tiny"));
app.use(cors());

//store images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "./images/"));
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name || "filename.jpeg");
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

// import routers
const UserRouter = require("./routes/user.router");
const PostRouter = require("./routes/post.router");
const CategoriesRouter = require("./routes/categories.router");
const TokenRouter = require("./routes/tokens.router");

// use routers
app.use("/api/user", UserRouter);
app.use("/api/post", PostRouter);
app.use("/api/category", CategoriesRouter);
app.use("/api/token", TokenRouter);

app.listen(3003, () => {
  console.log("server started on port 3003");
});
