import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.config.js"
import ApiError from "../utils/ApiError.js";

export const uploadFile = async (buffer, folder, resourceType = "image") => {

    if (!buffer) {
        throw new ApiError(
            400,
            "File buffer is missing.")
    }

    try {

        const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                { folder, resource_type: resourceType },

                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error("No result from Cloudinary"));
                    resolve(result);
                }

            );

            streamifier.createReadStream(buffer).pipe(stream);
        });

        return {
            url: result.secure_url,

            public_id: result.public_id,

            // bytes: result.bytes,

            // format: result.format,

            // resourceType: result.resource_type,

            // originalFilename: result.original_filename
        };
    } catch (error) {
        throw new ApiError(
            500,
            error.message
            || "File upload failed.");
    }
};

export const deleteFile = async (public_id, resourceType = "image") => {

    if (!public_id) {
        throw new ApiError(
            400,
            "Public ID is required."
        )
    }

    try {
        await cloudinary.uploader.destroy(
            public_id,
            {
                resource_type: resourceType

            }
        );
    }

    catch (error) {
        throw new ApiError(
            500,
            error.message || "File delete failed."
        );
    }
}; 