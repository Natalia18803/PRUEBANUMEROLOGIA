const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../middlewares/validar-jwt');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos"
            });
        }
        if (usuario.estado === 'inactivo') {
            return res.status(400).json({
                msg: "Usuario inactivo"
            });
        }
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos"
            });
        }
        const token = await generarJWT(usuario.id);
        return res.json({
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                estado: usuario.estado
            },
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            msg: "Hable con el administrador"
        });
    }
};

const register = async (req, res) => {
    const { nombre, email, password, fecha_nacimiento } = req.body;
    try {
        const usuario = new Usuario({ 
            nombre, 
            email, 
            password, 
            fecha_nacimiento 
        });
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);
        await usuario.save();
        const token = await generarJWT(usuario.id);
        return res.status(201).json({
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                estado: usuario.estado
            },
            token,
            message: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({ 
            error: error.message 
        });
    }
};

module.exports = {
    login,
    register
};
