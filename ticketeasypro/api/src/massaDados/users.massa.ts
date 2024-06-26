import { EventStatus, PrismaClient, Role } from "@prisma/client";
import UserRepository from "./../repositories/user.repository";
import { hashPassword } from "./../utils/hash";
import prisma from "./../repositories/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import uuid4 from "uuid4";
// import createRandomOrders from "./massaDados/orders.massa";


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
        "email": "client_espectador1@ticketeasypro.com.br",
        "password": "senha123",
        "email_confirmed": true,
        "birth_date": new Date("1990-05-15"),
        "name": "Maria da Silva",
        "salt": "54easdaq56das6d4sdaas5d4",
        "phone": "9999-1234",
        "phone_fix": "95620-1111",
        "role": Role.SPECTATOR
    },
    {
        "email": "client_espectador2@ticketeasypro.com.br",
        "password": "senha123",
        "email_confirmed": true,
        "birth_date": new Date("1988-09-23"),
        "name": "João Pereira",
        "salt": "54easdaq56das6d4sdaas5d4",
        "phone": "9999-5678",
        "phone_fix": "95620-2222",
        "role": Role.SPECTATOR
    },
    {
        "email": "client_espectador3@ticketeasypro.com.br",
        "password": "senha123",
        "email_confirmed": true,
        "birth_date": new Date("1995-12-30"),
        "name": "Ana Oliveira",
        "salt": "54easdaq56das6d4sdaas5d4",
        "phone": "9999-8765",
        "phone_fix": "95620-3333",
        "role": Role.SPECTATOR
    },
    {
        "email": "client_espectador4@ticketeasypro.com.br",
        "password": "senha123",
        "email_confirmed": true,
        "birth_date": new Date("1985-03-05"),
        "name": "Carlos Santos",
        "salt": "54easdaq56das6d4sdaas5d4",
        "phone": "9999-4321",
        "phone_fix": "95620-4444",
        "role": Role.SPECTATOR
    },
    {
        "email": "client_espectador5@ticketeasypro.com.br",
        "password": "senha123",
        "email_confirmed": true,
        "birth_date": new Date("1993-11-17"),
        "name": "Lucia Almeida",
        "salt": "54easdaq56das6d4sdaas5d4",
        "phone": "9999-9876",
        "phone_fix": "95620-5555",
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
        "email": "root2@ticketeasypro.com.br",
        "password": "admin123",
        "email_confirmed": true,
        "birth_date": new Date("1992-07-08"),
        "name": "root 2",
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
    {
        email: "staff1@ticketeasypro.com.br",
        password: "staff123",
        email_confirmed: true,
        birth_date: new Date("1986-02-15"),
        name: "Staff One",
        salt: "sA1d5f6SDF4",
        phone: "1234-5678",
        phone_fix: "12823-5314",
        role: Role.STAFF
    },
    {
        email: "staff2@ticketeasypro.com.br",
        password: "staff123",
        email_confirmed: true,
        birth_date: new Date("1987-03-16"),
        name: "Staff Two",
        salt: "5df4DFG4",
        phone: "2345-6789",
        role: Role.STAFF
    },
    {
        email: "staff3@ticketeasypro.com.br",
        password: "staff123",
        email_confirmed: true,
        birth_date: new Date("1988-04-17"),
        name: "Staff Three",
        salt: "7gH54Fgd1",
        phone: "3456-7890",
        role: Role.STAFF
    },
    {
        email: "staff4@ticketeasypro.com.br",
        password: "staff123",
        email_confirmed: true,
        birth_date: new Date("1989-05-18"),
        name: "Staff Four",
        salt: "tR456hgT",
        phone: "4567-8901",
        role: Role.STAFF
    },
    {
        "email": "staff5@ticketeasypro.com.br",
        "password": "staff123",
        "email_confirmed": true,
        "birth_date": new Date("1990-06-19"),
        "name": "Staff Five",
        "salt": "yU6h78jk",
        "phone": "5678-9012",
        "phone_fix": "118612-1345",
        "role": Role.STAFF
    },
    {
        "email": "manager1@ticketeasypro.com.br",
        "password": "manager123",
        "email_confirmed": true,
        "birth_date": new Date("1981-07-20"),
        "name": "Manager One",
        "salt": "M1a2n3a4g5e6r7",
        "phone": "1122-3344",
        "role": Role.EVENT_MANAGER
    },
    {
        "email": "manager2@ticketeasypro.com.br",
        "password": "manager123",
        "email_confirmed": true,
        "birth_date": new Date("1982-08-21"),
        "name": "Manager Two",
        "salt": "M2a2n2a2g2e2r2",
        "phone": "2233-4455",
        "role": Role.EVENT_MANAGER
    },
    {
        "email": "manager3@ticketeasypro.com.br",
        "password": "manager123",
        "email_confirmed": true,
        "birth_date": new Date("1983-09-22"),
        "name": "Manager Three",
        "salt": "M3a3n3a3g3e3r3",
        "phone": "3344-5566",
        "role": Role.EVENT_MANAGER
    },
    {
        "email": "manager4@ticketeasypro.com.br",
        "password": "manager123",
        "email_confirmed": true,
        "birth_date": new Date("1984-10-23"),
        "name": "Manager Four",
        "salt": "M4a4n4a4g4e4r4",
        "phone": "4455-6677",
        "role": Role.EVENT_MANAGER
    },
    {
        "email": "manager5@ticketeasypro.com.br",
        "password": "manager123",
        "email_confirmed": true,
        "birth_date": new Date("1985-11-24"),
        "name": "Manager Five",
        "salt": "M5a5n5a5g5e5r5",
        "phone": "5566-7788",
        "phone_fix": "115512-3234",
        "role": Role.EVENT_MANAGER
    }
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
            };
        }

    }
}
export default createUsers;