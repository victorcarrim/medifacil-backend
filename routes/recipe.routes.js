const express = require("express")
const router = express.Router();
const { registerRecipe, getRecipeById, getAllRecipes, startTreatment, registerDose, getRecipeByUserId, updateImage} = require("../controller/recipe.controller");
const { checkRole } = require("../utils/checkRole")

router.post("/register-recipe", checkRole("profhealth"), registerRecipe);

router.get("/get-recipes", getAllRecipes);

router.get("/get-recipe/:id", getRecipeById);

router.get("/get-user-recipe/:id", getRecipeByUserId);

router.put("/start-treatment", startTreatment);

router.put("/update-treatment", registerDose)

router.put("/update-image", updateImage)

module.exports = router;