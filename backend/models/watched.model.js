import { model, Schema } from "mongoose";

const watchedSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
        index: true
    },
    movieId: { 
        type: String, 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    posterPath: { 
        type: String 
    },
    addedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true
});

watchedSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default model("Watched", watchedSchema);