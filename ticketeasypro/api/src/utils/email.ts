import nodemailer, { Transporter } from 'nodemailer';

// Configuração do transporte
const transporter: Transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // substitua com o host do seu serviço de email
    port: 587, // substitua com a porta do seu serviço de email (geralmente 587 ou 465)
    secure: false, // true para SSL
    auth: {
        user: 'seu-email@example.com', // substitua com o seu email
        pass: 'sua-senha' // substitua com a sua senha
    }
});

export default transporter;