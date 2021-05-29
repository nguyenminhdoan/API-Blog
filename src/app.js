const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

require("../src/config/mongo-connect");
app.use(morgan("tiny"));

// import routers
const UserRouter = require("./routes/user.router");
const PostRouter = require("./routes/post.router");
const CategoriesRouter = require("./routes/categories.router");

// use routers
app.use("/api/user", UserRouter);
app.use("/api/post", PostRouter);
app.use("/api/category", CategoriesRouter);

app.listen(3000, () => {
  console.log("server started on port 3000");
});
