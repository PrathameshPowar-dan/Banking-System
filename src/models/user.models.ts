import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true });

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.GenerateAuthToken = function (): string {
    return jwt.sign({
        _id: this._id,
    },
        process.env.JWT_SECRET_KEY || "secretkey",
        { expiresIn: "1h" }
    );
}

const User = model("User", userSchema);
export default User;