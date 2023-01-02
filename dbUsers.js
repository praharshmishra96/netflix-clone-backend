import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: String,
    likedMovies: Array,
})

export default mongoose.model('users', userSchema)