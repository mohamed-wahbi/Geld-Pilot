const getGraphClient = require("./graphClient.js");
require("dotenv").config();

const getSharePointListItems = async () => {
    try {
        const client = await getGraphClient();
        const siteId = process.env.SHAREPOINT_SITE_ID;
        const listName = process.env.LIST_NAME;

        const response = await client.api(`/sites/${siteId}/lists/${listName}/items`).get();
        console.log("Données de la liste :", response.value);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
};

getSharePointListItems();