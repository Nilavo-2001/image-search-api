const { cred } = require('./constants');
const CONFIG = {
    credentials: {
        private_key: cred.private_key,
        client_email: cred.client_email
    }
};
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const client = new vision.ProductSearchClient(CONFIG);

async function listProductSets() {

    const projectId = cred.project_id;
    const location = 'asia-east1';

    // Resource path that represents Google Cloud Platform location.
    const locationPath = client.locationPath(projectId, location);

    const [productSets] = await client.listProductSets({ parent: locationPath });
    productSets.forEach(productSet => {
        console.log(productSet);
    });
}

listProductSets();