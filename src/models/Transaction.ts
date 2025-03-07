import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    subtotal: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    bookongFee: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    teather: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teather'
    }
})

export default mongoose.model('Transaction', transactionSchema, 'transactions')