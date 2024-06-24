const mongoose = require('mongoose');
const { Schema } = mongoose;

const DoseHistorySchema = new Schema({
    dose_date: { type: Date, required: true },
    late: { type: Boolean, required: true, default: false }, // Indica se a dose foi tomada atrasada
    early: {type: Boolean, required: true, default: false} // Indica se a dose foi tomada adiantada
});

const MedicineUsageSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Adiciona um campo id
    medicine: { type: Schema.Types.ObjectId, ref: 'Medicamentos', required: true },
    usage_duration: { type: Number, required: true }, // Quantidade em dias de uso
    usage_interval: { type: String, required: true }, // Intervalo de uso ("X hours", "X days")
    treatment_start: { type: Date }, // Dia e horário do início do tratamento
    next_dose: { type: Date }, // Dia e horário da próxima tomada
    quantity: { type: String, required: true },
    dose_history: [DoseHistorySchema], // Array de dias e horários das tomadas com flag de atraso
    link_photo: { type: String }, // Link para foto do remédio
    new_photo: { type: String }, // Nova foto do remédio em base64
    total_doses: { type: Number }, // Total de doses calculadas
    remaining_doses: { type: Number }
});

const RecipeSchema = new Schema(
    {
        name: { type: String, required: true },
        data_expiration: { type: Date, required: true },
        medicines: [MedicineUsageSchema], // Array de medicamentos com opções adicionais
        pacient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        profhealth: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isComplete: { type: Boolean, default: false, required: true }
    },
    { timestamps: true }
);

// Função para calcular o número total de doses para cada medicamento no array
RecipeSchema.pre('save', function (next) {
    this.medicines = this.medicines.map(medicine => {
        const { usage_duration, usage_interval, treatment_start } = medicine;

        let intervalInMilliseconds;
        if (usage_interval.includes('hours')) {
            const hours = parseInt(usage_interval.split(' ')[0]);
            intervalInMilliseconds = hours * 60 * 60 * 1000;
        } else if (usage_interval.includes('days')) {
            const days = parseInt(usage_interval.split(' ')[0]);
            intervalInMilliseconds = days * 24 * 60 * 60 * 1000;
        } else {
            throw new Error('Invalid usage interval format');
        }

        const endDate = new Date(treatment_start);
        endDate.setDate(endDate.getDate() + usage_duration);

        const totalDoses = Math.floor((endDate - treatment_start) / intervalInMilliseconds);
        medicine.total_doses = totalDoses;
        medicine.remaining_doses = totalDoses;

        return medicine;
    });

    next();
});

module.exports = mongoose.model('Recipe', RecipeSchema);
