const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db");
const indexRouter = require("./routes/index");
const errorHandler = require("./middleware/error");
const Upload = require("./routes/Upload");
require("dotenv").config();

const path = require("path");
connectDB();

const PORT = process.env.PORT || 5011;
let origin = process.env.PRODUCTION == 1 ? process.env.REACT_LIVE_URL : process.env.REACT_LOCAL_URL;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({ origin: origin, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 3600000 * 24 } }));

app.get("/", (req, res) => {
 res.send("get success!");
});

app.use("/upload", Upload);
app.use("/api", indexRouter);
app.use(errorHandler);

app.listen(PORT, () => console.log(`server is listening on http://localhost:${PORT}`));
