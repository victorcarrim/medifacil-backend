const User = require("../models/user.models")
const bcrypt = require('bcrypt');

const initializeUser = async () => {
    const adminCpf = "00000000000"
    const profHealthCpf = "11111111111"
    try{
        const users = [
            { cpf: adminCpf, name: 'Admin', role: 'admin', password: '12345' },
            { cpf: profHealthCpf, name: 'Profissional da Saude', role: 'profhealth', password: '123456' }
        ];
        
        for (const userList of users) {
            let user = await User.findOne({ cpf: userList.cpf });
            if (user && user.isRegistered) {
                console.log(`Usuário ${userList.name} já cadastrado`);
            }

            if (!user) {
                user = new User({
                    cpf: userList.cpf,
                })
                user.name = userList.name;
                user.role = userList.role;
                user.password = await bcrypt.hash(userList.password, 10);
                user.isRegistered = true

                await user.save();
                console.log(`Usuário ${user.name} cadastrado com sucesso`)
            }       
        }

    }catch (error){
        console.log("Usuário admin cadastrado com sucesso" + error.message);
    }
}

module.exports = initializeUser