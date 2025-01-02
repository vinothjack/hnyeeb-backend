import Product from '../models/productModel.mjs';
import OfferImg from '../models/offerModel.mjs';
import { returnResponse } from '../utils/response.mjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import deleteImage from '../utils/deleteImage.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createProduct = async (req, res) => {
    const { productName, oldPrice, offerPrice, categories, productCategoryId } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Product image is required' });
    }

    try {
        // Check if the product name already exists
        const existingProduct = await Product.findOne({ productName });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product name already exists' });
        }

        // Create and save the product
        const product = new Product({
            productName,
            oldPrice,
            offerPrice,
            productDetails: {
                categories,
                productCategoryId, // Automatically validated by the schema
            },
            productImage: {
                filename: req.file.filename,
                path: req.file.path,
            },
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product', error });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, oldPrice, offerPrice, categories, productCategoryId } = req.body;

    const updateData = {
        productName,
        oldPrice,
        offerPrice,
        productDetails: {
            categories,
            productCategoryId,
        },
    };

    try {
        const product = await Product.findById(id);
        if (!product) {
            return returnResponse(res, 404, 'Product not found');
        }

        // If a new file is uploaded, handle old file deletion
        if (req.file) {
            const oldFilePath = product.productImage?.path;
            if (oldFilePath) {
                await deleteImage(oldFilePath);
            }

            updateData.productImage = {
                filename: req.file.filename,
                path: req.file.path,
                contentType: req.file.mimetype,
            };
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        return returnResponse(res, 200, updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return returnResponse(res, 500, 'Failed to update product');
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return returnResponse(res, 404, 'Product not found');
        }

        // Delete the associated image file
        const filePath = product.productImage?.path;
        if (filePath) {
            await deleteImage(filePath);
        }

        return returnResponse(res, 200, 'Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
        return returnResponse(res, 500, 'Failed to delete product');
    }
};


export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return returnResponse(res, 404, 'Product not found');
        }
        return returnResponse(res, 200, product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return returnResponse(res, 500, 'Failed to fetch product');
    }
};

export const getProductsWithImages = async (req, res) => {
    try {
        const products = await Product.find();
        const productsWithImages = products.map((product) => {
            const imageUrl = product.productImage
                ? `/api/product/image/${product.productImage.filename}`
                : null;
            return {
                id: product._id,
                productName: product.productName,
                oldPrice: product.oldPrice,
                offerPrice: product.offerPrice,
                categories: product.productDetails.categories,
                productCategoryId: product.productDetails.productCategoryId,
                image: imageUrl,
            };
        });

        return returnResponse(res, 200, productsWithImages);
    } catch (error) {
        console.error('Error fetching products:', error);
        return returnResponse(res, 500, 'Failed to fetch products');
    }
};

export const getImageByFilename = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ message: 'Image not found' });
    }
};


export const getProductsByCategory = async (req, res) => {
    const { productCategoryId } = req.params;

    try {
        // Fetch products that match the given productCategoryId
        const products = await Product.find({
            "productDetails.productCategoryId": productCategoryId,
        });

        if (products.length === 0) {
            return returnResponse(res, 404, 'No products found for this category');
        }

        const productsWithImages = products.map((product) => {
            const imageUrl = product.productImage
                ? `/api/product/image/${product.productImage.filename}`
                : null;
            return {
                id: product._id,
                productName: product.productName,
                oldPrice: product.oldPrice,
                offerPrice: product.offerPrice,
                categories: product.productDetails.categories,
                productCategoryId: product.productDetails.productCategoryId,
                image: imageUrl,
            };
        });

        return returnResponse(res, 200, productsWithImages);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return returnResponse(res, 500, 'Failed to fetch products');
    }
};


export const getOfferImage = async (req, res) => {
    try {
        const offerImages = await OfferImg.find();
        const OfferImages = offerImages.map((offer) => {
            const imageUrl = offer.OfferImage && offer.OfferImage.filename
                ? `/api/product/image/${offer.OfferImage.filename}`
                : null;
            return {
                image: imageUrl,
                id: offer._id
            };
        });

        return returnResponse(res, 200, OfferImages);
    } catch (error) {
        console.error("Error fetching offer images:", error);
        return returnResponse(res, 500, { message: "Failed to fetch offer images." });
    }
};


export const createOfferImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Product image is required' });
        }
        const newOfferImage = new OfferImg({
            OfferImage: { filename: req.file.filename,
                path: req.file.path },
        });

        await newOfferImage.save();

        return returnResponse(res, 201, { message: "Offer image created successfully.", data: newOfferImage });
    } catch (error) {
        console.error("Error creating offer image:", error);
        return returnResponse(res, 500, { message: "Failed to create offer image." });
    }
};






export const deleteOfferImage = async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the offer image document
        const offerImage = await OfferImg.findByIdAndDelete(id);
        if (!offerImage) {
            return returnResponse(res, 404, 'Offer image not found');
        }

        // Delete the associated image file
        const filePath = offerImage.OfferImage?.path;
        if (filePath) {
            await deleteImage(filePath); // Ensure deleteImage is implemented to handle file deletion
        }

        return returnResponse(res, 200, 'Offer image deleted successfully');
    } catch (error) {
        console.error('Error deleting offer image:', error);
        return returnResponse(res, 500, 'Failed to delete offer image');
    }
};

