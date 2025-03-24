const tf = require('@tensorflow/tfjs-node');
const axios = require("axios");
const path = require("path"); // Ajout pour corriger le chemin
const fs = require("fs"); // Ajout pour gérer les dossiers

// Charger les données depuis MongoDB via API
async function loadData(url) {
    const response = await axios.get(url);
    return response.data;
}

// Transformer les données pour TensorFlow.js
function prepareData(data) {
    const inputs = data.map(d => [
        d.revenu, d.charges, d.croissanceRevenu, d.croissanceCharges, d.facteurExterne
    ]);
    const labels = data.map(d => d.reussite);
    
    return {
        xs: tf.tensor2d(inputs),
        ys: tf.tensor2d(labels, [labels.length, 1])
    };
}

// Créer un modèle de classification
function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [5], units: 16, activation: "relu" }));
    model.add(tf.layers.dense({ units: 8, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" })); // 0 ou 1 (réussite ou échec)
    
    model.compile({
        optimizer: "adam",
        loss: "binaryCrossentropy",
        metrics: ["accuracy"]
    });

    return model;
}

// Entraînement du modèle mensuel
async function trainMonthlyModel() {
    console.log("Chargement des données mensuelles...");
    const data = await loadData("http://127.0.0.1:3320/api/monthly-finance/getAll");
    const { xs, ys } = prepareData(data);

    const model = createModel();
    
    console.log("Entraînement du modèle mensuel...");
    await model.fit(xs, ys, { epochs: 50 });

    // Correction du chemin de sauvegarde du modèle
    const modelPath = path.resolve(__dirname, "models", "monthlyModel"); 

    // Vérifier et créer le dossier si nécessaire
    if (!fs.existsSync(modelPath)) {
        fs.mkdirSync(modelPath, { recursive: true });
    }

    await model.save(`file://${modelPath}`);

    console.log("Modèle mensuel sauvegardé !");
}

// Entraînement du modèle annuel
async function trainAnnualModel() {
    console.log("Chargement des données annuelles...");
    const data = await loadData("http://127.0.0.1:3320/api/annual-finance/getAll");
    const { xs, ys } = prepareData(data);

    const model = createModel();
    
    console.log("Entraînement du modèle annuel...");
    await model.fit(xs, ys, { epochs: 50 });

    // Correction du chemin de sauvegarde du modèle annuel
    const modelPath = path.resolve(__dirname, "models", "annualModel");

    // Vérifier et créer le dossier si nécessaire
    if (!fs.existsSync(modelPath)) {
        fs.mkdirSync(modelPath, { recursive: true });
    }

    await model.save(`file://${modelPath}`);

    console.log("Modèle annuel sauvegardé !");
}

// Lancer l'entraînement des deux modèles
(async () => {
    await trainMonthlyModel();
    await trainAnnualModel();
})();
