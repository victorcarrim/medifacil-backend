const Medicine = require("../models/medicine.models")

const getMedicines = async (req, res) => {
    const {nome_produto} = req.query
     if(!nome_produto) {
         return res.status(400).send({error: "Nome do produto é obrigatório"})
     }

     try {
        const medicines = await Medicine.find({
            nome_produto : {$regex: nome_produto, $options: 'i'}
        })
         if(!medicines){
             return res.status(204).send({message: "Nenhum medicamento encontrado"})
         }
         res.status(200).send(medicines)
     }catch (error){
         res.status(500).send({message: error.message})
     }
}

const getMedicineById = async (req, res) => {
    const {id} = req.params

    if(!id) {
        return res.status(400).send({error: "Id do produto é obrigatório"})
    }

    try {
        const medicine = await Medicine.findById(id)
        if(!medicine){
            return res.status(204).send({message: "Nenhum medicamento encontrado"})
        }
        res.status(200).send(medicine)
    }catch (error){
        res.status(500).send({message: error.message})
    }
}

const getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        if(!medicines){
            return res.status(204).send({message: "Nenhum medicamento encontrado"})
        }
        res.status(200).send(medicines)
    }catch (error){
        res.status(500).send({message: error.message})
    }
}

module.exports = {
    getMedicines,
    getMedicineById,
    getAllMedicines
}