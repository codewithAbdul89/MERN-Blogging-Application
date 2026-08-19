import multer from "multer";
import ApiError from "../utils/ApiError.js";

export const handleUploadErrors = (err, req, res, next) => {

    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {

            const maxSize = req.uploadConfig?.fileSize;

            return next(
                new ApiError(
                    400,
                    `File size must be under ${Math.floor(maxSize / (1024 * 1024))} MB.`
                )
            );

        }

        return next(new ApiError(400, err.message));

    }

    if (err?.message === "INVALID_FILE_TYPE") {

        return next(
            new ApiError(
                400,
                `Only ${req.uploadConfig?.allowedFileNames} files are allowed.`
            )
        );

    }

    next(err);

};