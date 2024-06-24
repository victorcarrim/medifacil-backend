const express = require("express")
const router = express.Router();
const user = require("./user.routes")
const medicine = require("./medicine.routes")
const recipe = require("./recipe.routes")
const pdf = require("./pdf.routes")
const {checkRole} = require("../utils/checkRole");

router.use("/medicine", checkRole("profhealth"), medicine)

router.use("/pdf", pdf)

router.use("/user", user)

router.use("/recipe", recipe)

module.exports = router;