const express = require("express")
const router = express.Router();
const { getUsers, getUserById, getUserAdmin, getUserProfHealth, changeRoleAdmin, changeRoleProfHealth, deactivateUser, reactivateUser, changeRoleClient } = require("../controller/user.controller")
const {checkRole} = require("../utils/checkRole")

router.get("/",  checkRole('profhealth'), getUsers,);
router.get("/admin", checkRole('admin'), getUserAdmin);
router.get("/profHealth", checkRole('profhealth'), getUserProfHealth);
router.put("/changeRoleAdmin/:id", checkRole('admin'), changeRoleAdmin);
router.put("/changeRoleProfHealth/:id", checkRole('profhealth'), changeRoleProfHealth);
router.put("/changeRoleClient/:id", checkRole('admin'), changeRoleClient);
router.put("/deactivate/:id", checkRole(['client', 'profhealth']), deactivateUser);
router.put("/reactivate/:cpf", checkRole('profhealth'), reactivateUser);
router.get("/:id", getUserById);

module.exports = router;