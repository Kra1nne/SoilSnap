import mongoose  from "mongoose";

const soilClassificationSchema = new mongoose.Schema({ 
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
    }
}, {
  timestamps: true,
});

const SoilClassification = mongoose.model("SoilClassification", soilClassificationSchema);
export default SoilClassification;