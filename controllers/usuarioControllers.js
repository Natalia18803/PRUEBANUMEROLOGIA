const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    return res.json({usuarios});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, fecha_nacimiento } = req.body;
    const usuario = new Usuario({ nombre, email, password, fecha_nacimiento });
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    await usuario.save();
    return res.status(201).json({ id: usuario._id, message: 'Usuario creado' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



exports.updateUsuario = async (req, res) => {
  try {
    const { nombre, email, password, fecha_nacimiento } = req.body;
    const updateData = { nombre, email, fecha_nacimiento };
    if (password) {
      const salt = bcryptjs.genSaltSync();
      updateData.password = bcryptjs.hashSync(password, salt);
    }
    await Usuario.findByIdAndUpdate(req.params.id, updateData);
    return res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



exports.updateEstadoUsuario = async (req, res) => {
  try {
    const { estado } = req.body;
    await Usuario.findByIdAndUpdate(req.params.id, { estado });
    return res.json({ message: 'Estado actualizado' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.deleteUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
