const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "4h"
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject("No se pudo generar el token");
            } else {
                resolve(token);
            }
        });
    });
};

const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la petición"
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        let usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido - usuario no existe en DB"
            });
        }
        if (usuario.estado === 'inactivo') {
            return res.status(401).json({
                msg: "Token no válido - usuario inactivo"
            });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        console.error('Error validando JWT:', error);
        return res.status(401).json({
            msg: "Token no válido"
        });
    }

};

module.exports = {
    generarJWT,
    validarJWT
};
