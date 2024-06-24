const express = require("express")
const router = express.Router();
const User = require("../models/user.models")
const Token = require("../models/token.models")
const crypto = require('crypto')
const passport = require("passport")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const preRegister = async (req, res) => {
    const { cpf, birthDate, name } = req.body

    try{
        let user = await  User.findOne({cpf});
        if(!user) {
            user = new User({cpf, birthDate, name})
            await user.save();
            console.log(user)

            const token = new Token({userId: user._id, token: crypto.randomBytes(16).toString('hex')});
            await token.save()

            return res.status(201).send({token: token.token})
        }
        res.status(409).send({message: "Usuário já está pré cadastrado"})
    } catch (error) {
        res.status(500).send({message: error.message})
    }
}

const register = async (req, res) => {
    const {cpf, email, password, birthDate, name} = req.body;
    try{
        let user = await User.findOne({cpf});
        if(user && user.isRegistered){
            return res.status(409).send({message: "Usuário já cadastrado"})
        }

        if(!user){
            user = new User({
                cpf: cpf,
                birthDate: birthDate,
                name: name
            })
        }

        user.email = email;
        user.password = await bcrypt.hash(password, 10);
        user.isRegistered = true;
        await user.save();

        const tokenRecord = await Token.findOne({ userId: user._id });
        if(!tokenRecord){
            const token = new Token({userId: user._id, token: crypto.randomBytes(16).toString('hex')});
            await token.save()
        }

        res.status(201).send({message: "Cadastro finalizado com sucesso"})
    }catch (error){
        res.status(500).send({message: error.message});
    }
}

const loginToken = async (req, res) => {
    const { token } = req.body;
    try {
        const tokenRecord = await Token.findOne({ token }).populate('userId');
        if (!tokenRecord) {
            return res.status(400).send({ message: 'Token inválido ou expirado.' });
        }

        console.log(tokenRecord)

        const jwtToken = jwt.sign({ userId: tokenRecord.userId._id, role: tokenRecord.userId.role, name: tokenRecord.userId.name }, process.env.JWT_SECRET, { expiresIn: '150h' });
        res.status(200).send({ token: jwtToken });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const loginCPF = async (req,res) => {
    const { cpf, password } = req.body;
    try {
        const user = await User.findOne({ cpf });
        if (!user || !user.isRegistered) {
            return res.status(400).send({ message: 'Usuário não encontrado ou não registrado.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Senha incorreta.' });
        }

        const jwtToken = jwt.sign({ userId: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '150hr' });
        res.status(200).send({ token: jwtToken });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


module.exports = {
    preRegister,
    register,
    loginToken,
    loginCPF,
}