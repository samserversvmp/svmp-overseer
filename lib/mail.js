'use strict';

var
    sam = require('./sam'),
    smtpTransport = require('nodemailer').createTransport("SMTP", {
        host: sam.config.get("smtp:host"),
        port: sam.config.get("smtp:port"),
        secureConnection: sam.config.get("smtp:secure_connection"),
        auth: {
            user: sam.config.get("smtp:username"),
            pass: sam.config.get("smtp:password")
        }
    });


/**
 * Helper to send the mail...
 * @param options
 */
function mailIt(options) {
    /**
     * We only send email if the host field is defined
     */
    if (sam.config.get("smtp:host")) {
        smtpTransport.sendMail(options, function (error, responseStatus) {
            if (error) {
                console.log("Error sending email to user: ", error);
            }
        });
    }
}

/**
 * Send mail to the User (usually on a 'signup' an account approval)
 * @param email
 */
exports.sendToUser = function (email) {
    var opts = {
        from: 'noreplay@samadmin', // sender address
        to: email, // list of receivers
        subject: "sam Account Approved",
        text: "Your sam account has been approved."
    };
    mailIt(opts);
};

/**
 *  Send email to admin as set on the config file.  Usually sent when a user signs up
 */
exports.sendToAdmin = function () {
    var opts = {
        from: 'noreplay@samadmin', // sender address
        to: sam.config.get("smtp:admin_email"),
        subject: "sam: Pending user account",
        text: "A User has registered with sam. Please check the sam admin console for pending sam accounts"
    };
    mailIt(opts);
};