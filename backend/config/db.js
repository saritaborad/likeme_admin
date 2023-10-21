const mongoose = require("mongoose");

const connectDB = async () => {
 await mongoose
  .connect(process.env.LIVEURI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   family: 4,
  })
  .then(() => {
   console.log("Mongodb Connected");
  });
};

module.exports = { connectDB };
