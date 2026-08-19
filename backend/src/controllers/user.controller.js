import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Bookmark from "../models/bookmark.model.js";
import { uploadFile, deleteFile } from "../Services/file.service.js";
import asyncHandler from "express-async-handler";
import View from "../models/blogView.model.js"; 
import EmailToken from "../models/emailToken.model.js";
import { generateEmailOtp } from "../utils/generateEmailToken.js";
import {EMAIL_EXPIRY,EMAIL_TOKEN_TYPES} from "../constants/email.constants.js"
import { sendDeleteAccountOtpEmail } from "../services/email/email.service.js";
import crypto from "crypto";

export const getUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(404, "User not found. Please sign in again.")

    return res.status(200).json(new ApiResponse(
        200,
        "User fetched successfully",
        { user }))

});

export const updateProfile = asyncHandler(async (req, res) => {
    const { userName, contact, town, city, provience, country, gender, cnic } = req.body;

    const updateData = {}

    // To Update the userName, contact, cnic and

    if (userName) updateData.userName = userName
    if (contact) updateData.contact = contact
    if (cnic) updateData.cnic = cnic
    if (gender) updateData.gender = gender

    //To Update the address

    const address = {}
    if (town) address.town = town
    if (city) address.city = city
    if (provience) address.provience = provience
    if (country) address.country = country

    if (Object.keys(address).length > 0) {
        updateData.address = address
    }


    //To check wheter there is any data to update or not
    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "Please provide some data  to update.")
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id,
        { $set: updateData },
        {
            returnDocument: "after",
            runValidators: true
        }).select("-password")

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, "User Updated Successfully!", { user: updatedUser }))

});

export const updateProfilePicture = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        )
    }

    const file = req.file
    if (!file) {

        throw new ApiError(
            400,
            "Image is required."
        )
    }


    const profilePic = await uploadFile(
        file.buffer,
        'Blogging Application/profilePics',
        "image"
    )

    if (user.profilePic?.public_id) {
        await deleteFile(user.profilePic.public_id);
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                profilePic
            }
        },
        {
            returnDocument: "after",
            runValidators: true
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile pic updated successfully!",
            { user: updatedUser }
        )
    )

});

export const removeProfilePicture = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    if (user.profilePic?.public_id) {
        await deleteFile(user.profilePic.public_id);
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                profilePic: {
                    url: "/images/default.jpeg",
                    public_id: null
                }
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile picture removed successfully.",
            {
                user: updatedUser
            }
        )
    );

});

export const sendDeleteAccountOtp = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        )
    }

    if (!user.isEmailVerified) {
        throw new ApiError(
            403,
            "Verify your email first."
        )
    }

    await EmailToken.deleteMany({
        userId: user._id,
        type: EMAIL_TOKEN_TYPES.DELETE_ACCOUNT_OTP
    });

    const { rawOtp, hashedOtp } = generateEmailOtp()

    const expiresAt = new Date(
        Date.now() + EMAIL_EXPIRY.DELETE_ACCOUNT_OTP
    );

    await EmailToken.create({
        userId: user._id,
        token: hashedOtp,
        type: EMAIL_TOKEN_TYPES.DELETE_ACCOUNT_OTP,
        expiresAt
    });

    await sendDeleteAccountOtpEmail(user,rawOtp);
   
    return res.status(200).json(
        new ApiResponse(
            200,
            "Delete account otp has successfully sent to your email."
        ))
});

export const verifyDeleteAccountOtp = asyncHandler(async (req, res) => {

    const { otp } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const hashedOtp = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    const token = await EmailToken.findOne({
        userId: user._id,
        type: EMAIL_TOKEN_TYPES.DELETE_ACCOUNT_OTP,
        token: hashedOtp
    });

    if (!token) {
        throw new ApiError(400, "Invalid OTP.");
    }

    if (token.expiresAt < new Date()) {
        await EmailToken.findByIdAndDelete(token._id);
        throw new ApiError(400, "OTP expired.");
    }

    // remove OTP after success (ONE TIME USE)
    await EmailToken.findByIdAndDelete(token._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "OTP verified successfully."
        )
    );
});

export const deleteAccount = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const profilePic = req.user?.profilePic?.public_id;

    if (profilePic) {
        await deleteFile(profilePic);
    }

    // delete related data
    await Promise.all([
        Blog.deleteMany({ author: userId }),
        Comment.deleteMany({ author: userId }),
        Like.deleteMany({ user: userId }),
        Bookmark.deleteMany({ user: userId }),
        View.deleteMany({ user: userId }),
        EmailToken.deleteMany({ userId })
    ]);

    await User.findByIdAndDelete(userId);

    return res.status(200).json(
        new ApiResponse(200, "Account deleted successfully.")
    );
}); 