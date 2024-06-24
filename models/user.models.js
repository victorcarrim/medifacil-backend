const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    cpf: { type: String, required: true, unique: true},
    name: {type: String},
    email: { type: String },
    password: { type: String },
    googleId: { type: String },
    birthDate: { type: Date },
    isRegistered: { type: Boolean, default: false },
    role: { type: String, default: 'client', required: true },
    isActive: {type: Boolean, default: true, required: true},
}, {timestamps: true})

UserSchema.pre('find', function() {
    this.where({ isActive: true });
});

UserSchema.pre('findOne', function() {
    this.where({ isActive: true });
});
//
UserSchema.pre('findById', function() {
    this.where({ isActive: true });
});

UserSchema.pre('findOneAndUpdate', function() {
    this.where({ isActive: true });
});

UserSchema.pre('findByIdAndUpdate', function() {
    this.where({ isActive: true });
});
UserSchema.pre('findOne', function() {
    this.where({ isActive: true });
})

UserSchema.methods.deactivate = function() {
    this.isActive = false;
    return this.save();
};

module.exports = mongoose.model('User', UserSchema)