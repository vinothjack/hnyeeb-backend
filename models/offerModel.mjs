import mongoose from "mongoose";

const offerModel = new mongoose.Schema({
    OfferImage: {
        path: {
            type: String,
            required: true,
        },
        filename: {
            type: String,
            required: true,
        },
    },
})

const OfferImg = mongoose.model('OfferImg',offerModel)
export default  OfferImg; 