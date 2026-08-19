const errorHandler = (err, req, res, next) => {
    let message = err.message || "Internal Server Error"
    let statusCode = err.statusCode || 500

    if (process.env.NODE_ENV === "production") {
        if (err.statusCode === 500) {
            message = "Somethings went wrong!"
        }
    }

    console.error(" [Error Handler]:", err);

    return res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : err.stack,
    })
}

export default errorHandler;