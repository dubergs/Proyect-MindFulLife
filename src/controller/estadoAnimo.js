import db  from '../config/conexionDb.js'; // Asegúrate de tener configurada tu conexión a la base de datos

export const saveMood = async (req, res) => {
    const { mood, comment } = req.body;
    const userId = req.session.userId; // Asegúrate de que tienes la ID del usuario en la sesión

    if (!userId) {
        return res.status(401).json({ error: 'No autorizado, Inicia sesion o registrate' });
    }

    try {
        const query = 'INSERT INTO estadoAnimo (id_usuario, estado, comentario) VALUES (?, ?, ?)';
        const values = [userId, mood, comment, new Date()];
        await db.query(query, values);
        res.status(200).json({ message: 'Estado de ánimo guardado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el estado de ánimo' });
    }
};


export const getMoodHistory = async (req, res) => {
    const userId = req.session.userId; // Asegúrate de que tienes la ID del usuario en la sesión

    if (!userId) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    try {
        const query = 'SELECT fecha, estado, comentario FROM estadoAnimo WHERE id_usuario = ? ORDER BY fecha DESC';
        const [rows] = await db.query(query, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial' });
    }
};

