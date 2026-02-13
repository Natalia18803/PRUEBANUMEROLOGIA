const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { login, register } = require('../controllers/authControllers');
const { validarEmail } = require('../helpers/usuario');

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/register', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty().trim(),
    check('email', 'El email no es válido').isEmail().normalizeEmail(),
    check('email').custom(validarEmail),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty().isISO8601().toDate(),
    validarCampos
], register);

module.exports = router;
