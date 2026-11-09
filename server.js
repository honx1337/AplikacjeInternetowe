const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

let users = [
    { id: 1, name: 'Jan Kowalski', email: 'jan@example.com' },
    { id: 2, name: 'Anna Nowak', email: 'anna@example.com' }
];

app.get('/', (req, res) => {
    res.send('Witaj w aplikacji Express!');
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});

app.get('/api/info', (req, res) => {
    res.json({
    application: 'Express LAB4',
    version: '1.0'
    });
});

app.get('/contact', (req, res) => {
    res.json({
    contact: 'honx1337'
    });
});

app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    res.json({
    message: 'Pobrano użytkownika',
    id: id
    });
});

app.get('/api/users/search', (req, res) => {
    const { name, page = 1 } = req.query;
    res.json({ name, page });
});

app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Parametr "name" w query jest wymagany do aktualizacji' });
    }

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: 'Użytkownik o podanym ID nie istnieje' });
    }

    user.name = name;

    res.status(200).json({
        message: 'Użytkownik został zaktualizowany',
        user
    });
});

app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Użytkownik o podanym ID nie istnieje' });
    }

    users.splice(index, 1);

    res.status(204).send();
});

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} ${req.requestTime}`);
    next();
};
app.use(logger);

app.use(express.json());
app.post('/api/users', (req, res) => {
    const user = req.body;
    res.status(201).json(user);
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const { body, validationResult } = require('express-validator');
app.post('/api/users',
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.status(201).json(req.body);
    }
);