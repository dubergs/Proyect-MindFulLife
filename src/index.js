import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session';
import routes from './routes/index.js';
import './controller/scheduler.js'; // Importa y ejecuta el cron job
import http from 'http';
import { Server } from 'socket.io';

const app = express()
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(session({
    secret: 'hola',  // Cambia esto por un secreto seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Asegúrate de que esté en false si no usas HTTPS
}));

const io = new Server(server)
io.on('connection', (socket) => {
  /*
  console.log('Un usuario se ha conectado')
  
  socket.on('chat', (msg) => {
    console.log('Mensaje: ' + msg)
  })
  */

  socket.on('chat', (msg) => {
    io.emit('chat', msg)
  })
})

// Middleware de autenticación
export function isAuthenticated(req, res, next){
    if (req.session.userId) {
      return next();
    }
    res.redirect('/');
};

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(join(__dirname, 'public')))

app.use('/', routes);

// Middleware para proteger la ruta /index
app.use('/index', isAuthenticated, routes);

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
});