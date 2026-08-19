import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // here errors is object errors.array() convert object into arrays
        const formattedErrors = errors.array().map((err) => ({
            //field: err.path, //for which field like password 
            message: err.msg //error msg 
        }));

        return next(
            new ApiError(
                400,
                "Validation Failed",
                formattedErrors
            )
        );
    }

    next();
};

export default validate;