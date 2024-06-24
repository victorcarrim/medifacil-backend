const Recipe = require("../models/recipe.models");
const Medicine = require("../models/medicine.models");
const User = require("../models/user.models");
const Token = require("../models/token.models");
const moment = require('moment');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generatePdf = async (req, res) => {
    const { id } = req.params;
    let qrCodeDataURL = null
    try {
        const recipe = await Recipe.findById(id)
            .populate('medicines.medicine')
            .populate('pacient')
            .populate('profhealth')
            .exec();

        if (!recipe) {
            return res.status(404).send('Receita não encontrada');
        }

        const token = await Token.findOne({ userId: recipe.pacient._id }).exec();
        if(token){
            qrCodeDataURL = await QRCode.toDataURL(token.token);
        }


        const createdAt = moment(recipe.createdAt).format('DD/MM/YYYY HH:mm:ss');

        // Inicializa o documento PDF
        const doc = new PDFDocument();

        // Configura os headers da resposta para o PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=receita-${recipe.name}.pdf`);

        // Pipe o PDF para a resposta HTTP
        doc.pipe(res);

        // Conteúdo do PDF
        doc.fontSize(20).text(recipe.name, { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Paciente: ${recipe.pacient.name}`);
        doc.text(`Profissional de Saúde: ${recipe.profhealth.name}`);
        doc.moveDown();
        doc.text('Medicamentos:', { underline: true });
        recipe.medicines.forEach(med => {
            doc.moveDown();
            doc.fontSize(14).text(`Medicamento: ${med.medicine.nome_produto}`);
            doc.text(`Fabricante: ${med.medicine.empresa_detentora_registro}`);
            doc.text(`Quantidade: ${med.quantity}`);
            doc.text(`Intervalo: ${med.usage_interval}`);
            doc.text(`Duração do Uso: ${med.usage_duration} dias`);
        });
        doc.moveDown();
        doc.fontSize(12).text(`Data: ${createdAt}`);

        // Adiciona o QR Code
        doc.moveDown();
        if(qrCodeDataURL){
            doc.fontSize(16).text('QR Code para login no Aplicativo', { align: 'center' });
            doc.image(qrCodeDataURL, { fit: [150, 150], align: 'center' });
        }
        // Finaliza o documento
        doc.end();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    generatePdf
};
