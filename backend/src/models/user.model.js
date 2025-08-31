import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },


},
    {
        timestamps: true
    });

// Create text index for search functionality
userSchema.index({ name: 'text', email: 'text' });

const User = mongoose.model('User', userSchema);
export default User;