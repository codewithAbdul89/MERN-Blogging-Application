const brandColor = "#2563eb";
const lightColor = "#f8fafc";

export const loginOtpTemplate = ({ userName, otp }) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Verification Code</title>
</head>

<body
    style="
        margin:0;
        padding:20px 10px;
        background:${lightColor};
        font-family:Arial,sans-serif;
        width:100%;
        box-sizing:border-box;
    "
>

    <div
        style="
            width:100%;
            max-width:600px;
            margin:0 auto;
            background:white;
            border-radius:12px;
            overflow:hidden;
            box-sizing:border-box;
        "
    >

        <!-- Header -->
        <div
            style="
                background:${brandColor};
                padding:30px 20px;
                text-align:center;
                box-sizing:border-box;
            "
        >
            <h1 style="color:white;margin:0;font-size:28px;">
                Blogging Application
            </h1>
        </div>

        <!-- Content -->
        <div
            style="
                padding:30px 20px;
                box-sizing:border-box;
            "
        >

            <h2 style="margin-top:0;color:#222;">
                Hello ${userName} 👋🏻
            </h2>

            <p style="font-size:16px;line-height:1.7;color:#555;">
                We received a request to sign in to your
                <strong>Blogging Application</strong> account.
            </p>

            <p style="font-size:16px;line-height:1.7;color:#555;">
                Use the One-Time Password (OTP) below to
                complete your login.
            </p>

            <!-- OTP -->
            <div style="text-align:center;margin:35px 0;">

                <p
                    style="
                        font-size:15px;
                        color:#6b7280;
                        margin-bottom:10px;
                    "
                >
                    Your Login Verification Code
                </p>

                <div
                    style="
                        display:inline-block;
                        max-width:100%;
                        box-sizing:border-box;
                        background:${brandColor};
                        color:white;
                        padding:15px 25px;
                        border-radius:8px;
                        font-size:28px;
                        font-weight:bold;
                        letter-spacing:8px;
                    "
                >
                    ${otp}
                </div>

            </div>

            <p style="font-size:15px;color:#555;">
                This OTP will expire in
                <strong>5 minutes</strong>.
            </p>

            <p style="font-size:14px;color:#777;line-height:1.6;">
                For your security, never share this code with anyone.
                Our team will never ask you for your OTP.
            </p>

            <p style="font-size:14px;color:#999;line-height:1.6;">
                If you didn't request this login, you can safely ignore
                this email. Your account will remain secure.
            </p>

            <hr style="margin:35px 0;">

            <p
                style="
                    font-size:13px;
                    color:#6b7280;
                    text-align:center;
                "
            >
                © ${new Date().getFullYear()} Abdul's Blogging Application
            </p>

        </div>

    </div>

</body>
</html>
`;

export const verificationEmailTemplate = ({
    userName,
    verificationLink,
}) => `<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Email Verification</title>

<style>

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 40px 20px;
        background: ${lightColor};
        font-family: Arial, sans-serif;
    }

    .email-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    .header {
        background: ${brandColor};
        padding: 30px 20px;
        text-align: center;
    }

    .content {
        padding: 35px;
    }

    .button {
        background: ${brandColor};
        color: white;
        padding: 15px 30px;
        text-decoration: none;
        border-radius: 8px;
        display: inline-block;
        font-weight: bold;
    }

    @media only screen and (max-width: 600px) {

        body {
            padding: 15px 0;
        }

        .email-container {
            width: 100%;
            max-width: 100%;
            border-radius: 0;
        }

        .header {
            padding: 25px 15px;
        }

        .content {
            padding: 25px 20px;
        }

        .button {
            display: block;
            width: 100%;
            text-align: center;
        }

    }

</style>

</head>

<body>

<div class="email-container">

    <div class="header">

        <h1 style="color:white;margin:0;">
            Blogging Application
        </h1>

    </div>

    <div class="content">

        <h2 style="margin-top:0;color:#222;">
            Hello ${userName} 👋🏻
        </h2>

        <p style="font-size:16px;line-height:1.7;color:#555;">
            Thank you for joining our Blogging Application.
            Please verify your email address to activate your account.
        </p>

        <div style="text-align:center;margin:40px 0;">

            <a
                href="${verificationLink}"
                class="button"
            >
                Verify Email
            </a>

        </div>

        <p style="color:#777;">
            This verification link will expire in
            <b>24 hours</b>.
        </p>

        <p style="color:#999;font-size:13px;">
            If you didn't create this account, you can safely ignore this email.
        </p>

    </div>

</div>

</body>

</html>
`;


export const resetPasswordTemplate = ({
    userName,
    resetLink,
}) => `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Reset Password</title>

<style>

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 40px 20px;
        background: #f8fafc;
        font-family: Arial, sans-serif;
    }

    .email-container {
        width: 100%;
        max-width: 600px;
        margin: auto;
        background: white;
        border-radius: 12px;
        overflow: hidden;
    }

    .header {
        background: #dc2626;
        padding: 25px 20px;
        text-align: center;
    }

    .content {
        padding: 35px;
    }

    .button {
        background: #dc2626;
        padding: 15px 28px;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        display: inline-block;
        font-weight: bold;
    }

    @media only screen and (max-width: 600px) {

        body {
            padding: 15px 0;
        }

        .email-container {
            width: 100%;
            max-width: 100%;
            border-radius: 0;
        }

        .header {
            padding: 25px 15px;
        }

        .content {
            padding: 25px 20px;
        }

        .button {
            display: block;
            width: 100%;
            text-align: center;
        }

    }

</style>

</head>

<body>

<div class="email-container">

    <div class="header">

        <h1 style="margin:0;color:white;">
            Reset Password
        </h1>

    </div>

    <div class="content">

        <h2>
            Hello ${userName} 👋🏻
        </h2>

        <p>
            We received a request to reset your password.
        </p>

        <div style="text-align:center;margin:35px 0;">

            <a
                href="${resetLink}"
                class="button"
            >
                Reset Password
            </a>

        </div>

        <p>
            This link expires in
            <b>15 minutes</b>.
        </p>

        <p style="color:#777;">
            If you didn't request this password reset,
            please ignore this email.
        </p>

    </div>

</div>

</body>

</html>
`;


export const welcomeEmailTemplate = ({
    userName,
}) => `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Welcome</title>

<style>

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 40px 20px;
        background: #f8fafc;
        font-family: Arial, sans-serif;
    }

    .email-container {
        width: 100%;
        max-width: 600px;
        margin: auto;
        background: white;
        border-radius: 12px;
        overflow: hidden;
    }

    .header {
        background: ${brandColor};
        padding: 30px 20px;
        text-align: center;
    }

    .content {
        padding: 40px;
    }

    @media only screen and (max-width: 600px) {

        body {
            padding: 15px 0;
        }

        .email-container {
            width: 100%;
            max-width: 100%;
            border-radius: 0;
        }

        .header {
            padding: 25px 15px;
        }

        .content {
            padding: 25px 20px;
        }

    }

</style>

</head>

<body>

<div class="email-container">

    <div class="header">

        <h1 style="color:white;margin:0;">
            🎉 Welcome ${userName}
        </h1>

    </div>

    <div class="content">

        <p>
            Your account has been successfully verified.
        </p>

        <p>
            You can now start writing blogs,
            sharing your knowledge,
            and connecting with readers around the world.
        </p>

        <div style="margin-top:40px;text-align:center;">

            <h2 style="color:${brandColor};">
                Happy Blogging 🚀
            </h2>

        </div>

    </div>

</div>

</body>

</html>
`;


export const deleteBlogOtpTemplate = ({
    userName,
    blogTitle,
    category,
    otp,
}) => `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Delete Blog Confirmation</title>

<style>

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 40px 20px;
        background: #f8fafc;
        font-family: Arial, sans-serif;
    }

    .email-container {
        width: 100%;
        max-width: 600px;
        margin: auto;
        background: white;
        border-radius: 12px;
        overflow: hidden;
    }

    .content {
        padding: 40px;
    }

    .info-box {
        background: #fef2f2;
        border: 1px solid #fecaca;
        padding: 20px;
        border-radius: 10px;
        margin: 30px 0;
        overflow-wrap: anywhere;
    }

    .otp {
        display: block;
        width: 100%;
        max-width: 320px;
        margin: auto;
        background: ${brandColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 8px;
        text-align: center;
        overflow-wrap: anywhere;
    }

    @media only screen and (max-width: 600px) {

        body {
            padding: 15px 0;
        }

        .email-container {
            width: 100%;
            max-width: 100%;
            border-radius: 0;
        }

        .content {
            padding: 25px 20px;
        }

        .otp {
            max-width: 100%;
            font-size: 24px;
            letter-spacing: 6px;
        }

    }

</style>

</head>

<body>

<div class="email-container">

    <div class="content">

        <h1 style="color:#dc2626;">
            🗑️ Delete Blog Confirmation
        </h1>

        <p>
            Hello <strong>${userName}</strong>,
        </p>

        <p>
            We received a request to permanently delete one of your blogs.
            To continue, please use the One-Time Password (OTP) below.
        </p>

        <div class="info-box">

            <p style="margin:0;">
                <strong>Blog Title:</strong>
                ${blogTitle}
            </p>

            <p style="margin:10px 0 0 0;">
                <strong>Category:</strong>
                ${category}
            </p>

        </div>

        <div style="text-align:center;margin:35px 0;">

            <p style="font-size:15px;color:#6b7280;margin-bottom:10px;">
                Your Verification OTP
            </p>

            <div class="otp">
                ${otp}
            </div>

        </div>

        <p>
            This OTP will expire in
            <strong>5 minutes</strong>.
        </p>

        <p>
            If you did not request this action, please ignore this email.
            Your blog will remain safe.
        </p>

        <hr style="margin:40px 0;">

        <p style="font-size:13px;color:#6b7280;text-align:center;">
            © ${new Date().getFullYear()} Abdul's Blogging Application
        </p>

    </div>

</div>

</body>

</html>
`;


export const deleteAccountOtpTemplate = ({
    userName,
    otp,
}) => `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Delete Account Confirmation</title>

<style>

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 40px 20px;
        background: #f8fafc;
        font-family: Arial, sans-serif;
    }

    .email-container {
        width: 100%;
        max-width: 600px;
        margin: auto;
        background: white;
        border-radius: 12px;
        overflow: hidden;
    }

    .content {
        padding: 40px;
    }

    .otp {
        display: block;
        width: 100%;
        max-width: 320px;
        margin: auto;
        background: #dc2626;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 8px;
        text-align: center;
        overflow-wrap: anywhere;
    }

    @media only screen and (max-width: 600px) {

        body {
            padding: 15px 0;
        }

        .email-container {
            width: 100%;
            max-width: 100%;
            border-radius: 0;
        }

        .content {
            padding: 25px 20px;
        }

        .otp {
            max-width: 100%;
            font-size: 24px;
            letter-spacing: 6px;
        }

    }

</style>

</head>

<body>

<div class="email-container">

    <div class="content">

        <h1 style="color:#dc2626;">
            ⚠️ Delete Account Confirmation
        </h1>

        <p>
            Hello <strong>${userName}</strong>,
        </p>

        <p>
            We received a request to permanently delete your account from
            <strong>Abdul's Blogging Application</strong>.
        </p>

        <p>
            This action is irreversible. All your blogs, comments,
            profile information, and account data will be permanently removed.
        </p>

        <div style="text-align:center;margin:40px 0;">

            <p style="font-size:15px;color:#6b7280;margin-bottom:10px;">
                Your Verification OTP
            </p>

            <div class="otp">
                ${otp}
            </div>

        </div>

        <p>
            This OTP will expire in
            <strong>5 minutes</strong>.
        </p>

        <p>
            If you did not request this action, simply ignore this email.
            Your account will remain secure.
        </p>

        <hr style="margin:40px 0;">

        <p style="font-size:13px;color:#6b7280;text-align:center;">
            © ${new Date().getFullYear()} Abdul's Blogging Application
        </p>

    </div>

</div>

</body>

</html>
`;