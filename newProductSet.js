const { cred, productSetId } = require('./constants');
const CONFIG = {
    credentials: {
        private_key: cred.private_key,
        client_email: cred.client_email
    }
};
const vision = require('@google-cloud/vision');
const client = new vision.ProductSearchClient(CONFIG);

async function createProductSet() {

    const projectId = cred.project_id;
    const location = 'asia-east1';

    // Resource path that represents Google Cloud Platform location.
    const locationPath = client.locationPath(projectId, location);

    const productSet = {
        displayName: productSetDisplayName,
    };

    const request = {
        parent: locationPath,
        productSet: productSet,
        productSetId: productSetId,
    };

    const [createdProductSet] = await client.createProductSet(request);
    console.log(`Product Set name: ${createdProductSet.name}`);
}
createProductSet();