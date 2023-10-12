const mongoose = require("mongoose");

const storeDataSchema = new mongoose.Schema({
 store: {
  type: String,
  required: true,
 },
});

const StoreData = mongoose.model("StoreData", storeDataSchema);

module.exports = StoreData;
