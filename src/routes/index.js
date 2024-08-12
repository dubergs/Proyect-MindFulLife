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
router.get('/ejercicio1', (req, res) => {
    res.render('ejercicio1'); // Renderiza la vista EJS
});
router.get('/verificarCodigo', (req, res) => {
    res.render('verificarCodigo'); // Renderiza la vista EJS
});

export default router