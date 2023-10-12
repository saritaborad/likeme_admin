const mongoose = require("mongoose");

const reportResonSchema = new mongoose.Schema({ title: { type: String } }, { timestamps: true });

const ReportReson = mongoose.model("ReportReson", reportResonSchema);

module.exports = ReportReson;
