// const tf = require ('@tensorflow/tfjs-node');
const fs = require("fs");
const path = require("path");



async function predict(inputData) {
    try {
        // Obtenir le chemin absolu du modèle
        const fullPath = path.resolve(__dirname, "..", "..", "models", "monthlyModel", "model.json");

        console.log("Chemin du modèle :", fullPath); // Debugging

        // Vérifier si le fichier existe avant chargement
        if (!fs.existsSync(fullPath)) {
            console.error("Erreur : Le fichier model.json est introuvable à l'emplacement :");
            return null;
        }

        // Chargement du modèle avec un chemin correct !!! se ligne cose un erreur 
        const model = await tf.loadLayersModel(`file://${fullPath}`);
        console.log(model)

        // Exécuter la prédiction
        

        console.log(`Prédiction : ${result > 0.5 ? "Réussite" : "Échec"} (Score: ${result.toFixed(2)})`);
        
    } catch (error) {
        console.error("Erreur lors de la prédiction :", error);
        return null;
    }
}

module.exports = { predict };
