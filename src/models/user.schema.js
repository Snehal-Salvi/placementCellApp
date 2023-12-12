//user schema
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, maxLength:[25, "Name can't be greater than 25 characters"]},
    email: {type: String, required: true,
        match: [/.+\@.+\../, "Please enter a valid email"]
    },
    password: {type: String, required: true},
});

//method to hash the password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

//method to compare passwords during login
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
