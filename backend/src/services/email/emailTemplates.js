const brandColor = "#2563eb";
const lightColor = "#f8fafc";

export const verificationEmailTemplate = ({
    userName,
    verificationLink
}) => `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Email Verification</title>
</head>

<body style="margin:0;padding:40px;background:${lightColor};font-family:Arial,sans-serif;">

<div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,.1);">

<div style="background:${brandColor};padding:30px;text-align:center;">
<h1 style="color:white;margin:0;">
 Blogging Application
</h1>
</div>

<div style="padding:35px;">

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
style="
background:${brandColor};
color:white;
padding:15px 30px;
text-decoration:none;
border-radius:8px;
display:inline-block;
font-weight:bold;
">
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
    resetLink
}) => `
<!DOCTYPE html>

<html>

<body style="margin:0;padding:40px;background:#f8fafc;font-family:Arial;">

<div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;">

<div style="background:#dc2626;padding:25px;text-align:center;">

<h1 style="margin:0;color:white;">
Reset Password
</h1>

</div>

<div style="padding:35px;">

<h2>Hello ${userName} </h2>

<p>
We received a request to reset your password.
</p>

<div style="text-align:center;margin:35px 0;">

<a
href="${resetLink}"
style="
background:#dc2626;
padding:15px 28px;
color:white;
text-decoration:none;
border-radius:8px;
display:inline-block;
font-weight:bold;
">

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
    userName
}) => `
<!DOCTYPE html>

<html>

<body style="background:#f8fafc;padding:40px;font-family:Arial;">

<div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:12px;">

<h1 style="color:#2563eb;">
🎉 Welcome ${userName}
</h1>

<p>
Your account has been successfully verified.
</p>

<p>
You can now start writing blogs,
sharing your knowledge,
and connecting with readers around the world.
</p>

<div style="margin-top:40px;text-align:center;">

<h2 style="color:#2563eb;">
Happy Blogging 🚀
</h2>

</div>

</div>

</body>

</html>
`;



export const deleteBlogOtpTemplate = ({
    userName,
    blogTitle,
    category,
    otp
}) => `
<!DOCTYPE html>

<html>

<body style="background:#f8fafc;padding:40px;font-family:Arial;">

<div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:12px;">

<h1 style="color:#dc2626;">
🗑️ Delete Blog Confirmation
</h1>

<p>
Hello<strong> ${userName}</strong>,
</p>

<p>
We received a request to permanently delete one of your blogs.
To continue, please use the One-Time Password (OTP) below.
</p>

<div style="background:#fef2f2;border:1px solid #fecaca;padding:20px;border-radius:10px;margin:30px 0;">

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

<div style="display:inline-block;background:#2563eb;color:white;padding:15px 35px;border-radius:8px;font-size:28px;font-weight:bold;letter-spacing:8px;">
${otp}
</div>

</div>

<p>
This OTP will expire in <strong>5 minutes</strong>.
</p>

<p>
If you did not request this action, please ignore this email. Your blog will remain safe.
</p>

<hr style="margin:40px 0;">

<p style="font-size:13px;color:#6b7280;text-align:center;">
© ${new Date().getFullYear()} Abdul's Blogging Application
</p>

</div>

</body>

</html>
`;


export const deleteAccountOtpTemplate = ({
    userName,
    otp
}) => `
<!DOCTYPE html>

<html>

<body style="background:#f8fafc;padding:40px;font-family:Arial;">

<div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:12px;">

<h1 style="color:#dc2626;">
⚠️ Delete Account Confirmation
</h1>

<p>
Hello<strong> ${userName}</strong>,
</p>

<p>
We received a request to permanently delete your account from
<strong>Abdul's Blogging Application</strong>.
</p>

<p>
This action is irreversible. All your blogs, comments, profile information, and account data will be permanently removed.
</p>

<div style="text-align:center;margin:40px 0;">

<p style="font-size:15px;color:#6b7280;margin-bottom:10px;">
Your Verification OTP
</p>

<div style="display:inline-block;background:#dc2626;color:white;padding:15px 35px;border-radius:8px;font-size:28px;font-weight:bold;letter-spacing:8px;">
${otp}
</div>

</div>

<p>
This OTP will expire in <strong>5 minutes</strong>.
</p>

<p>
If you did not request this action, simply ignore this email. Your account will remain secure.
</p>

<hr style="margin:40px 0;">

<p style="font-size:13px;color:#6b7280;text-align:center;">
© ${new Date().getFullYear()} Abdul's Blogging Application
</p>

</div>

</body>

</html>
`;

