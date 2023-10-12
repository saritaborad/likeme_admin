const mongoose = require("mongoose");

const HostLiveStreamTrackSchema = new mongoose.Schema(
 {
  host_id: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
  },
  start: {
   type: Date,
  },
  end: {
   type: Date,
  },
 },
 {
  timestamps: true,
 }
);

const HostLiveStreamTrack = mongoose.model("HostLiveStreamTrack", HostLiveStreamTrackSchema);

module.exports = HostLiveStreamTrack;
