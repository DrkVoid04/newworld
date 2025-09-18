import mongoose, { Schema } from "mongoose";

const logSchema = new Schema({
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'DENY', 'LOGIN', 'UPLOAD']
    },
    entity: {
        type: String,
        required: true,
        enum: ['PRODUCT', 'CATEGORY', 'ORDER', 'ADMIN_SETTINGS', 'USER']
    },
    entityId: String,
    adminEmail: String,
    description: String,
    oldData: Schema.Types.Mixed,
    newData: Schema.Types.Mixed,
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: String
});

const Log = mongoose.model("Log", logSchema);
export default Log;