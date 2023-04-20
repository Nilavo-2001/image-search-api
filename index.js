const cred = {
    "type": "service_account",
    "project_id": "perfect-reserve-384308",
    "private_key_id": "dd45634918785c7f85e357bbdebd46c06bea201d",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+YqxDe2Q2SBza\nsEkvUOXgE3KlQHyjL0BMhEj/0s3lb69fKX9IK9xYe+WiqB/UOyf2U7PPq2C0+xCS\n1h2KCVzwTuypVmyuwaspTNeZNWo+JE0FZdIvCcgXEdeKL7pwwGZNYQpiUyBhqYWY\n/faORlmpltCTaMqkCs7nRhjg04dg398B1Ez/gmgh9h5g54OpIbO4UrehuqzYRSFi\nQi7GfliucWv8JUu5CtDbOzqy/uUcfM2T3go3RyeLqrxmSX6b4plfk7P9ASY8BOdY\nRby+UA2ItOefaoCDUgRPKsT+behWm/XDoeUr7MoItZzLvijlfhE8zlpQ1SZGtbp8\n8vc81ZpNAgMBAAECggEAAVyprdE9U3QVnMI5FnkQ2UGvsXCc06VcDjq+CPJ5nZln\nGu+sOkMcuuympRC91Yysya1/R6OKuBC5ussu/+n25miHdzin42IoTCMsFwD+Ub58\nZzxQvMcS+DNHpEnuHq4JrVEIkXvVwKJv/bsHX1eFKa+WA2VIWdRn9tiWB08MFLcn\na6EC6CwTHistg8N12B1hhQdRObgw4Zl+IJTv56wfBgFcYZax9Iv5NsyJZwKyboKv\nxlkjMyVupZBZD4x7yLtnBHVydNPMS/bS3oBvN8vCIV/o8kO4tR8U0zm8/EDyxjak\nuKxXMM4OIqVUyr7XUE0yMLq4qnShvX9MCHK1wp5iYwKBgQD+d6JiOQ2hD3XYRZGy\nf9zMvDkEcYf/BYqXClfX54pYehPM7UxwzGx9qOYxnXWMKSXido7ml2xLQyVFPTfR\n8F5IolFl4ZwbjyCei6PG6k8v+hjxh8C0Y8dTs8Kd/cujhl0AwHCC4NI+KHdfGBys\nJ0Llw0NYlV2JJykkpywHu5ENywKBgQC/iDroN8TLq/U1HuXpazdzdN0KzpgYgXAn\n1Y8/4Kr/f5mQtOQ0+qwbQtluKoEwP6EGCIRCr0D9xpFRuOzohndwNlEA4ALHR1qu\n6Za80tVQVYbDfSJlR/kEtgl7Xpaa0RwjKWGxBnEgMnCZ8J+LOecs+LoF6bfB0bf6\niTMHK0d1RwKBgF0z7GIVi4xmYT9pm8fJVVIXzrp16t3ZZb2UqEAIKn/llsMEV28p\nMMOFzWp2xcskdx/PVN/Yrm2SlmAZ4AwhAieQbEforojZj5UCiGYfBAoKjIBKvKZV\ntXhO6wV7I88tM3tHAO6u8dKad7540merqbEGJ/CWJMBLe6JVKKdcZ/CpAoGAK52O\nLItmmSrTcAFVQc5Ulkoqe+eH4yy2qZuMP3Od/QjFo5pNzXK39o1GjjvHp4EV3hXa\naIUYO7IYLY/7Awh78mWsFJLujwrEr8gpt14bjWusgJ/iUUYOgvAhQKLNkPvFeIxX\n3sQkxrw1wBh3fHD3H9qUIfyTB+QGDVto71z/rMkCgYEApiI2KP/b9vpTQZFBhkwQ\nxwVTn2g42hYeyhFgI+hLQT+a6e5cR3na4l8QhviqkLFpsLbUKQShGf2Vxnn9H98j\nb1ampmJ9H3uIJSwZD3SnQVMbxDsCE3VttiPv5YMIri013yANXjWIQjwzINgVjbuX\nL3n7W6eRlwuZ/Kf0BwAaG0w=\n-----END PRIVATE KEY-----\n",
    "client_email": "nilavo-bhattacharya@perfect-reserve-384308.iam.gserviceaccount.com",
    "client_id": "114160109373958886611",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/nilavo-bhattacharya%40perfect-reserve-384308.iam.gserviceaccount.com"
}
const CONFIG = {
    credentials: {
        private_key: cred.private_key,
        client_email: cred.client_email
    }
};
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const fs = require('fs');
// Creates a client
const client = new vision.ProductSearchClient(CONFIG);

async function importProductSets() {
    const projectId = cred.project_id;
    const location = 'asia-east1';
    const gcsUri = 'gs://image-api-test/vision_product_search_product_catalog_2.csv';

    // A resource that represents Google Cloud Platform location.
    const projectLocation = client.locationPath(projectId, location);

    // Set the input configuration along with Google Cloud Storage URI
    const inputConfig = {
        gcsSource: {
            csvFileUri: gcsUri,
        },
    };

    // Import the product sets from the input URI.
    const [response, operation] = await client.importProductSets({
        parent: projectLocation,
        inputConfig: inputConfig,
    });

    console.log('Processing operation name: ', operation.name);

    // synchronous check of operation status
    const [result] = await response.promise();
    console.log('Processing done.');
    console.log('Results of the processing:');

    for (const i in result.statuses) {
        console.log(
            'Status of processing ',
            i,
            'of the csv:',
            result.statuses[i]
        );

        // Check the status of reference image
        if (result.statuses[i].code === 0) {
            console.log(result.referenceImages[i]);
        } else {
            console.log('No reference image.');
        }
    }
}

//importProductSets();

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
//listProductSets();





// Creates a client
const imageAnnotatorClient = new vision.ImageAnnotatorClient(CONFIG);

async function getSimilarProductsFile() {

    const projectId = cred.project_id;
    const location = 'asia-east1';
    const productSetId = 'product_set0';
    const productCategory = 'apparel-v2';
    const filePath = 'gs://image-api-test/sneakers-shoes.jpg';
    const filter = '';
    const productSetPath = client.productSetPath(
        projectId,
        location,
        productSetId
    );
    //const content = fs.readFileSync(filePath, 'base64');
    const request = {
        // The input image can be a GCS link or HTTPS link or Raw image bytes.
        // Example:
        // To use GCS link replace with below code
        // image: {source: {gcsImageUri: filePath}}
        // To use HTTP link replace with below code
        // image: {source: {imageUri: filePath}}
        image: { source: { imageUri: filePath } },
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
    console.log(response.responses[0].error);
    if (error) {
        return;
    }
    const results = response['responses'][0]['productSearchResults']['results'];
    console.log('\nSimilar product information:');
    results.forEach(result => {
        //console.log('Product id:', result['product'].name.split('/').pop(-1));
        const productId = result['product'].name.split('/').pop(-1);
        listReferenceImage(productId);
        //console.log('Product display name:', result['product'].displayName);
        //console.log('Product description:', result['product'].description);
        //console.log('Product category:', result['product'].productCategory);
    });
}
getSimilarProductsFile();


async function listProductsInProductSet() {

    const projectId = cred.project_id;
    const location = 'asia-east1';
    const productSetId = 'sneaker';
    const productSetPath = client.productSetPath(
        projectId,
        location,
        productSetId
    );
    const request = {
        name: productSetPath,
    };

    const [products] = await client.listProductsInProductSet(request);
    products.forEach(async (product) => {
        console.log(product);
        const id = product.name.split('/').pop();
        await listReferenceImage(id);
    });
}
//listProductsInProductSet();

async function listReferenceImage(productId) {

    const projectId = cred.project_id;

    //const formattedParent = client.productPath(projectId, location, productId);
    const location = 'asia-east1';
    const formattedParent = client.productPath(projectId, location, productId);
    const request = {
        parent: formattedParent,
    };

    const [response] = await client.listReferenceImages(request);
    response.forEach(image => {
        console.log(`image.uri: ${image.uri}`);
    });
}
