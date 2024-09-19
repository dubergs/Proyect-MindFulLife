// src/controller/evaluacion.js
import db from '../config/conexionDb.js'; // Asegúrate de tener una configuración de base de datos adecuada

export async function guardarEvaluacion(req, res) {
    const { ansiedad, depresion, tratamiento_profesional, actividad_fisica, calidad_sueno } = req.body;
    const userId = req.session.userId;

    try {
        // Guardar la evaluación en la base de datos
        await db.query('INSERT INTO evaluacion (id_usuario, ansiedad, depresion, tratamiento_profesional, actividad_fisica, calidad_sueno) VALUES (?, ?, ?, ?, ?, ?)', [userId, ansiedad, depresion, tratamiento_profesional, actividad_fisica, calidad_sueno]);

        // Actualizar el estado de la evaluación en la tabla de usuarios
        await db.query('UPDATE usuarios SET evaluacion_realizada = ? WHERE id = ?', [true, userId]);

        // Redirigir al perfil del usuario o a una página de confirmación
        res.redirect('/perfil');
    } catch (error) {
        console.error('Error al guardar la evaluación:', error);
        res.status(500).send('Error al guardar la evaluación');
    }
}

export async function obtenerPerfil(req, res) {
    const userId = req.session.userId;

    try {
        const [usuarioResults] = await db.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
        const [evaluacionResults] = await db.query('SELECT * FROM evaluacion WHERE id_usuario = ?', [userId]);

        const evaluacionRealizada = evaluacionResults.length > 0;
        const usuario = usuarioResults[0];
        const evaluacion = evaluacionResults[0]; // Asegúrate de obtener el primer elemento

        res.render('perfil', {
            usuario,
            evaluacion,
            evaluacionRealizada,
        });
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        res.status(500).send('Error al obtener el perfil');
    }
}



