import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    soil_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "SoilClassification" }]
})

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;