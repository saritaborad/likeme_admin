const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const connectDB = async () => {
 await mongoose
  .connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
  })
  .then(() => {
   console.log("Mongodb Connected");
  });
};

const connClientDB = () => {
 const client = new MongoClient("mongodb://127.0.0.1:27017", {
  family: 4,
 });
 client
  .connect()
  .then(() => {
   //  console.log("clientdb connected");
  })
  .catch((err) => {
   console.log(err);
  });

 const db = client.db("demo2");
 return db;
};

const getCollection = (name) => {
 const DB = connClientDB();
 const Collection = DB.collection(name);
 return Collection;
};

module.exports = { connectDB, getCollection };
