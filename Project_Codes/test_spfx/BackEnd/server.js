require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());  // Pour parser les données JSON dans le corps des requêtes

const DATAVERSE_API_URL = process.env.DATAVERSE_API_URL;
const DATAVERSE_API_KEY = process.env.DATAVERSE_API_KEY;

// Endpoint pour créer un utilisateur
app.post('/users', async (req, res) => {
    const { name, email } = req.body;

    try {
        const response = await axios.post(`${DATAVERSE_API_URL}/users`, {
            name,
            email
        }, {
            headers: {
                'Authorization': `Bearer ${DATAVERSE_API_KEY}`
            }
        });
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
    }
});

// Endpoint pour récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
    try {
        const response = await axios.get(`${DATAVERSE_API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${DATAVERSE_API_KEY}`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
    }
});

// Endpoint pour récupérer un utilisateur par son ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`${DATAVERSE_API_URL}/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${DATAVERSE_API_KEY}`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: `Erreur lors de la récupération de l'utilisateur avec l'ID ${id}`, error: error.message });
    }
});

// Endpoint pour mettre à jour un utilisateur
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const response = await axios.put(`${DATAVERSE_API_URL}/users/${id}`, {
            name,
            email
        }, {
            headers: {
                'Authorization': `Bearer ${DATAVERSE_API_KEY}`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: `Erreur lors de la mise à jour de l'utilisateur avec l'ID ${id}`, error: error.message });
    }
});

// Endpoint pour supprimer un utilisateur
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await axios.delete(`${DATAVERSE_API_URL}/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${DATAVERSE_API_KEY}`
            }
        });
        res.status(200).json({ message: `Utilisateur avec l'ID ${id} supprimé avec succès` });
    } catch (error) {
        res.status(500).json({ message: `Erreur lors de la suppression de l'utilisateur avec l'ID ${id}`, error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
