export function generateOtpHtml(otp) {
    return `
        <div style="max-width: 500px; margin: 40px auto; padding: 30px; background-color: #f9f9f9; border-radius: 8px; text-align: center; font-family: Arial, sans-serif; color: #333; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <h1 style="margin-bottom: 20px; font-size: 24px; color: #2c3e50;">SnapSoil</h1>
            <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
                Your OTP for resetting your password is:
            </p>
            <div style="font-size: 28px; font-weight: bold; margin: 15px 0; color: #1a73e8;">
                ${otp}
            </div>
            <p style="font-size: 14px; color: #555;">
                This OTP is valid for 10 minutes.
            </p>
        </div>
    `;
}

export function successMessage() {
    return `
        <div style="text-align:center;margin-top:40px;">
            <b>Your password has been successfully change.</b><br>
            <p>If you did not request this change, please contact support.</p>
        </div>
    `;
}