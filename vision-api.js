const { cred, productSetId, bucketName } = require('./constants');
const CONFIG = {
    credentials: {
        private_key: cred.private_key,
        client_email: cred.client_email
    }
};
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const client = new vision.ProductSearchClient(CONFIG);

async function getSimilarProductsFile(filePath) {
    const imageAnnotatorClient = new vision.ImageAnnotatorClient(CONFIG);
    const projectId = cred.project_id;
    const location = 'asia-east1';
    const productCategory = 'apparel-v2';
    const filter = '';
    const productSetPath = client.productSetPath(
        projectId,
        location,
        productSetId
    );
    const content = fs.readFileSync(filePath, 'base64');
    const request = {
        image: { content: content },
        features: [{ type: 'PRODUCT_SEARCH' }],
        imageContext: {
            productSearchParams: {
                productSet: productSetPath,
                productCategories: [productCategory],
                filter: filter,
            },
        },
    };
    const [response] = await imageAnnotatorClient.batchAnnotateImages({
        requests: [request],
    });
    const error = response.responses[0].error;
    console.log('Search Image:', filePath);
    //console.log(response.responses[0].error);
    if (error) {
        return;
    }
    const results = response['responses'][0]['productSearchResults']['results'];
    console.log('\nSimilar product information:');
    let SimilarProducts = [];
    for (let index = 0; index < results.length; index++) {
        const result = results[index];
        const product = result['product'];
        const productId = product.name.split('/').pop(-1);
        let productImages = await listReferenceImage(productId);
        SimilarProducts.push({
            productId,
            name: product.displayName,
            score: result['score'],
            productImages
        })
        console.log(`Product score for ${result['product'].name.split('/').pop(-1)} :`, result['score']);
    }

    return SimilarProducts;
}
async function listProductsInProductSet() {

    const projectId = cred.project_id;
    const location = 'asia-east1';
    const productSetPath = client.productSetPath(
        projectId,
        location,
        productSetId
    );
    const request = {
        name: productSetPath,
    };

    const [products] = await client.listProductsInProductSet(request);
    let productSet = [];
    for (let index = 0; index < products.length; index++) {
        const product = products[index];
        const id = product.name.split('/').pop();
        //console.log(product);
        let productImages = await listReferenceImage(id);
        productSet.push({ product_id: id, displayName: product.displayName, productImages })
    }

    //console.log(productSet);
    return productSet;
}
async function listReferenceImage(productId) {

    const projectId = cred.project_id;

    //const formattedParent = client.productPath(projectId, location, productId);
    const location = 'asia-east1';
    const formattedParent = client.productPath(projectId, location, productId);
    const request = {
        parent: formattedParent,
    };

    const [response] = await client.listReferenceImages(request);
    let productImages = [];
    for (let index = 0; index < response.length; index++) {
        const image = response[index];
        const img_url = 'https://storage.googleapis.com/' + image.uri.split('//').pop();
        productImages.push({ img_uri: image.uri, img_url });
    }
    // response.forEach(image => {
    //     productImages.push({ img_uri: image.uri });
    // });
    return productImages;
}
async function createProduct(productDisplayName, productId, gcsUri) {

    const projectId = cred.project_id;
    const location = 'asia-east1';
    const productCategory = 'apparel-v2';

    // Resource path that represents Google Cloud Platform location.
    const locationPath = client.locationPath(projectId, location);

    const product = {
        displayName: productDisplayName,
        productCategory: productCategory,
    };

    const request = {
        parent: locationPath,
        product: product,
        productId: productId,
    };

    const [createdProduct] = await client.createProduct(request);
    await addProductToProductSet(productId);
    await createReferenceImage(productId, gcsUri);
    console.log(`Product name: ${createdProduct.name}`);
}
async function addProductToProductSet(productId) {

    const projectId = cred.project_id;
    const location = 'asia-east1';
    const productPath = client.productPath(projectId, location, productId);
    const productSetPath = client.productSetPath(
        projectId,
        location,
        productSetId
    );

    const request = {
        name: productSetPath,
        product: productPath,
    };

    await client.addProductToProductSet(request);
    console.log('Product added to product set.');
}
async function createReferenceImage(productId, gcsUri) {

    const projectId = cred.project_id;
    const location = 'asia-east1';

    const formattedParent = client.productPath(projectId, location, productId);

    const referenceImage = {
        uri: gcsUri,
    };

    const request = {
        parent: formattedParent,
        referenceImage: referenceImage,
    };

    const [response] = await client.createReferenceImage(request);
    console.log(`response.name: ${response.name}`);
    console.log(`response.uri: ${response.uri}`);
}
async function uploadFile(destFileName, filePath) {
    const storage = new Storage(CONFIG);
    const options = {
        destination: destFileName
    };

    await storage.bucket(bucketName).upload(filePath, options);
    console.log(`${filePath} uploaded to ${bucketName}`);
}
module.exports = {
    importProductSets,
    getSimilarProductsFile,
    listProductsInProductSet,
    listReferenceImage,
    createProduct,
    uploadFile
};