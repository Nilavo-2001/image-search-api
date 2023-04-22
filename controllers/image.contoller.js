const { uploadFile, createProduct, listProductsInProductSet, getSimilarProductsFile } = require('../vision-api');
const { bucketName } = require('../constants');
async function uploadProductSingle(req, res) {
    try {
        const { product_name, product_id } = req.body;
        if (!product_name || !product_id || !req.file) {
            throw 'missing parameter';
        }
        const filePath = req.file.path;
        const filename = req.file.filename;
        await uploadFile(filename, filePath);
        const gcsUri = `gs://${bucketName}/${filename}`;
        const httpUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
        await createProduct(product_name, product_id, gcsUri);
        return res.status(200).json({
            data: {
                gcsUri,
                httpUrl
            },
            msg: "Product uploaded sucessfully wait for 30 mins before searching it"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Failed to upload product"
        });
    }
}
async function checkProductSet(req, res) {
    try {
        const productSet = await listProductsInProductSet();
        return res.status(200).json({
            data: {
                productSet
            },
            msg: 'product set fetched sucessfully'
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'failed to fetch product set'
        })
    }
}
async function getSimillarProduct(req, res) {
    try {
        const path = req.file.path;
        const products = await getSimilarProductsFile(path);
        return res.status(200).json({
            data: {
                products
            },
            msg: "Found Simillar products sucessfully"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Failed to find simillar products"
        })
    }
}
module.exports = { uploadProductSingle, checkProductSet, getSimillarProduct }