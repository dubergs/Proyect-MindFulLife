import db from '../config/conexionDb.js';

// Agrega una nueva notificación a la base de datos para un usuario específico
export const addNotification = async (userId, content) => {
    try {
        console.log(`Intentando agregar notificación para el usuario ${userId}`);
        const query = 'INSERT INTO notificacion (id_usuario, contenido) VALUES (?, ?)';
        await db.query(query, [userId, content]);
        console.log(`Notificación agregada para el usuario ${userId}`);
    } catch (error) {
        console.error('Error al agregar la notificación:', error);  // Muestra cualquier error que ocurra
    }
};

// Verifica si el userId está presente en la sesión
export const getNotifications = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');  // Si no hay userId, redirige al login
    }

    const userId = req.session.userId;
    try {
        const query = 'SELECT * FROM notificacion WHERE id_usuario = ? ORDER BY fecha DESC';
        const [notifications] = await db.query(query, [userId]);
        res.render('notificacion', { notifications });
    } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
        res.status(500).send('Error al obtener notificaciones');
    }
};
