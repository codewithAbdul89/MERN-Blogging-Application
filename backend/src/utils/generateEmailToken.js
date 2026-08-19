import crypto from "crypto"

export const generateEmailToken = (
    length = 32
) => {

    const rawToken =
        crypto.randomBytes(length).toString("hex");

    const hashedToken =
        crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

    return {
        rawToken,
        hashedToken
    };
};


export const generateEmailOtp = () => {

    const rawOtp =
        crypto.randomInt(
            100000,
            1000000
        ).toString();

    const hashedOtp =
        crypto.createHash("sha256")
            .update(rawOtp)
            .digest("hex");

    return {
        rawOtp,
        hashedOtp
    }
}