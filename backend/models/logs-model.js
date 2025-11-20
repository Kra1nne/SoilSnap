import mongoose  from "mongoose";

const logsSchema = new mongoose.Schema({ 
    action: {
        type: String,
        required: true
    },
    table: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }
}, {
  timestamps: true,
});

const Logs = mongoose.model("Logs", logsSchema);
export default Logs;