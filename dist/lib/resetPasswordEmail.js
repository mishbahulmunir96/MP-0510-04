"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordTemplate = void 0;
// lib/resetPasswordTemplate.ts
const resetPasswordTemplate = (link) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse">
        <tr>
          <td align="center" style="padding: 0">
            <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
              <tr>
                <td align="center" style="padding: 40px 0 30px 0">
                  <img src="https://via.placeholder.com/200x50" alt="Company Logo" style="height: 50px; max-width: 200px" />
                </td>
              </tr>
              <tr>
                <td style="padding: 36px 30px 42px 30px">
                  <table role="presentation" style="width: 100%; border-collapse: collapse">
                    <tr>
                      <td style="padding: 0 0 36px 0; color: #153643">
                        <h1 style="font-size: 24px; margin: 0 0 20px 0; font-family: Arial, sans-serif;">Reset Your Password</h1>
                        <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">We received a request to reset your password. Don't worry, we've got you covered! Click the button below to set a new password:</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0">
                        <table role="presentation" style="width: 100%; border-collapse: collapse">
                          <tr>
                            <td align="center">
                              <a href="${link}" style="background: #00466a; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display: inline-block; mso-padding-alt: 0; text-underline-color: #00466a;">
                                <span style="mso-text-raise: 10pt; font-weight: bold">Reset Password</span>
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 24px 0 0 0; color: #153643">
                        <p style="margin: 0; font-size: 16px; line-height: 24px">
                          If the button above doesn't work, you can copy and paste the following link into your browser:
                        </p>
                        <p style="margin: 0; font-size: 16px; line-height: 24px;">
                          <a href="${link}" style="color: #00466a; text-decoration: underline;">${link}</a>
                        </p>
                        <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                        <p style="margin: 0; font-size: 16px; line-height: 24px">For security reasons, this link will expire in 20 minutes.</p>
                        
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px; background: #00466a">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; color: #ffffff; font-size: 14px;">
                    <tr>
                      <td style="padding: 0; width: 50%" align="left">
                        <p style="margin: 0; font-size: 14px">&reg; Your Company, 2023<br /><a href="http://www.example.com" style="color: #ffffff; text-decoration: underline">Visit our website</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;
exports.resetPasswordTemplate = resetPasswordTemplate;
