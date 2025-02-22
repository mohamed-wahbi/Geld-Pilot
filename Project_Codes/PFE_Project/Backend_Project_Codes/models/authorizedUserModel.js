const mongoose = require("mongoose");
const Joi = require("joi");

const authUserSchema = new mongoose.Schema(
    {
        authorizedEmail: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

const AuthorizedUser = mongoose.model("AuthorizedUser", authUserSchema);

// Validation function for new user registration
function validateAuthUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
    });
    return schema.validate(obj);
}

module.exports = {
    AuthorizedUser,
    validateAuthUser,
};
