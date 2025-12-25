export const objectSentMailDataClient = (forgotPassword) => {
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
              <h1 style="margin:0; font-size:22px;">Tận hưởng âm thanh</h1>
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
                <b>Đội ngũ Tận hưởng âm thanh</b>
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

export const objectSentMailDataServer = (forgotPassword) => {
    return {
        from: `Security System <${process.env.EMAIL_USER}>`,
        to: forgotPassword.email,
        subject: '[SECURITY] Xác minh yêu cầu thay đổi mật khẩu',
        text: 'Xác minh yêu cầu thay đổi mật khẩu từ hệ thống bảo mật',
        html: `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>Xác minh bảo mật</title>
    </head>
    <body style="margin:0; padding:0; background-color:#eef1f4; font-family: Arial, Helvetica, sans-serif;">
      <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:6px; overflow:hidden; border:1px solid #dcdfe3;">
        
        <!-- Header -->
        <div style="background:#1f2937; padding:18px; text-align:center; color:#ffffff;">
          <h1 style="margin:0; font-size:20px; letter-spacing:0.5px;">
            SECURITY VERIFICATION
          </h1>
          <p style="margin:6px 0 0; font-size:12px; color:#d1d5db;">
            Hệ thống xác thực máy chủ
          </p>
        </div>
    
        <!-- Content -->
        <div style="padding:28px; color:#111827;">
          <p style="font-size:14px;">
            Hệ thống đã ghi nhận <b>yêu cầu thay đổi mật khẩu</b> đối với tài khoản của bạn.
          </p>
    
          <p style="font-size:14px; line-height:1.6;">
            Để xác minh quyền sở hữu tài khoản và hoàn tất quy trình bảo mật,
            vui lòng nhập <b>Mã xác thực một lần (OTP)</b> bên dưới:
          </p>
    
          <!-- OTP Box -->
          <div style="margin:26px 0; text-align:center;">
            <span style="
              display:inline-block;
              padding:14px 28px;
              font-size:24px;
              letter-spacing:5px;
              font-weight:700;
              color:#111827;
              background:#f9fafb;
              border:2px solid #111827;
              border-radius:4px;
            ">
              ${forgotPassword.otp}
            </span>
          </div>
    
          <ul style="font-size:13px; color:#374151; padding-left:18px;">
            <li>Mã OTP có hiệu lực trong <b>60 giây</b>.</li>
            <li>Mã chỉ được sử dụng <b>một lần duy nhất</b>.</li>
            <li>Không cung cấp mã này cho bất kỳ bên thứ ba nào.</li>
          </ul>
    
          <p style="font-size:13px; color:#b91c1c; margin-top:18px;">
            ⚠️ Nếu bạn không thực hiện yêu cầu này, hãy <b>ngay lập tức</b> bỏ qua email
            và kiểm tra lại bảo mật tài khoản.
          </p>
    
          <p style="font-size:13px; margin-top:26px;">
            Email này được gửi tự động từ hệ thống. Vui lòng không trả lời.
          </p>
        </div>
    
        <!-- Footer -->
        <div style="background:#f3f4f6; padding:14px; text-align:center; font-size:11px; color:#6b7280;">
          © ${new Date().getFullYear()} Security Server. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `,
    };
};
