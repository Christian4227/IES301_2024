import { Email } from "../interfaces/email.interface";
import sendEmail from '../utils/sendEmail';
import UserRepository from "../repositories/user.repository";

class EmailService {
    private userRepo: UserRepository;
    constructor() {
        this.userRepo = new UserRepository()
    }

    send = async (email: Email): Promise<String> => {
        const { to, subject, text } = email;

        const verifyIfUserExists = await this.userRepo.find({ email: to });
        if (!verifyIfUserExists) {
            throw new Error('User not exists');
        }
        await sendEmail(to, subject, text);
        return "Email enviado!";
    };
}

export default EmailService;