const express = require('express');
const router = express.Router();
const multer = require("multer");
const { uploadProductSingle, checkProductSet, getSimillarProduct } = require('../controllers/image.contoller');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        return cb(null, uniquePrefix + '-' + file.originalname);
    }
})
const upload = multer({ storage: storage });
router.post('/upload_product_single', upload.single("img"), uploadProductSingle);
router.get('/fetch_product_set', checkProductSet)
router.get('/get_simillar_products', upload.single("img"), getSimillarProduct);
module.exports = router;

