import nodemailer from "nodemailer";
// import sgMail from "@sendgrid/mail";
// export const sendMail = async (to: string, subject: string, url: string, name: string) => {
// 	sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
// const html = `
// 		  <html>
// 		    <head>
// 		      <title>Account Verification</title>
// 		    </head>
// 		    <body>
// 		      <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:0; text-align:Center; font-family:sans-serif" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
// 		        <div style="padding:1rem 1rem 0.5rem 1rem">
// 		        <h1> Hello ${name} </h1>
// 		            <p style="font-size:1.5rem; line-height:2rem;">
// 		                We are really glad you choose to use or StockHub service.
// 		                <br>
// 		                This email was sent as a verification step for your account
// 		            </p>
// 		            <p style="font-size:1.5rem">You can verify your email by pressing on <a href="${url}">this</a> link
// 		            </p>
// 		            <hr style="border: solid .2rem #ebba35; width:90%"/>
// 		        </div>
// 		        <p style="font-size:1rem;"> We hope you will be satisfied with our services</p>
// 		        <p style="font-size:1rem"> Best Wishes, StockHub Team.</p>
// 		      </div>
// 		    </body>
// 		  </html>`;
//
// 	const msg = {
// 		to,
// 		from: "rfazizli.projects@gmail.com",
// 		subject,
// 		html,
// 	};
//
// 	try {
// 		await sgMail.send(msg);
// 		console.log("Email sent to " + to);
// 	} catch (error) {
// 		console.error(error);
// 		if (error.response) {
// 			console.error(error.response.body);
// 		}
// 	}
// };
const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "alyce.hoppe1@ethereal.email",
		pass: "mY5DcC3rrFcwqfYMWG",
	},
});

export const sendMail = async (to: string, subject: string, url: string, name: string) => {
	const html = `
		  <html>
		    <head>
		      <title>Account Verification</title>
		    </head>
		    <body>
		      <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:0; text-align:Center; font-family:sans-serif" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
		        <div style="padding:1rem 1rem 0.5rem 1rem">
		        <h1> Hello</h1>
		            <p style="font-size:1.5rem; line-height:2rem;">
		                We are really glad you choose to use or StockHub service.
		                <br>
		                This email was sent as a verification step for your account
		            </p>
		            <p style="font-size:1.5rem">You can verify your email by pressing on <a href="${url}">this</a> link
		            </p>
		            <hr style="border: solid .2rem #ebba35; width:90%"/>
		        </div>
		        <p style="font-size:1rem;"> We hope you will be satisfied with our services</p>
		        <p style="font-size:1rem"> Best Wishes, StockHub Team.</p>
		      </div>
		    </body>
		  </html>`;
	const message = {
		from: "StockHub <rfazizli.projects@gmail.com>",
		to: "Recipient <" + to + ">",
		subject: "Account Verification",
		text: "Hello " + name + " Please verify your account by clicking on the link below",
		html: html,
	};

	transporter.sendMail(message, (err, info) => {
		if (err) {
			console.log("Error occurred. " + err.message);
			return;
		}
		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	});
};
