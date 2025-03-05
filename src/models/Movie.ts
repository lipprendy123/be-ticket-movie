import mongoose from "mongoose";
import { getAssetUrl } from "../utils/helper";
import Genre from "./Genre";
import Teather from "./Teather";

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    teathers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teather'
    }],
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    price: Number,
    available: Boolean,
    bonus: String
}, {
    virtuals: {
        thumbnailUrl: {
            get() {
                return `${getAssetUrl()}${this.thumbnail}`
            }
        }    
    },
    toJSON: {
        virtuals: true
    }
})

movieSchema.post('save', async(doc) => {
    if (doc) {
        await Genre.findByIdAndUpdate(doc.genre, {
            $push: {
                movies: doc._id
            }
        })

        for(const teather of doc.teathers) {
            await Teather.findByIdAndUpdate(teather._id, {
                $push: {
                    movies: teather._id
                }
            })
        }
    }
})

movieSchema.post('deleteOne', async(doc) => {
    if (doc) {
        await Genre.findByIdAndUpdate(doc.genre, {
            $pull: {
                movies: doc._id
            }
        })

        for(const teather of doc.teathers) {
            await Teather.findByIdAndUpdate(teather._id, {
                $pull: {
                    movies: teather._id
                }
            })
        }
    }
})

export default mongoose.model('Movie', movieSchema, 'movies')
