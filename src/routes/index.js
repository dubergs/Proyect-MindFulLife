import {Router} from 'express';
import { registerUser, loginUser, logoutUser } from '../controller/authController.js';
import  {getNotifications}  from '../controller/notification.js';
import chatController from '../controller/chat.js';
import { saveFormData } from '../controller/citas.js';
import { guardarEvaluacion, obtenerPerfil } from '../controller/evaluacion.js';
import { saveMood, getMoodHistory } from '../controller/estadoAnimo.js';
import { isAuthenticated } from '../index.js';
import passwordResetRoutes from '../controller/passwordReset.js';

const router = Router();

router.get('/index', (req, res) => {
    res.render('index', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/index', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

  router.get('/about', (req, res) => {
    res.render('about', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
});
  router.post('/about', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
});

router.get('/contact', (req, res) => {
    res.render('contact', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/contact', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

router.get('/recuperaPass', (req, res) => {
    res.render('recuperaPass'); // Renderiza la vista EJS
});

router.get('/register', (req, res) => {
    res.render('register'); // Renderiza la vista EJS
});
router.post('/register', registerUser);

router.get('/', (req, res) => {
    res.render('login'); // Renderiza la vista EJS
});
router.post('/', loginUser);

router.get('/logout', logoutUser);

router.get('/estadoAnimo', (req, res) => {
    res.render('estadoAnimo', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
});
  router.post('/estadoAnimo', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
});


router.get('/trastorno', (req, res) => {
    res.render('trastorno', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/trastorno', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

router.get('/noticias', (req, res) => {
    res.render('noticias', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
});
  router.post('/noticias', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
});


router.get('/ejercicioRelajar', (req, res) => {
    res.render('ejercicioRelajar'); // Renderiza la vista EJS
});

router.get('/ejercicios', (req, res) => {
    res.render('ejercicios', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
});
  router.post('/ejercicios', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
});

router.get('/meditacion', (req, res) => {
    res.render('meditacion', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/meditacion', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

router.get('/terapia', (req, res) => {
    res.render('terapia', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
});
  router.post('/terapia', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
});

router.get('/guias', (req, res) => {
    res.render('guias', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
});
  router.post('/guias', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
});

router.get('/articulos', (req, res) => {
    res.render('articulos', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
});
  router.post('/articulos', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
});

router.get('/evaluacion', (req, res) => {
    res.render('evaluacion'); // Renderiza la vista EJS
});

router.get('/politicaPrivacidad', (req, res) => {
    res.render('politicaPrivacidad', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/politicaPrivacidad', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

  router.get('/terminosCondiciones', (req, res) => {
    res.render('terminosCondiciones', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/terminosCondiciones', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

  router.get('/cookies', (req, res) => {
    res.render('cookies', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/cookies', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

router.get('/respiracion', (req, res) => {
    res.render('respiracion', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/respiracion', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

  router.get('/gratitud', (req, res) => {
    res.render('gratitud', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/gratitud', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

  router.get('/visualizacionPositiva', (req, res) => {
    res.render('visualizacionPositiva', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/visualizacionPositiva', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

router.get('/ejercicioFisico', (req, res) => {
    res.render('ejercicioFisico', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
});
  router.post('/ejercicioFisico', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
});

router.get('/videos', (req, res) => {
    res.render('videos', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
});
  router.post('/videos', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
});

router.get('/conexionSocial', (req, res) => {
    res.render('conexionSocial', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/conexionSocial', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

  router.get('/escrituraTerapeutica', (req, res) => {
    res.render('escrituraTerapeutica', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/escrituraTerapeutica', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });

router.get('/login2', (req, res) => {
    res.render('login2'); // Renderiza la vista EJS
});



router.get('/relajacionMuscular', (req, res) => {
    res.render('relajacionMuscular', {
      usuario: req.session.usuario || null // Enviar usuario, si está logueado
    });
  });
router.post('/relajacionMuscular', (req, res) => {
    // Lógica de autenticación
    req.session.usuario = usuarioEncontrado; // Asignar usuario a la sesión
    res.redirect('/');
  });


  router.post('/save-mood', saveMood);
  router.get('/mood-history', getMoodHistory);


router.get('/notificacion', getNotifications);


router.post('/citas', saveFormData);

//evaluacion
router.get('/perfil',isAuthenticated, obtenerPerfil);

router.post('/submit-evaluacion', isAuthenticated, guardarEvaluacion);

//Rutas del chat
// Ruta para guardar un mensaje
router.post('/chat', chatController.saveMessage);

// Ruta para renderizar la vista del chat
router.get('/chat', chatController.renderChatView);

// Si quieres una ruta para obtener mensajes (por ejemplo, para cargar mensajes antiguos)
router.get('/messages', chatController.getMessages);


router.use('/password-reset', passwordResetRoutes);
router.post('/forgot-password', passwordResetRoutes);

export default router;