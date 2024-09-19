import db from '../config/conexionDb.js';

const chatController = {
    // Obtener todos los mensajes
    getMessages: async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM mensajes ORDER BY timestamp ASC');
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
            res.status(500).json({ error: 'Error al obtener mensajes' });
        }
    },

    // Guardar un nuevo mensaje
    saveMessage: async (req, res) => {
        const { sender_id, receiver_id, content } = req.body; // Aquí uso req.body para recibir datos correctamente
        try {
            const [result] = await db.query(
                'INSERT INTO mensajes (id_remitente, id_receptor, mensaje) VALUES (?, ?, ?)',
                [sender_id, receiver_id, content]
            );
            res.status(200).json({ success: true, messageId: result.insertId });
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
            res.status(500).json({ error: 'Error al guardar el mensaje' });
        }
    },

    // Renderizar la vista del chat
    renderChatView: async (req, res) => {
        try {
            const [messages] = await db.query('SELECT * FROM mensajes ORDER BY timestamp ASC');
            res.render('chat', { messages });
        } catch (error) {
            console.error('Error al renderizar la vista del chat:', error);
            res.status(500).send('Error al cargar el chat');
        }
    }
};

export default chatController;
