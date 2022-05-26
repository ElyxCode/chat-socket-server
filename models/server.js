// Servidor express
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const Sockets = require('./sockets');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        // Conectar DB.
        dbConnection();

        // http server.
        this.server = http.createServer(this.app);

        // Configuracion del socket server.
        this.io = socketIo(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
    }

    middlewares() {
        // Desplegar el directorio público.
       this.app.use(express.static(path.resolve(__dirname + '../../public')));

       // CORS
       this.app.use(cors());

       // Parseo del body
       this.app.use(express.json());

       // API Endpoints
       this.app.use('/api/login', require('../router/auth'));
       this.app.use('/api/message', require('../router/message'));
    }

    // Configuración de sockets.
    socketConfig(){ 
        new Sockets(this.io);
    }

    // Ejecutar el servidor.
    execute(){
        // inicializar middlewares.
        this.middlewares();
        
        // incializar sockets
        this.socketConfig();
        // Inicializar server.
        this.server.listen(this.port, () => {
            console.log('Servidor ejecutando en el puerto:', this.port);
        });
    }
}

module.exports = Server;