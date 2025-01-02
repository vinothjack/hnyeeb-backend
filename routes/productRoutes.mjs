import express from 'express';
import {
    createProduct,
    getProductsWithImages,
    updateProduct,
    deleteProduct,
    getProductById,
    getImageByFilename,
    getProductsByCategory,
    getOfferImage,
    createOfferImage,
    deleteOfferImage
} from '../controllers/productController.mjs';
import { authenticate } from '../middleware/authMiddleware.mjs';
import { upload } from '../utils/multerLocalStorage.mjs';

const router = express.Router();

// Route to get an image by filename (served locally)
router.get('/image/:filename', getImageByFilename);

// Route to get products by productCategoryId
router.get('/category/:productCategoryId', getProductsByCategory);

// Route to get all offer images
router.get('/offerImage', getOfferImage);

// Route to create a new offer image
router.post('/offerImage', authenticate, upload.single('image'), createOfferImage);

// Route to delete an offer image
router.delete('/offerImage/:id', authenticate, deleteOfferImage);

// Route to create a new product with local image upload
router.post('/', authenticate, upload.single('image'), createProduct);

// Route to get all products with images
router.get('/', authenticate, getProductsWithImages);

// Route to get a product by ID
router.get('/:id', authenticate, getProductById);

// Route to update a product (includes image upload if provided)
router.put('/:id', authenticate, upload.single('image'), updateProduct);

// Route to delete a product
router.delete('/:id', authenticate, deleteProduct);

export default router;
