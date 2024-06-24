const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const Medicine = require('./models/medicine.models');

mongoose
    .connect(
        //" INSIRA SUA URL DO MONGODB NESSES PARENTESES "
    )
    .then(() => {
        console.log("Connected to MongoDB");
        const results = [];

        fs.createReadStream(path.join(__dirname, 'medicamentos.csv'))
            .pipe(iconv.decodeStream('utf-8'))
            .pipe(csv({
                separator: ';', // Especificar o separador como ponto e vírgula
                mapHeaders: ({ header }) => header.trim().toLowerCase().replace(/ /g, '_') // Mapear os headers
            }))
            .on('data', (data) => {
                // Tratamento das datas
                data.data_finalizacao_processo = parseDate(data.data_finalizacao_processo);
                data.data_vencimento_registro = parseDate(data.data_vencimento_registro);

                // Adicionar ao results somente se a situação for "VÁLIDO"
                if (data.situacao_registro === 'V�LIDO') {
                    results.push(data);
                }
            })
            .on('end', () => {
                console.log(`Finished reading CSV. Number of valid records: ${results.length}`);
                if (results.length > 0) {
                    // Salvar todos os dados no MongoDB
                    Medicine.insertMany(results)
                        .then(() => {
                            console.log('Data imported successfully!');
                            mongoose.connection.close();
                        })
                        .catch((err) => {
                            console.error('Error importing data:', err);
                            mongoose.connection.close();
                        });
                } else {
                    console.log('No valid data to import.');
                    mongoose.connection.close();
                }
            });
    })
    .catch((err) => {
        console.log("Error: ", err);
    });

function parseDate(dateStr) {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
}
