const { cred } = require('./constants');
const CONFIG = {
    credentials: {
        private_key: cred.private_key,
        client_email: cred.client_email
    }
};
const vision = require('@google-cloud/vision');
const client = new vision.ProductSearchClient(CONFIG);

async function deleteProductSet(productSetId) {

    const projectId = cred.project_id;
    const location = 'asia-east1';

    // Resource path that represents full path to the product set.
    const productSetPath = client.productSetPath(
        projectId,
        location,
        productSetId
    );

    await client.deleteProductSet({ name: productSetPath });
    console.log('Product set deleted.');
}
deleteProductSet('sneaker');