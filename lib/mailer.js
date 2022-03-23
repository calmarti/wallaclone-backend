'use strict';
const nodemailer = require('nodemailer');

const mailer = {
  sendEmail(emailOptions) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAILER_SENDER,
        pass: process.env.MAILER_PASSWORD,
      },
    });
    transporter.sendMail(emailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
};

module.exports = mailer;
