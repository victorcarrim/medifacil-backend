const express = require("express")
const router = express.Router();
const { getMedicines, getMedicineById, getAllMedicines } = require("../controller/medicine.controller")

router.get("/get-medicines-by-name", getMedicines)

router.get("/list-all", getAllMedicines)

router.get("/:id", getMedicineById)



module.exports = router