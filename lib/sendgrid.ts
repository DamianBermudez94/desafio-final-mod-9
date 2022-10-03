import * as sgMail from "@sendgrid/mail";

export async function sendMail({ message, subject, from, to }) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//console.log("soy la api de sendrig",email);


  const emailRes = await sgMail
    .send({
      to,
      from,
      subject,
      text: message,
    })
    .catch((error) => {
      console.error(error);
    });
  if (emailRes) {
    console.log("Soy la api de sendgrid",emailRes);
    
    return { message: "email sent" };
  } else {
    return false;
  }
}