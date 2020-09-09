var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan")
const cors = require("cors");

// Routers
var indexRouter = require("./routes/index");
var keychainRouter = require("./routes/keychain");
const keychain = require("./keeper/keychain");

// express app
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.set('port', process.env.PORT || 8080);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.methods == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// index
app.use("/", indexRouter);

// keychain
app.post("/keychain/init", keychainRouter.init);
app.post("/keychain/set", keychainRouter.set);
app.get("/keychain/get", keychainRouter.getByName);
app.delete("/keychain/remove/:name", keychainRouter.remove);
app.get("/keychain/dump", keychainRouter.dump);
app.post("/keychain/load", keychainRouter.load);


app.use(function(req, res, next) {
  next(createError(404))
});

app.use(function(err,req,res,next){
  res.locals.message = err.message;
  res.locals.error = req.app.get("eng") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

