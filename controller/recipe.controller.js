const Recipe = require("../models/recipe.models")
const Medicine = require("../models/medicine.models")
const User = require("../models/user.models");

const registerRecipe = async (req, res) => {
    const {
        name, data_expiration, medicines, pacient,
    } = req.body
    const profhealth = req.user._id

    if(!name || !data_expiration || !medicines){
        return res.status(400).send("Todos os campos devem estar preenchidos")
    }

    try {
        for (const medicine of medicines) {
            const medicamentoExists = await Medicine.findById(medicine.medicine);
            if (!medicamentoExists) {
                return res.status(400).send(`Medicamento com ID ${medicine.medicine} não encontrado`);
            }
            const usageDurationInHours = medicine.usage_duration * 24; // duração em dias convertida para horas
            let usageIntervalInHours;
            const [intervalValue, intervalUnit] = medicine.usage_interval.split(' ');

            if (intervalUnit === 'hours') {
                usageIntervalInHours = parseInt(intervalValue, 10);
            } else if (intervalUnit === 'days') {
                usageIntervalInHours = parseInt(intervalValue, 10) * 24;
            } else {
                return res.status(400).send(`Intervalo de uso inválido: ${medicine.usage_interval}`);
            }

            medicine.remaining_doses = Math.floor(usageDurationInHours / usageIntervalInHours);
        }
        const newRecipe = new Recipe({
            name,
            data_expiration,
            medicines,
            pacient,
            profhealth
        })
        await newRecipe.save();
        res.status(201).send(newRecipe);
    }catch (error){
        res.status(500).send({message: error.message})
    }
}

const getRecipeById = async (req,res) => {
    const {id} = req.params
    const userId = req.user._id
    try {
        const recipe = await Recipe.findOne({
            _id: id,
            $or: [
                {pacient: userId},
                {profhealth: userId}
            ]
        }).populate("medicines.medicine")

        res.status(200).send(recipe)
    }catch (error){
        res.status(500).send({message: error.message})
    }
}

const getRecipeByUserId = async (req,res) => {
    const {id} = req.params
    try {
        const recipe = await Recipe.find({
            pacient : id,
        }).populate("medicines.medicine")

        res.status(200).send(recipe)
    }catch (error){
        res.status(500).send({message: error.message})
    }
}

const getAllRecipes = async (req,res) => {
    const userId = req.user._id;

    try {
        const recipes = await Recipe.find({
            $or: [
                {pacient: userId},
                {profhealth: userId}
            ]
        }).populate("medicines.medicine");
        res.status(200).send(recipes);
    }catch (error){
        res.status(500).send({message: error.message})
    }
}

const startTreatment = async (req, res) => {
    const { recipe_id, medicine_id, treatment_start } = req.body;
    const userId = req.user._id;
    let next_dose;
    const dateServidor = new Date()
    const dataTratamento = new Date(treatment_start)
    console.log("Data Servidor", dateServidor)
    console.log("Data Tratamento", dataTratamento)
    console.log ("Data Servidor String", new Date().toDateString(), "Data tratamento Strinf", new Date(treatment_start).toDateString())


    if (!recipe_id || !medicine_id) {
        return res.status(400).send({ message: "ID Receita e ID Medicamento devem ser enviados" });
    }

    try {
        let recipe = await Recipe.findOne({
            _id: recipe_id,
            $or: [
                { pacient: userId },
            ]
        }).populate("medicines.medicine");

        if (!recipe) {
            return res.status(400).send({ message: "Receita não encontrada ou não autorizada" });
        }

        const medicine = recipe.medicines.find(medicine => medicine._id == medicine_id);

        if (!medicine) {
            return res.status(400).send({ message: "Medicamento não encontrado na receita" });
        }

        if (medicine.remaining_doses === 0 || recipe.isComplete === true) {
            return res.status(400).send({ message: "Tratamento já finalizado" });
        }

        if (medicine.usage_interval.includes('hours')) {
            const hours = parseInt(medicine.usage_interval.split(' ')[0]);
            next_dose = new Date(new Date(treatment_start).setHours(new Date(treatment_start).getHours() + hours));
        }
        if (medicine.usage_interval.includes('days')) {
            const days = parseInt(medicine.usage_interval.split(' ')[0]);
            next_dose = new Date(new Date(treatment_start).setDate(new Date(treatment_start).getDate() + days));
        }

        const remaining_doses = medicine.remaining_doses - 1;

        await Recipe.updateOne(
            { _id: recipe_id, 'medicines._id': medicine_id },
            {
                $set: {
                    'medicines.$.treatment_start': new Date(treatment_start),
                    'medicines.$.next_dose': next_dose,
                    'medicines.$.remaining_doses': remaining_doses
                },
                $push: {
                    'medicines.$.dose_history': {
                        dose_date: new Date(treatment_start),
                        late: false
                    }
                }
            }
        );

        res.status(200).send({ message: "Tratamento iniciado com sucesso" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const registerDose = async (req,res) => {
    try {
        const { recipe_id, medicine_id, dose_date } = req.body;
        const userId = req.user._id;
        let next_dose;
        let early = false;
        let late = false;
        let complete = true;

        if (!recipe_id || !medicine_id || !dose_date) {
            return res.status(400).send({ message: "ID Receita e ID Medicamento e data da dose devem ser enviados" });
        }
        let recipe = await Recipe.findOne({
            _id: recipe_id,
            $or: [
                { pacient: userId },
            ]
        }).populate("medicines.medicine");

        if (!recipe) {
            return res.status(400).send({ message: "Receita não encontrada ou não autorizada" });
        }
        const medicine = recipe.medicines.find(medicine => medicine._id == medicine_id);

        if (!medicine) {
            return res.status(400).send({ message: "Medicamento não encontrado na receita" });
        }

        if (medicine.remaining_doses === 0 || recipe.isComplete === true) {
            return res.status(400).send({ message: "Tratamento já finalizado" });
        }

        if(new Date(dose_date) < new Date(medicine.next_dose)){
            early = true
        }

        if (medicine.usage_interval.includes('hours')) {
            const hours = parseInt(medicine.usage_interval.split(' ')[0]);
            next_dose = new Date(new Date(dose_date).setHours(new Date(dose_date).getHours() + hours));
            const delay = (new Date(dose_date) - new Date(medicine.next_dose)) / 1000 / 60; // Calcula o atraso em minutos
            if (delay > 5) {
                late = true;
            }
        }
        if (medicine.usage_interval.includes('days')) {
            const days = parseInt(medicine.usage_interval.split(' ')[0]);
            next_dose = new Date(new Date(dose_date).setDate(new Date(dose_date).getDate() + days));
            if(new Date(dose_date).getDay() > new Date(medicine.next_dose).getDay()){
                late = true
            }
        }

        const remaining_doses = medicine.remaining_doses - 1;


        for (const med of recipe.medicines) {
            if (med._id == medicine._id) {
                if (remaining_doses > 0) {
                    complete = false;
                    break;
                }
            } else if (med.remaining_doses > 0) {
                complete = false;
                break;
            }
        }



        recipe = await Recipe.findOneAndUpdate(
            { _id: recipe_id, 'medicines._id': medicine_id },
            {
                $set: {
                    'medicines.$.next_dose': next_dose,
                    'medicines.$.remaining_doses': remaining_doses,
                    isComplete: complete
                },
                $push: {
                    'medicines.$.dose_history': {
                        dose_date: new Date(dose_date),
                        late: late,
                        early: early
                    }
                }
            }, { new: true }
        );

        if(complete){
            return res.status(200).send(recipe)
        }

        res.status(200).send({message: "Dose registrada"})
    }catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const updateImage = async (req,res) => {
    try {
        const { recipe_id, medicine_id, image } = req.body;
        const userId = req.user._id;

        if (!recipe_id || !medicine_id ||!image) {
            return res.status(400).send({ message: "ID Receita e Foto e data da dose devem ser enviados" });
        }

        let recipe = await Recipe.findOne({
            _id: recipe_id,
            $or: [
                { pacient: userId },
            ]
        }).populate("medicines.medicine");

        if (!recipe) {
            return res.status(400).send({ message: "Receita não encontrada ou não autorizada" });
        }


        recipe = await Recipe.findOneAndUpdate(
            { _id: recipe_id, 'medicines._id': medicine_id },
            {
                $set: {
                    'medicines.$.new_photo': image,
                },
            }, { new: true }
        );

        res.status(200).send({message: "Foto registrada"})
    }catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = {
    registerRecipe,
    getRecipeById,
    getRecipeByUserId,
    getAllRecipes,
    startTreatment,
    registerDose,
    updateImage
}