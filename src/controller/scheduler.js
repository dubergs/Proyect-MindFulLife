import db from '../config/conexionDb.js';
import { addNotification } from '../controller/notification.js'; // Asegúrate de que esté en la ruta correcta

// Función para obtener todos los usuarios de la base de datos
const getUsers = async () => {
    try {
        const [rows] = await db.query('SELECT id, nombre FROM usuarios');
        return rows;  // Devuelve los usuarios
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
};

// Función para programar notificaciones
const scheduleNotification = async () => {
    try {
        const users = await getUsers();  // Obtén todos los usuarios
        if (users.length === 0) {
            console.log('No se encontraron usuarios para enviar notificaciones.');
            return;
        }

        // Para cada usuario, envía una notificación
        users.forEach(async user => {
            const notificationContent = `Notificación diaria para ${user.nombre}`;
            await addNotification(user.id, notificationContent);  // Inserta la notificación
            console.log(`Notificación programada para el usuario: ${user.nombre}`);
        });
    } catch (error) {
        console.error('Error al programar notificaciones:', error);
    }
};

// Programa la función para que se ejecute diariamente a la misma hora (por ejemplo, a las 9:00 am)
import cron from 'node-cron';
cron.schedule('0 9 * * *', () => {
    console.log('Ejecutando cron para enviar notificaciones diarias...');
    scheduleNotification();
});
