const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");

require("./models/User");
require("./models/List");
require("./models/Todo");
require("dotenv").config();
require("./services/passport");

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(passport.initialize());

app.use(passport.session());

require("./routes/indexRoutes")(app);
require("./routes/authRoutes")(app);
require("./routes/todoRoutes")(app);

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on http://localhost:3000");
});
