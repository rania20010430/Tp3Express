const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Données
let persons = [
    {
        id: 1,
        name: 'John',
        cities: [
            { id: 1, name: 'Paris', area: 105, population: 2140 },
            { id: 3, name: 'Warsaw', area: 517, population: 1778000 },
            { id: 2, name: 'Dublin', area: 115, population: 555000 }
        ]
    },
    {
        id: 3,
        name: 'Jane',
        cities: [
            { id: 2, name: 'Dublin', area: 115, population: 555000 }
        ]
    },
    { id: 2, name: 'Jack' },
    {
        id: 3,
        name: 'Jill',
        cities: [
            { id: 2, name: 'Dublin', area: 115, population: 555000 }
        ]
    },
    {
        id: 4,
        name: 'John',
        cities: [
            { id: 3, name: 'Warsaw', area: 517, population: 1778000 },
            { id: 2, name: 'Dublin', area: 115, population: 555000 }
        ]
    },
];

// Routes
// GET /persons
app.get('/', (req, res) => {
    res.send('Bienvenue dans mon API statique !');
});

app.get('/persons', (req, res) => {
    let result = persons;

    // Filtrage par nom
    if (req.query.name) {
        result = result.filter(person => person.name === req.query.name);
    }

    // Tri par champ
    if (req.query.sort) {
        const field = req.query.sort;
        result = result.sort((a, b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
        });
    }

    // Sélection des champs
    if (req.query.fields) {
        const fields = req.query.fields.split(',');
        result = result.map(person =>
            Object.fromEntries(
                fields.map(field => [field, person[field]])
            )
        );
    }

    res.json(result);
});

// POST: Ajouter une personne
app.post('/persons', (req, res) => {
    const newPerson = {
        id: persons.length + 1, // Génération d'un nouvel ID
        name: req.body.name,
        cities: req.body.cities || [] // Par défaut, une personne peut ne pas avoir de villes
    };

    persons.push(newPerson);
    res.status(201).json(newPerson); // Réponse avec un code HTTP 201 (Created)
});

// PATCH: Modifier une personne
app.patch('/persons/:id', (req, res) => {
    const person = persons.find(p => p.id == req.params.id);
    if (!person) {
        return res.status(404).send("Person not found");
    }

    // Mise à jour des champs existants uniquement
    if (req.body.name !== undefined) {
        person.name = req.body.name;
    }
    if (req.body.cities !== undefined) {
        person.cities = req.body.cities;
    }

    res.json(person); // Réponse avec les données mises à jour
});

// PATCH: Ajouter une ville à une personne
app.patch('/persons/:id/cities', (req, res) => {
    const person = persons.find(p => p.id == req.params.id);
    if (!person) {
        return res.status(404).send("Person not found");
    }

    if (!req.body.city) {
        return res.status(400).send("City data is required");
    }

    if (!person.cities) {
        person.cities = [];
    }

    person.cities.push(req.body.city); // Ajout de la ville
    res.json(person);
});

// DELETE: Supprimer une personne
app.delete('/persons/:id', (req, res) => {
    const index = persons.findIndex(p => p.id == req.params.id);
    if (index === -1) {
        return res.status(404).send("Person not found");
    }

    persons.splice(index, 1); // Suppression de la personne
    res.status(204).send(); // Réponse avec un code HTTP 204 (No Content)
});

// DELETE: Supprimer une ville d'une personne
app.delete('/persons/:id/cities/:cityId', (req, res) => {
    const person = persons.find(p => p.id == req.params.id);
    if (!person || !person.cities) {
        return res.status(404).send("Person or cities not found");
    }

    const cityIndex = person.cities.findIndex(c => c.id == req.params.cityId);
    if (cityIndex === -1) {
        return res.status(404).send("City not found");
    }

    person.cities.splice(cityIndex, 1); // Suppression de la ville
    res.status(204).send(); // Réponse avec un code HTTP 204 (No Content)
});




// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
