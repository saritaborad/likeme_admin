const express = require("express");
const router = express.Router();
const { fetchAllagent, addAgent, editAgent, deleteAgent, fetchAgents, fetchAgentById } = require("../controllers/Agent");
const { uploadImage } = require("../middleware/upload");
const { getAgentHosts, fetchAllStreamHistory, fetchStreamHistoryDayWise, fetchAllHostHistory, fetchHostSummary } = require("../controllers/AgentHost");

router.post("/fetchAllagent", fetchAllagent);
router.post("/addAgent", addAgent);
router.post("/editAgent", uploadImage.single("images"), editAgent);
router.post("/deleteAgent", deleteAgent);
router.post("/fetchAgents", fetchAgents);
router.post("/fetchAgentById", fetchAgentById);

router.post("/getAgentHosts", getAgentHosts);
router.post("/fetchAllStreamHistory", fetchAllStreamHistory);
router.post("/fetchStreamHistoryDayWise", fetchStreamHistoryDayWise);
router.post("/fetchAllHostHistory", fetchAllHostHistory);
router.post("/fetchHostSummary", fetchHostSummary);

module.exports = router;
