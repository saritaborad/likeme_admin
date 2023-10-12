const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const { connectDB } = require("./config/db");
const indexRouter = require("./routes/index");
const errorHandler = require("./middleware/error");
const Upload = require("./routes/Upload");

const path = require("path");
require("dotenv").config();
connectDB();

const PORT = process.env.PORT || 5011;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({ origin: process.env.REACT_LOCAL_URL, credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 3600000 * 24 } }));

app.use("/upload", Upload);
app.use("/api", indexRouter);
app.use(errorHandler);

app.listen(PORT, () => console.log(`server is listening on http://localhost:${PORT}`));
