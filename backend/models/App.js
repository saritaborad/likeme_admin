const mongoose = require("mongoose");

const appSchema = new mongoose.Schema(
 {
  default_diamond: { type: Number },
  app_name: { type: String },
  type: { type: Number, required: true, default: 1 },
  min_thershold: { type: Number },
  currency: { type: String },
  amount_per_diamond: { type: Number },
  agora_app_cert: { type: String },
  agora_app_id: { type: String },
  user_message_charge: { type: Number },
  host_message_charge: { type: Number },
  host_call_charge: { type: Number },
  host_live_Percentage: { type: Number },
  chargeForLive: { type: Number },
  max_live_time: { type: Number },
  minimumMinuts: { type: Number },
  liveSwitch: { type: Number, required: true, default: 0 },
  min_diamonds_charge_for_going_live: { type: Number },
  watch_ad_diamond: { type: Number },
  is_dating: { type: Number },
  max_live_private_time: { type: Number },
  fake_host_vidoe_from: { type: Number },
  max_fake_live_hosts: { type: Number },
  match_call_second: { type: Number },
  match_call_coin: { type: Number },
  _7_day_bonus: { type: Number },
  final_day_bonus: { type: Number },
 },
 {
  timestamps: true,
 }
);

const App = mongoose.model("App", appSchema);

module.exports = App;
