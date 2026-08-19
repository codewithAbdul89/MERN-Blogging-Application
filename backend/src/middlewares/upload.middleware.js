import multer from "multer";

const storage = multer.memoryStorage();

export const createUploader = ({
    fileSize,
    allowedMimeTypes,
    allowedFileNames
}) => {

    const upload = multer({
        storage,

        limits: { fileSize },

        fileFilter(req, file, cb) {

            req.uploadConfig = {
                fileSize,
                allowedFileNames
            };

            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new Error("INVALID_FILE_TYPE"));
            }

            cb(null, true);
        }
    });

    return upload;
};

// imageUploader.array("images", 10),
// imageUploader.fields([
//     { name: "featuredImage", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 }
// ])
// imageUploader.single("FeaturedImage")


export const imageUploader = createUploader({

    fileSize: 2 * 1024 * 1024,

    allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp"
    ],

    allowedFileNames: "JPG, PNG or WEBP"

});


// export const mediaUploader = createUploader({

//     fileSize: 200 * 1024 * 1024,

//     allowedMimeTypes: [

//         "image/jpeg",
//         "image/png",
//         "image/webp",

//         "video/mp4",

//         "application/pdf"

//     ],

// allowedFileName: "JPG, PNG , WEBP ,MP4,PDF"


// });




// export const pdfUploader = createUploader({

//     fileSize: 10 * 1024 * 1024,

//     allowedMimeTypes: [
//         "application/pdf"
//     ],

//     allowedFileNames: "PDF"

// });


// export const videoUploader= createUploader({

//     fileSize: 200 * 1024 * 1024,

//     allowedMimeTypes: [
//         "video/mp4"
//     ],

//     allowedFileNames: "MP4"

// });