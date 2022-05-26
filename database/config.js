const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN_STRING);

        console.log('DB online');

    }catch(err){    
        console.log(err);
        throw Error('Error en la base de datos - Ver logs');
    }
}

module.exports = {
    dbConnection
}