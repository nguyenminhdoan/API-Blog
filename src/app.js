const express = require("express");
const app = express();
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
app.use(express.json());
const cors = require("cors");

app.use("/images", express.static(path.join(__dirname, "/images")));
require("../src/config/mongo-connect");
app.use(morgan("tiny"));
app.use(cors());

//store images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
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

// use routers
app.use("/api/user", UserRouter);
app.use("/api/post", PostRouter);
app.use("/api/category", CategoriesRouter);

app.listen(3003, () => {
  console.log("server started on port 3003");
});
