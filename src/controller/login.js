const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const conexion = require('../config/conexionDb.js');

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { Email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!Email || !password) {
        return res.status(400).send('Por favor complete todos los campos.');
    }

    // Verificar si el nombre de usuario o el correo electrónico existen
    const checkUserQuery = 'SELECT * FROM usuario WHERE  correo = ?';
    conexion.query(checkUserQuery, [Email, Email], async (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).send('Error en la base de datos');
        }

        if (results.length === 0) {
            return res.status(401).send('Nombre de usuario, correo electrónico o contraseña incorrectos.');
        }

        const user = results[0];

        // Verificar si el correo electrónico ha sido verificado
        if (!user.verificado) {
            return res.status(403).send('El correo electrónico no ha sido verificado. Por favor, revisa tu correo para confirmar tu dirección.');
        }

        // Comparar la contraseña proporcionada con la almacenada
        try {
            const match = await bcrypt.compare(password, user.contraseña);

            if (!match) {
                return res.status(401).send('Nombre de usuario, correo electrónico o contraseña incorrectos.');
            }

            // Si la contraseña es correcta, puedes generar un token de sesión o JWT
            // Aquí simplemente retornamos un mensaje de éxito
            res.send('Inicio de sesión exitoso!');
        } catch (error) {
            console.error('Error al comparar contraseñas:', error);
            return res.status(500).send('Error al procesar la solicitud');
        }
    });
});

module.exports = router;
