import nodemailer, { SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_USER!,
        pass: process.env.NODEMAILER_PASS!,
    },
});

// verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error("Email server connection failed:", error);
    } else {
        console.log("Email server is ready to send messages");
    }
});

async function sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string
): Promise<void> {
    try {
        const info: SentMessageInfo = await transporter.sendMail({
            from: `"YourFavBank" <${process.env.NODEMAILER_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

interface RegistrationEmailParams {
    userEmail: string;
    name: string;
}

export async function sendRegistrationEmail({
    userEmail,
    name,
}: RegistrationEmailParams): Promise<void> {
    const subject = "Welcome to YourFavBank!";

    const text = `
Hello ${name},

Thank you for registering at YourFavBank.
We're excited to have you on board.

Best regards,
YourFavBank Team
`;

    const html = `
<p>Hello <b>${name}</b>,</p>
<p>Thank you for registering at <b>YourFavBank</b>.</p>
<p>We're excited to have you on board.</p>
<p>Best regards,<br/>YourFavBank Team</p>
`;

    await sendEmail(userEmail, subject, text, html);
}

interface TransactionEmailParams {
    userEmail: string;
    name: string;
    amount: number;
    toAccount: string;
}

export async function sendTransactionEmail({
    userEmail,
    name,
    amount,
    toAccount,
}: TransactionEmailParams): Promise<void> {
    const subject = "Transaction Successful";

    const text = `
Hello ${name},

Your transaction of $${amount} to account ${toAccount} was successful.

YourFavBank
`;

    const html = `
<p>Hello <b>${name}</b>,</p>
<p>Your transaction of <b>$${amount}</b> to account <b>${toAccount}</b> was successful.</p>
<p>YourFavBank</p>
<p>${Date.now()}</p>
`;

    await sendEmail(userEmail, subject, text, html);
}

interface TransactionFailureEmailParams {
    userEmail: string;
    name: string;
    amount: number;
    toAccount: string;
}

export async function sendTransactionFailureEmail({
    userEmail,
    name,
    amount,
    toAccount,
}: TransactionFailureEmailParams): Promise<void> {
    const subject = "Transaction Failed";

    const text = `
Hello ${name},

Your transaction of $${amount} to account ${toAccount} has failed.
Please try again later.

YourFavBank
`;

    const html = `
<p>Hello <b>${name}</b>,</p>
<p>Your transaction of <b>$${amount}</b> to account <b>${toAccount}</b> has <span style="color:red;">failed</span>.</p>
<p>Please try again later.</p>
<p>YourFavBank</p>
`;

    await sendEmail(userEmail, subject, text, html);
}