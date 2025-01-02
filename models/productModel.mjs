import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        productImage: {
            path: {
                type: String,
                required: true,
            },
            filename: {
                type: String,
                required: true,
            },
        },
        oldPrice: {
            type: Number,
            required: true,
        },
        offerPrice: {
            type: Number,
            required: true,
        },
        productDetails: {
            categories: {
                type: String,
                required: true,
            },
            productCategoryId: {
                type: Number,
                required: true,
                enum: [1, 2, 3, 4, 5, 6], // Restrict to values between 1 and 7
            },
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
export default Product;


