const { response } = require("express");
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require("../helpers/jwt");

const createUser = async(req, res = response) => {

    try{

        const { email, password } = req.body;

        // Verificar el email no exista.
        const existEmail = await User.findOne({ email })

        if(existEmail){
            return res.status(400).json({
                ok: false,
                msg: 'The email already exists'

            })
        }

        const user = new User(req.body)
        
        // Encriptar contraseñá
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
       
        // Guardar en base de datos.
        await user.save();
        
        // Generar json web token
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: 'Contact administrator'
        })
    }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si existe el correo.
        const userDB = await User.findOne({ email });

        if(!userDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email not found' // Usar este mensaje en lago real 'Email or password incorrect'
            }) 
        }

        // Validar password
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if(!validPassword){
            return res.status(404).json({
                ok: false,
                msg:'Password incorrect' // Usar este mensaje en lago real 'Email or password incorrect'
            })
        }

        // Generar JWT
        const token = await generateJWT(userDB.id);

        res.json({
            ok: true,
            user: userDB,
            token
        })
        

    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: 'Contact administrator'
        })
    }
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar un nuevo jwt.
    const token = await generateJWT(uid);

    // Obtener usuario por uid.
    const user = await User.findById(uid);

    res.json({
        ok: true,
        user,
        token
    });
}

module.exports = {
    createUser,
    login,
    renewToken
}