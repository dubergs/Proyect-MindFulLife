import {Router} from 'express'
const router = Router()

router.get('/', (req, res) => res.render('index'))
router.get('/about', (req, res) => res.render('about'))
router.get('/contact', (req, res) => res.render('contact'))

router.get('/recuperaPass', (req, res) => {
    res.render('recuperaPass'); // Renderiza la vista EJS
});
router.get('/register', (req, res) => {
    res.render('register'); // Renderiza la vista EJS
});
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza la vista EJS
});
router.get('/estadoAnimo', (req, res) => {
    res.render('estadoAnimo'); // Renderiza la vista EJS
});
router.get('/verificarCodigo', (req, res) => {
    res.render('verificarCodigo'); // Renderiza la vista EJS
});
router.get('/ejercicioCuidado', (req, res) => {
    res.render('ejercicioCuidado'); // Renderiza la vista EJS
});
router.get('/testimonios', (req, res) => {
    res.render('testimonios'); // Renderiza la vista EJS
});
router.get('/noticias', (req, res) => {
    res.render('noticias'); // Renderiza la vista EJS
});
router.get('/trastorno', (req, res) => {
    res.render('trastorno'); // Renderiza la vista EJS
});
router.get('/ejercicioRelajar', (req, res) => {
    res.render('ejercicioRelajar'); // Renderiza la vista EJS
});
router.get('/ejercicios', (req, res) => {
    res.render('ejercicios'); // Renderiza la vista EJS
});
router.get('/meditacion', (req, res) => {
    res.render('meditacion'); // Renderiza la vista EJS
});
router.get('/terapia', (req, res) => {
    res.render('terapia'); // Renderiza la vista EJS
});
router.get('/guias', (req, res) => {
    res.render('guias'); // Renderiza la vista EJS
});
router.get('/evaluacion', (req, res) => {
    res.render('evaluacion'); // Renderiza la vista EJS
});
router.get('/politicaPrivacidad', (req, res) => {
    res.render('politicaPrivacidad'); // Renderiza la vista EJS
});
router.get('/terminosCondiciones', (req, res) => {
    res.render('terminosCondiciones'); // Renderiza la vista EJS
});
router.get('/cookies', (req, res) => {
    res.render('cookies'); // Renderiza la vista EJS
});
router.get('/respiracion', (req, res) => {
    res.render('respiracion'); // Renderiza la vista EJS
});

export default router