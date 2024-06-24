const User = require("../models/user.models")

const getUsers = async (req, res) => {
    try {
        let user = await User.find({});
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({message: error.message})
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        let user = await User.findById(id);
        if(!user) {
            return res.status(404).send({message: "Usuário não encontrado."})
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({message: error.message})
    }
}

const getUserAdmin = async (req, res) => {
    try {
        let user = await User.find({role: "admin"});
        if(!user){
            res.status(404).send("Nenhum usuário encontrado");
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({message: error.message})
    }
};

const getUserProfHealth = async (req, res) => {
    try {
        let user = await User.find({role: "profhealth"});
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({message: error.message})
    }
};

const changeRoleAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        let user = await User.findByIdAndUpdate(id, { role: "admin" }, { new: true });
        if(!user || !user.isRegistered) {
            return res.status(404).send({message: "Usuário não encontrado."})
        }
        res.status(200).send({message: "Usuário promovido a administrador."})
    } catch (error) {
        res.status(500).send({message: error.message})
    }
};

const changeRoleProfHealth = async (req, res) => {
    const { id } = req.params;
    try {
        let user = await User.findByIdAndUpdate(id, { role: "profhealth" }, { new: true });
        if(!user || !user.isRegistered) {
            return res.status(404).send({message: "Usuário não encontrado."})
        }
        res.status(200).send({message: "Usuário promovido a profissional da saúde."})

    } catch (error) {
        res.status(500).send({message: error.message})
    }
};

const changeRoleClient = async (req, res) => {
    const { id } = req.params;
    try {
        let user = await User.findByIdAndUpdate(id, { role: "client" }, { new: true });
        if(!user || !user.isRegistered) {
            return res.status(404).send({message: "Usuário não encontrado."})
        }
        res.status(200).send({message: "Usuário promovido a cliente."})

    } catch (error) {
        res.status(500).send({message: error.message})
    }
};

const deactivateUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        let deactivatedUser = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if(!deactivatedUser || !deactivatedUser.isRegistered) {
            return res.status(404).send({message: "Usuário não encontrado."})
        }
        res.status(200).send({message: "Usuário desativado."})
    } catch (error) {
        res.status(500).send({message: error.message})
    }
};

const reactivateUser = async (req, res) => {
    const { cpf } = req.params;
    try {
        let reactivateUser = await User.findOneAndUpdate({cpf}, { isActive: true }, { new: true });
        if(!reactivateUser || !reactivateUser.isRegistered) {
            return res.status(404).send({message: "Usuário não encontrado."})
        }
        res.status(200).send({message: "Usuário reativado."})
    } catch (error) {
        res.status(500).send({message: error.message})
    }
}

module.exports = {
    getUsers,
    getUserById,
    getUserAdmin,
    getUserProfHealth,
    changeRoleAdmin,
    changeRoleProfHealth,
    changeRoleClient,
    deactivateUser,
    reactivateUser
}
