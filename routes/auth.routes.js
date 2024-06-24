const express = require("express")
const router = express.Router();
const { preRegister, register, loginToken, loginCPF } = require("../controller/auth.controller")

// #swagger.tags = ['Autorização']
// #swagger.description = 'Pré-registar um usuário'
router.post('/pre-register', preRegister);

// #swagger.tags = ['Autorização']
// #swagger.description = 'Registrar um usuário'
router.post("/register", register);

// #swagger.tags = ['Autorização']
// #swagger.description = 'Login por token'
router.post("/login-token", loginToken);

// #swagger.tags = ['Autorização']
// #swagger.description = 'Login pelo cpf'
router.post("/login-cpf", loginCPF);

module.exports = router;