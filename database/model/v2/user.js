const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: Number,
    username: String,
    password: String
}, {versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}});

const User = mongoose.model('User', userSchema);

module.exports = User;
