import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import User from "../../models/user.models";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { OptionsType, UserType } from "../../types/type";

const isProduction = process.env.NODE_ENV === 'production';

const options: OptionsType = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction,
}

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const requiredFields = { email, username, password };

    for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
        if (typeof fieldValue !== 'string' || !fieldValue.trim()) {
            throw new ApiError(400, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
        }
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters")
    }

    const ExistingUser = await User.findOne({
        email: email.toLowerCase()
    })

    if (ExistingUser) {
        throw new ApiError(409, "User Already Exists")
    }

    const user = await User.create({
        name: username,
        email: email.toLowerCase(),
        password
    });

    const Token = (user as unknown as UserType).GenerateAuthToken();

    const CreatedUser = await User.findById(user._id).select("-password")

    if (!CreatedUser) {
        throw new ApiError(500, "Something went wrong creating User")
    }

    return res
        .status(201)
        .cookie("Token", Token, options)
        .json(
            new ApiResponse(201, CreatedUser, "User Registered Successfully")
        )
});