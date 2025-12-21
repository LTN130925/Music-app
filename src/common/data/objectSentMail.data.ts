export const objectSentMailData = (forgotPassword) => {
    return {
        from: `Hỗ trợ nghe nhạc thư giản: <${process.env.EMAIL_USER}>`,
        to: forgotPassword.email,
        subject: 'chuyển mã OTP',
        text: 'chuyển mã OTP để đổi mật khẩu',
        html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8" />
          <title>Mã OTP đổi mật khẩu</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
          <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background:#2ecc71; padding:20px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:22px;">Cửa hàng thực phẩm</h1>
              <p style="margin:5px 0 0; font-size:14px;">Xác nhận đổi mật khẩu</p>
            </div>
        
            <!-- Content -->
            <div style="padding:30px; color:#333333;">
              <p style="font-size:16px;">Xin chào,</p>
        
              <p style="font-size:15px; line-height:1.6;">
                Bạn đã yêu cầu <b>đổi mật khẩu</b> cho tài khoản của mình.
                Vui lòng sử dụng mã OTP bên dưới để tiếp tục:
              </p>
        
              <!-- OTP Box -->
              <div style="margin:30px 0; text-align:center;">
                <span style="
                  display:inline-block;
                  padding:15px 30px;
                  font-size:26px;
                  letter-spacing:4px;
                  font-weight:bold;
                  color:#2ecc71;
                  background:#f0fdf4;
                  border:2px dashed #2ecc71;
                  border-radius:6px;
                ">
                  ${forgotPassword.otp}
                </span>
              </div>
        
              <p style="font-size:14px; color:#555;">
                ⏰ Mã OTP sẽ <b>hết hạn sau 1 phút</b>.
              </p>
        
              <p style="font-size:14px; color:#e74c3c;">
                ⚠️ Vui lòng <b>không chia sẻ mã OTP</b> này cho bất kỳ ai để đảm bảo an toàn tài khoản.
              </p>
        
              <p style="font-size:14px; margin-top:30px;">
                Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.
              </p>
        
              <p style="font-size:14px;">
                Trân trọng,<br />
                <b>Đội ngũ Cửa hàng thực phẩm</b>
              </p>
            </div>
        
            <!-- Footer -->
            <div style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#888;">
              © ${new Date().getFullYear()} Cửa hàng thực phẩm. All rights reserved.
            </div>
          </div>
        </body>
        </html>
    `,
    };
}