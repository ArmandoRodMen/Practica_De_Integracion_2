import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    isGithub: {
        type: Boolean,
        default: false,
    },
    isGoogle: {
        type: Boolean,
        default: false,
    },
    age:{
        type: Number,
        required: false,
        default: 18
    },
    cart:{
        type: Number,
        required: false,
        default: 0
    },
    role: {
        type: String,
        enum: ["admin", "premium", "user"],
        default: "user" 
    }
});

export const usersModel = mongoose.model("Users", usersSchema);