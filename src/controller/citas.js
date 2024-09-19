// Importar la conexión a la base de datos
import db from '../config/conexionDb.js'; // Ajusta la ruta si es necesario

// Método para guardar los datos del formulario en la base de datos
export const saveFormData = (req, res) => {
    const { nombre, documento, telefono, fecha_hora, sede_principal } = req.body;

    // Verificar que todos los campos están completos
    if (!nombre || !documento || !telefono || !fecha_hora || !sede_principal) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Consulta para insertar los datos
    const query = `INSERT INTO citas (nombre, documento, telefono, fecha_hora, sede) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [nombre, documento, telefono, fecha_hora, sede_principal], (err, result) => {
        if (err) {
            console.error('Error al guardar los datos: ', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.status(200).json({ message: 'Datos guardados correctamente' });
    });
};
