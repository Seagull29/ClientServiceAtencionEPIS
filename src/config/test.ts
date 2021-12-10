const axios = require("axios");
const FormDat = require("form-data");
const fs = require("fs");
const path = require("path");

const main = async () => {
    /*const form = new FormDat();
    form.append('id', 'saffdafsefa');
    form.append('nombre', 'adocuemnto.pdf');
    form.append('extension', 'application/pdf');
    form.append('archivo', fs.createReadStream(path.join(__dirname, '../../src/config/scoundrelDays.jpg')), 'scoundrelDays.jpg');
    form.append('solicitud', '1637443335152103bbccf-c4bd-492d-8e5d-e6e2f203716f0');



    //const length = await form.getLength();
    const response = await axios.post('http://localhost:5000/api/multimedia/add', form, {
        headers: {
            ...form.getHeaders()
        }
        
    });
    console.log(response.data);*/
    /*const response = await axios.get(`http://localhost:5000/api/multimedia`);
    const file = Buffer.from(response.data.data[0].Archivo.data);
    console.log(response.data.data[0]);
    fs.writeFileSync(response.data.data[0].Nombre, file);*/
   
    /*const carpetaPublica : string = path.join(__dirname, '../../src/public/uploads');
    fs.readdir(carpetaPublica, (erros, files) => {
        console.log(files);
    }); */

}

main();