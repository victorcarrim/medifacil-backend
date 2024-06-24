const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
}, {timestamps: true})

module.exports = mongoose.model('Token', TokenSchema)