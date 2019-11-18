'use strict';
const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
var sendmail = (toEmail,code,subject) => {
  console.log('sending mail lets see');
  return new Promise((resolve, reject) => {

    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_ID, // generated ethereal user
                pass: process.env.EMAIL_PASSWORD // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let subject = code.substring(0,Math.min(code.length, 20));
        console.log(subject);

        let mailOptions = {
            from: '"Feedback abasyn" <qasimali24@gmail.com>', // sender address
            to: toEmail, // list of receivers
            subject: subject, // Subject line
            text: '', // plain text body
            html: `
            ${code}
            ` // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              return reject(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            resolve('Mail sent !');
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });

  })
}


module.exports = {sendmail};
