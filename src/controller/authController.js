import db from '../config/conexionDb.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Registro de usuario
export const registerUser = async (req, res) => {
  console.log(req.body);
  const { nombre, apellido, genero, fecha_nacimiento, correo, contrasena, confirmarContrasena } = req.body;

  // Validaciones
  if (!nombre || !apellido || !genero || !fecha_nacimiento || !correo || !contrasena || !confirmarContrasena) {
    return res.render('register', { error: 'Todos los campos son obligatorios.' });
  }
  if (contrasena !== confirmarContrasena) {
    return res.render('register', { error: 'Las contraseñas no coinciden.' });
  }

  // Cifrar la contraseña
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  // Insertar el nuevo usuario en la base de datos
  try {
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, apellido, genero, fecha_nacimiento, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellido, genero, fecha_nacimiento, correo, hashedPassword]
    );

    // Comprobar si la inserción fue exitosa
    if (result.affectedRows > 0) {
      res.redirect('/');
    } else {
      res.render('register', { error: 'Error al registrar el usuario.' });
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error.message); // Loguear el error
    res.render('register', { error: 'Error al registrar el usuario.' });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  // Validaciones
  if (!correo || !contrasena) {
    return res.render('login', { error: 'Todos los campos son obligatorios.' });
  }

  // Comprobar si el usuario existe
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.render('login', { error: 'Usuario no encontrado.' });
    }

    // Verificar la contraseña
    const user = rows[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.render('login', { error: 'Contraseña incorrecta.' });
    }

    // Guardar los datos del usuario en la sesión
    req.session.userId = user.id;
    req.session.usuario = {
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      fecha_nacimiento: user.fecha_nacimiento,
      genero: user.genero
    };
    res.redirect('/index');  // Redirigir a la página de inicio o dashboard

  } catch (error) {
    console.error('Error al iniciar sesión:', error.message); // Loguear el error
    res.render('login', { error: 'Error al iniciar sesión.' });
  }
};



// Cierre de sesión
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error al destruir la sesión:', err);
          return res.status(500).send('Error al cerrar sesión');
      }
      res.redirect('/index');
  });
};





dotenv.config();

// Configuración de Nodemailer para Hotmail
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
  }
});

// Método para solicitar el restablecimiento de contraseña
export const forgotPassword = async (req, res) => {
  console.log('forgotPassword controlador llamado');
  const { correo1 } = req.body;

  // Verificar si el email existe en la base de datos
  const checkUserQuery = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(checkUserQuery, [correo1], (error, results) => {
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
      db.query(updateUserQuery, [resetToken, resetTokenExpiration, correo1], (error) => {
          if (error) {
              console.error('Error al actualizar el usuario:', error);
              return res.status(500).send('Error al procesar la solicitud');
          }

          // Construir el enlace de restablecimiento de contraseña
          const appUrl = process.env.APP_URL || 'http://localhost:3000';
          const resetUrl = `${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(correo1)}`;
          console.log('Enlace de restablecimiento de contraseña:', resetUrl);

          // Enviar el correo de restablecimiento de contraseña
          const mailOptions = {
              from: process.env.EMAIL_USER,
              to: correo1,
              subject: 'Restablece tu contraseña',
              text: `Hola ${user.nombre},\n\nHas solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla:\n\n${resetUrl}\n\nSi no solicitaste este restablecimiento, ignora este correo.\n\nSaludos,\nEl equipo de MindFulLife`
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
};

// Método para restablecer la contraseña
export const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  // Verificar el token y su expiración en la base de datos
  const checkTokenQuery = 'SELECT * FROM usuarios WHERE reset_token = ? AND correo = ? AND reset_token_expiration > ?';
  db.query(checkTokenQuery, [token, email, Date.now()], async (error, results) => {
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
          const updatePasswordQuery = 'UPDATE usuarios SET contraseña = ?, reset_token = NULL, reset_token_expiration = NULL WHERE correo = ?';
          db.query(updatePasswordQuery, [hashedPassword, email], (error) => {
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
};
