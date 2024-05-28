import transporter from './email'

const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    try {
        // Configurações do email
        const mailOptions = {
            from: process.env.EMAIL_ACCOUNT as string, // substitua com o seu email
            to,
            subject,
            text
        };

        // Envia o email
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar o email:', error);
    }
}

export default sendEmail;