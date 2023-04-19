const cred = {
    "type": "service_account",
    "project_id": "marketplace-384209",
    "private_key_id": "dfce038b78f37e8fe702aac38ac5899a4bc6278c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDhiGOmZBeoMzps\nvg9SOVlzaKzdJX/H4/AQfGI37bdPazJLjqQHAF9kxl/CyFHR42LSxR8iRbJcOFaL\npJPDkyxApSUDXovOx2DO2syi6qKEcIO02J/t9EgLQ1A1CXTsVlc8uD8aNshHNBai\npB1294M9ReOvCkiM3LrbZJFU+Rk/z90IZpPnn9NRno+6UbZoA0fyU+AiaVTwFe/p\nRyKPmQeMLpWeAil/7GINxVq1y1iVKaMFb/BRK0zJaCpIiEbpKpVilxd3/M23viei\nX0cs7wC83DwdYTmFLXVM9UHTJflLF23RM8Yzn+MxS17TKEKy4RuAdEosqDpgGgqv\nVIPI/P+rAgMBAAECggEAPnkzcWIEk5ktM/Yp9FLijm+OguviS5K+azKpWmjFAIDn\nO7rVgQL/acDxwdkPoR5lv5DPIQVBdP4+Kwx5yhE4juewKxDDlZHxJRvC19Y7EojA\nUxY2pwml80jALRDjjJwWKkG3aSGHtQGey4q+hrflaNG1UkV891glgqSHBYzDC8OZ\nXyHs2lDsaEZbvOzHyiJUViFBZtrF4RCciVzbQHTDl6g1GhS9APWeGFFv9rzaca13\nrXq+Y83LGhRv7sD1J1GccXum8OLhMuRmBzkodMzydt0RdQSmDWhfewxB7zo+FJuO\n/OvFakA9mz2gTBDOdCYwKw5N2ZH1xFpYJnqgSYiK0QKBgQD9Le1cWZbWAzFtS5A6\n/rd21d3ev4vH31jAQMRckA4c2ZGcSV+u86CZvXb5ixB7SPi+OodlluQojmGVL19/\nWaYTP/w5h75EVk8Uu8tzAZttsP88EcZnJXOXbN56RsWT1p/qtBnEn1bMFnvSeIW8\n54oR4cqa33kYF4KL/9R5WVVJ9wKBgQDkC50By9TU5w0L0uXao/UAO28LvDXmsoFf\ndoPklILvQrvuKHiGe3MyE5AsbK+ClruwxcwzF72U/RHkRqNvtDL59HaXerlqpHND\nW+n+ckQLefmX+Xf5zReET3BPheMn51fm8jGiu1LShaB71NLTym2uI7DAQNytYIjg\n58+XTwMq7QKBgQCo83sQQ6DKlDrpqqFHHS+lF7cFrGFFMiBxu0bOVjt0uSPYXYaC\no4Wq0qqQgGKxQtLrbvdnrbf38HviKEjcHSEce3h/k7w+sjH3rhJoXswv+Qt6NIpn\nzrBCfp5AjvXOYE07PJBti79KVj6vB0qH8yNKJ5kinLqcfyPY9RH/IMQvpQKBgGz6\nm8qa9RfVXueynoOw7Mlynau3Au8/iRHs2jTnP/dFJfg3QPnLjw50SObh/bHjhMiC\njgYwpznHAsDbfQlJzT6kM/RKAsfS1P5ws08Uni352WxmHI61EzL4n4xxSE/uf5Rv\nU4cYDAltMHddCm+KAoZAqhwGIy97vY31WcBOUw41AoGAW3zuALB5NnjTJJcwBXAm\nzbBZkzXf+EjDcelXeIsuw1laxK/dTVNtd5VDaaskKGnyP+scV4L76RexGn3JCSgU\n0Gn2IbSehnV+0sULBiWCCjrLWDWNve11AqczvmCPQaHqHl/Keqjum3MKpoHRTmV0\nt6jF2YCzY8BwLWEaSEg+rS8=\n-----END PRIVATE KEY-----\n",
    "client_email": "marketplace@marketplace-384209.iam.gserviceaccount.com",
    "client_id": "114481502820319301561",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/marketplace%40marketplace-384209.iam.gserviceaccount.com"
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
    const gcsUri = 'gs://cloud-samples-data/vision/product_search/product_catalog.csv';

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
    const productCategory = 'apparel';
    const filePath = 'gs://cloud-ai-vision-data/product-search-tutorial/images/4690d31970ba11e8b615d20059124800.jpg';
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
        image: { source: { gcsImageUri: filePath } },
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
    console.log('Search Image:', filePath);
    console.log(response.responses[0].error);
    return;
    const results = response['responses'][0]['productSearchResults']['results'];
    console.log('\nSimilar product information:');
    results.forEach(result => {
        console.log('Product id:', result['product'].name.split('/').pop(-1));
        console.log('Product display name:', result['product'].displayName);
        console.log('Product description:', result['product'].description);
        console.log('Product category:', result['product'].productCategory);
    });
}
getSimilarProductsFile();
