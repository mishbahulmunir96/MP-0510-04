"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationTrxEmail = void 0;
// lib/notificationTrxEmail.ts
const notificationTrxEmail = (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Transaction Status Notification</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
              <td align="center" style="padding: 0;">
                  <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
                      <tr>
                          <td align="center" style="padding: 40px 0 30px 0;">
                              <img src="/placeholder.svg?height=50&width=200" alt="Company Logo" style="height: 50px; max-width: 200px;">
                          </td>
                      </tr>
                      <tr>
                          <td style="padding: 36px 30px 42px 30px;">
                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                  <tr>
                                      <td style="padding: 0 0 36px 0; color: #153643;">
                                          <h1 style="font-size: 24px; margin: 0 0 20px 0; font-family: Arial, sans-serif;">Transaction Status Update</h1>
                                          <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Dear ${data.userName},</p>
                                          <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">We're writing to inform you about the status of your recent transaction:</p>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 0;">
                                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                              <tr>
                                                  <td style="width: 260px; padding: 0; vertical-align: top;">
                                                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                          <tr>
                                                              <td style="padding: 0 0 10px 0;">
                                                                  <p style="margin: 0; font-size: 16px; line-height: 24px;"><strong>Transaction ID:</strong> ${data.transactionID}</p>
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td style="padding: 0 0 10px 0;">
                                                                  <p style="margin: 0; font-size: 16px; line-height: 24px;"><strong>Amount:</strong> ${data.amount}</p>
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td style="padding: 0 0 10px 0;">
                                                                  <p style="margin: 0; font-size: 16px; line-height: 24px;"><strong>Date:</strong> ${data.date}</p>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                                  <td style="width: 20px; padding: 0; font-size: 0;">&nbsp;</td>
                                                  <td style="width: 260px; padding: 0; vertical-align: top;">
                                                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                          <tr>
                                                              <td style="padding: 0 0 10px 0;">
                                                                  <p style="margin: 0; font-size: 16px; line-height: 24px;"><strong>Status:</strong></p>
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td style="padding: 0;">
                                                                  ${data.status ===
    "done"
    ? `
                                                                  <p style="margin: 0; font-size: 18px; line-height: 24px; color: #28a745; font-weight: bold;">ACCEPTED</p>
                                                                  `
    : `
                                                                  <p style="margin: 0; font-size: 18px; line-height: 24px; color: #dc3545; font-weight: bold;">REJECTED</p>
                                                                  `}
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 24px 0 0 0; color: #153643;">
                                          ${data.status === "done"
    ? `
                                          <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Great news! Your transaction has been successfully processed and accepted. The funds will be transferred according to the standard processing time.</p>
                                          `
    : `
                                          <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">We regret to inform you that your transaction has been rejected. This could be due to insufficient funds, security concerns, or other issues with the transaction.</p>
                                          `}
                                          <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">If you have any questions or concerns regarding this transaction, please don't hesitate to contact our support team.</p>
                                          <p style="margin: 0; font-size: 16px; line-height: 24px;">Thank you for your business!</p>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td style="padding: 30px; background: #00466a;">
                              <table role="presentation" style="width: 100%; border-collapse: collapse; color: #ffffff; font-size: 14px;">
                                  <tr>
                                      <td style="padding: 0; width: 50%;" align="left">
                                          <p style="margin: 0; font-size: 14px;">&reg; Your Company, 2023<br/><a href="http://www.example.com" style="color: #ffffff; text-decoration: underline;">Visit our website</a></p>
                                      </td>
                                      <td style="padding: 0; width: 50%;" align="right">
                                          <table role="presentation" style="border-collapse: collapse;">
                                              <tr>
                                                  <td style="padding: 0 0 0 10px; width: 38px;">
                                                      <a href="http://www.twitter.com/" style="color: #ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height: auto; display: block; border: 0;" /></a>
                                                  </td>
                                                  <td style="padding: 0 0 0 10px; width: 38px;">
                                                      <a href="http://www.facebook.com/" style="color: #ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height: auto; display: block; border: 0;" /></a>
                                                  </td>
                                              </tr>
                                          </table>
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
  </html>`;
exports.notificationTrxEmail = notificationTrxEmail;
