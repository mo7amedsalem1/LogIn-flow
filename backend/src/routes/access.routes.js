const express = require("express");

const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
  getProfile,
  getAdminResource,
  getManagerResource,
} = require("../controllers/access.controller");

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.get("/admin", authenticate, authorize("ADMIN"), getAdminResource);
router.get(
  "/manager",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  getManagerResource,
);

module.exports = router;
