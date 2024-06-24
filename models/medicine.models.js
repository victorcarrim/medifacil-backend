const mongoose = require('mongoose');

const MedicamentosSchema = new mongoose.Schema({
    tipo_produto: { type: String },
    nome_produto: { type: String },
    data_finalizacao_processo: { type: Date },
    categoria_regulatoria: { type: String },
    numero_registro_produto: { type: String },
    data_vencimento_registro: { type: Date },
    numero_processo: { type: String },
    classe_terapeutica: { type: String },
    empresa_detentora_registro: { type: String },
    situacao_registro: { type: String },
    principio_ativo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Medicamentos', MedicamentosSchema);
