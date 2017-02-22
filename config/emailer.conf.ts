/**
 * Created by Nick on 2/14/2017.
 */

import {createTransport} from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
let config = require('./config');

export let EmailSettings = config.EMAIL_SETTINGS;

let mailer = createTransport(EmailSettings.TRANSPORT);

mailer.use('compile', hbs({
  viewEngine: {
    extname: '.handlebars',
    // todo move to dist
    layoutsDir: 'src/server/views/email/',
    defaultLayout: 'layout',
    partialsDir: 'src/server/views/partials/'
  },
  viewPath: 'src/server/views/email/',
  extName: '.handlebars'
}));

export default mailer;


/*
  EXAMPLE USE

 let mailOpts = extend(true, {
     to: user.local.email,
     context: {
       forgotUrl: `http://${req.headers['host']}/forgot`
      }
    }, EmailSettings.RESET);

 mailer.sendMail(mailOpts, (err) => {
   if (err) {
      return reject({message: message + ' Unable to send confirmation email', statusCode: 500});
   }
   return resolve(message + ' Confirmation email sent.');
 });
*/
