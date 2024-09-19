import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import conexion from '../config/conexionDb.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Ruta para solicitar el restablecimiento de contraseña
router.post('/forgot-password', async (req, res) => {
    const { correo } = req.body;

    // Verificar si el email existe en la base de datos
    const checkUserQuery = 'SELECT * FROM usuarios WHERE correo = ?';
    conexion.query(checkUserQuery, [correo], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).send('Error en la base de datos');
        }

        if (results.length === 0) {
            return res.status(404).send('No existe una cuenta con ese correo electrónico.');
        }

        const user = results[0];

        // Generar un token de restablecimiento de contraseña
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // 1 hora de validez

        // Guardar el token y su expiración en la base de datos
        const updateUserQuery = 'UPDATE usuarios SET reset_token = ?, reset_token_expiration = ? WHERE correo = ?';
        conexion.query(updateUserQuery, [resetToken, resetTokenExpiration, correo], (error) => {
            if (error) {
                console.error('Error al actualizar el usuario:', error);
                return res.status(500).send('Error al procesar la solicitud');
            }

            // Construir el enlace de restablecimiento de contraseña
            const appUrl = process.env.APP_URL || 'http://localhost:3000';
            const resetUrl = `${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(correo)}`;
            console.log('Enlace de restablecimiento de contraseña:', resetUrl);

            // Enviar el correo de restablecimiento de contraseña
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: correo,
                subject: 'Restablece tu contraseña',
                text: `Hola ${user.nombre},\n\nHas solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla:\n\n${resetUrl}\n\nSi no solicitaste este restablecimiento, ignora este correo.\n\nSaludos,\nEl equipo de Style & Shop`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                    return res.status(500).send('Error al enviar el correo de restablecimiento.');
                }
                console.log('Correo de restablecimiento enviado: ' + info.response);
                res.send('Se ha enviado un correo con las instrucciones para restablecer tu contraseña.');
            });
        });
    });
});

// Ruta para restablecer la contraseña
router.post('/reset-password', async (req, res) => {
    const { token, email, newPassword } = req.body;

    // Verificar el token y su expiración en la base de datos
    const checkTokenQuery = 'SELECT * FROM usuarios WHERE reset_token = ? AND correo = ? AND reset_token_expiration > ?';
    conexion.query(checkTokenQuery, [token, email, Date.now()], async (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).send('Error en la base de datos');
        }

        if (results.length === 0) {
            return res.status(400).send('Token inválido o expirado.');
        }

        // Hash de la nueva contraseña
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 es el número de rondas de sal
            console.log('Contraseña nueva (encriptada):', hashedPassword);  // Mensaje de depuración

            // Actualizar la contraseña y eliminar el token de restablecimiento
            const updatePasswordQuery = 'UPDATE usuarios SET contrasena = ?, reset_token = NULL, reset_token_expiration = NULL WHERE correo = ?';
            conexion.query(updatePasswordQuery, [hashedPassword, email], (error) => {
                if (error) {
                    console.error('Error al actualizar la contraseña:', error);
                    return res.status(500).send('Error al procesar la solicitud');
                }

                res.send('Contraseña restablecida exitosamente.');
            });
        } catch (error) {
            console.error('Error al encriptar la contraseña:', error);
            return res.status(500).send('Error al procesar la solicitud');
        }
    });
});


export default router;
