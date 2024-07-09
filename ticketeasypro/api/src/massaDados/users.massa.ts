import { Role } from "@prisma/client";
import UserRepository from "./../repositories/user.repository";
import { hashPassword } from "./../utils/hash";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


const userRepo = new UserRepository();
const usersToCreate = [
    {
        "email": "client_espectador@ticketeasypro.com.br",
        "password": "senha123",
        "email_confirmed": true,
        "birth_date": new Date("1992-07-08"),
        "name": "fulano de tal",
        "salt": "54easdaq56das6d4sdaas5d4",
        "phone": "9999-2021",
        "phone_fix": "95620-5687",
        "role": Role.SPECTATOR
    },
    {
        "email": "root@ticketeasypro.com.br",
        "password": "admin123",
        "email_confirmed": true,
        "birth_date": new Date("1992-07-08"),
        "name": "root",
        "salt": "54eq56das6d4as5d4",
        "phone": "9999-2021",
        "phone_fix": "95620-5687",
        "role": Role.ADMIN
    },
    {
        "email": "manager@ticketeasypro.com.br",
        "password": "manager123",
        "email_confirmed": true,
        "birth_date": new Date("1990-05-15"),
        "name": "Manager",
        "salt": "as1da561sd5as1da56s4d",
        "phone": "5489-2022",
        "role": Role.EVENT_MANAGER
    },
    {
        "email": "staff@ticketeasypro.com.br",
        "password": "staff123",
        "email_confirmed": true,
        "birth_date": new Date("1995-03-21"),
        "name": "Staff Member",
        "salt": "as1da561sd5as1da56s4d",
        "phone": "9135-2023",
        "role": Role.STAFF
    },
];

// Função que inicia logo após API estar online, cria dados para teste
const createUsers = async () => {

    for (const account of usersToCreate) {
        try {
            const { email, password, role, ...rest } = account;
            const { hash, salt } = hashPassword(password);
            const userCreated = await userRepo.create({ ...rest, role, email, salt, password: hash });

            console.log('Usuário criado:', userCreated);
        } catch (error) {
            if ((error instanceof PrismaClientKnownRequestError)) {
                if (error.code === 'P2002') {
                    console.error(`Usuário de Teste ${account.email} já existe.`);
                } else {
                    throw error;
                }
            }
        }

    }
}
export default createUsers;