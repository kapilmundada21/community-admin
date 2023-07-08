import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {

    if (req.method !== 'POST') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
    
    try {
        await sendgrid.send({
            to: req.body.to,
            from: {
                name: "Kapil Mundada",
                email: "kapilmundada21@gmail.com",
            },
            subject: "Set Password",
            text: "HTML not supported",
            html: `
                        <h2>Greetings</h2>
                        <p>
                            Your account has been sucessfully created. 
                            please find below link to set your password.
                        </p>
                        <p>
                            Click here to set password -  
                            <a href="${process.env.NEXT_PUBLIC_ADMIN_HOST}/resetpassword?token=${req.body.token}">set password</a>
                        </p>
                        <p>
                            <strong>Note: </strong>  
                            This link is valid for only 24hrs.
                        </p>
                    `,
        });
    } catch (error) {
        // console.error(error);
        return res.status(error.statusCode || 500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, error: "" });
}

export default sendEmail;