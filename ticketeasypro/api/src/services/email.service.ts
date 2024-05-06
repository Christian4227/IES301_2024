import { Email } from "../interfaces/email.interface";
import sendEmail from '../utils/sendEmail';
import * as userRepository from "../repositories/user.repository";

class EmailService {
    send = async (email: Email): Promise<String> => {
        const { to, subject, text } = email;

        const verifyIfUserExists = await userRepository.findByEmail(to);
        if (!verifyIfUserExists) {
            throw new Error('User not exists');
        }

        await sendEmail(to, subject, text);

        return "Email enviado!";
    };
}

export default EmailService;