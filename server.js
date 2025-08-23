const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/route");
const { PORT, DBURL } = require("./config/index");
const errorMiddleware = require("./middlewares/errorMiddleware");
mongoose.set("strictQuery", false);

mongoose.connect(DBURL);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app = express();
app.use(express.json());

app.use("/user", routes);



// global error handler 
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

