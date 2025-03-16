const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const conexion = require('../config/conexionDb.js');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Ruta de registro
router.post('/', async (req, res) => {
    const { nombre, apellido, genero, nacimiento, correo, contrasena } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !apellido || !genero || !nacimiento || !correo || !contrasena) {
        return res.status(400).send('Por favor complete todos los campos.');
    }


    // Validar el campo email
    if (!email.includes('@')) {
        return res.status(400).send('El email debe contener un "@"');
    }


    // Verificar si el nombre de usuario ya existe
    const checkUserQuery = 'SELECT * FROM usuario WHERE nombre = ?';
    conexion.query(checkUserQuery, [nombre], async (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).send('Error en la base de datos');
        }

        if (results.length > 0) {
            return res.status(400).send('El nombre de usuario ya existe');
        }

        try {
            // Encripta la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            console.log('Contraseña encriptada para guardar:', hashedPassword);

            // Generar un token de verificación único
            const verificationToken = crypto.randomBytes(32).toString('hex');

            // Insertar el nuevo usuario con todos los campos
            const insertUserQuery = 'INSERT INTO usuario (nombre, apellido, genero, nacimiento, correo, contrasena, verificado, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            conexion.query(insertUserQuery, [nombre, apellido, genero, nacimiento, correo, hashedPassword, false, verificationToken], (error) => {
                if (error) {
                    console.error('Error al registrar el usuario:', error);
                    return res.status(500).send('Error al registrar el usuario');
                }

                // Construir el enlace de verificación
                const appUrl = process.env.APP_URL || 'http://localhost:3000';
                const verifyUrl = `${appUrl}/verifyEmail?token=${verificationToken}`;
                console.log('Enlace de verificación:', verifyUrl);

                // Enviar el correo de verificación
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: correo,
                    subject: 'Verifica tu correo electrónico',
                    text: `Hola ${nombre},\n\nGracias por registrarte en Style & Shop. Por favor, verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:\n\n${verifyUrl}\n\nSaludos,\nEl equipo de Style & Shop`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error al enviar el correo:', error);
                        return res.status(500).send('Registro exitoso, pero hubo un problema al enviar el correo de verificación.');
                    }
                    console.log('Correo de verificación enviado: ' + info.response);
                });

                // Responder al cliente que el registro fue exitoso
                res.send('Registro exitoso. Por favor verifica tu correo electrónico.');
            });
        } catch (error) {
            console.error('Error al encriptar la contraseña:', error);
            return res.status(500).send('Error al procesar la solicitud');
        }
    });
});

module.exports = router;
