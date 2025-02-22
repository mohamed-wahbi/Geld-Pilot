require("isomorphic-fetch");
const { Client } = require("@microsoft/microsoft-graph-client");
const { ClientSecretCredential } = require("@azure/identity");
require("dotenv").config();

const getGraphClient = async () => {
    const tenantId = process.env.TENANT_ID;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const tokenResponse = await credential.getToken("https://graph.microsoft.com/.default");

    const client = Client.init({
        authProvider: (done) => {
            done(null, tokenResponse.token); // Utilisation du vrai token
        },
    });

    return client;
};

module.exports = getGraphClient;
