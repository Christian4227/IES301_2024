import { PrismaClient, Role } from "@prisma/client";
import UserRepository from "./repositories/user.repository";
import { hashPassword } from "./utils/hash";
import prisma from "./repositories/prisma";
const createTicketTypes = async (prisma: PrismaClient) => {
    const ticketTypes = [
        {
            "name": "Ingresso Comum",
            "discount": 0,
            "description": "Ingresso regular sem desconto."
        },
        {
            "name": "Meia-Entrada para Estudantes",
            "discount": 50,
            "description": "Ingresso com desconto para estudantes."
        },
        {
            "name": "Ingresso VIP",
            "discount": 20,
            "description": "Ingresso VIP com benefícios adicionais."
        },
        {
            "name": "Meia-Entrada para Idosos",
            "discount": 30,
            "description": "Ingresso com desconto para idosos."
        },
        {
            "name": "Especial",
            "discount": 15,
            "description": "Ingresso com desconto especial."
        }
    ]
    const storedTicketTypesCount = await prisma.ticketType.count();
    if (storedTicketTypesCount <= ticketTypes.length) {
        await prisma.ticketType.createMany({
            data: ticketTypes
        });
    }
};

const createVenues = async (prismaCliente: PrismaClient) => {
    // await prisma.venue.deleteMany({});
    const venues = [
        {
            "name": "Maracanã",
            "address_type": "Avenida",
            "address": "Avenida Presidente Castelo Branco",
            "number": "Portão 3",
            "zip_code": "20271-130",
            "city": "Rio de Janeiro",
            "uf": "RJ",
            "country": "BRASIL",
            "complements": "Maracanã"
        },
        {
            "name": "Allianz Parque",
            "address_type": "Rua",
            "address": "Rua Palestra Itália",
            "number": "200",
            "zip_code": "05005-030",
            "city": "São Paulo",
            "uf": "SP",
            "country": "BRASIL",
            "complements": "Perdizes"
        },
        {
            "name": "Mineirão",
            "address_type": "Avenida",
            "address": "Avenida Antônio Abrahão Caram",
            "number": "1001",
            "zip_code": "31275-000",
            "city": "Belo Horizonte",
            "uf": "MG",
            "country": "BRASIL",
            "complements": "Pampulha"
        },
        {
            "name": "Arena Fonte Nova",
            "address_type": "Ladeira",
            "address": "Ladeira da Fonte das Pedras",
            "number": "S/N",
            "zip_code": "40050-565",
            "city": "Salvador",
            "uf": "BA",
            "country": "BRASIL",
            "complements": "Nazaré"
        },
        {
            "name": "Arena da Baixada",
            "address_type": "Rua",
            "address": "Rua Buenos Aires",
            "number": "1260",
            "zip_code": "80250-070",
            "city": "Curitiba",
            "uf": "PR",
            "country": "BRASIL",
            "complements": "Água Verde"
        },
        {
            "name": "Arena Pernambuco",
            "address_type": "Avenida",
            "address": "Avenida Deus é Fiel",
            "number": "S/N",
            "zip_code": "54753-510",
            "city": "São Lourenço da Mata",
            "uf": "PE",
            "country": "BRASIL",
            "complements": "Cidade da Copa"
        },
        {
            "name": "Beira-Rio",
            "address_type": "Avenida",
            "address": "Avenida Padre Cacique",
            "number": "891",
            "zip_code": "90810-240",
            "city": "Porto Alegre",
            "uf": "RS",
            "country": "BRASIL",
            "complements": "Praia de Belas"
        },
        {
            "name": "Estádio Olímpico Nilton Santos",
            "address_type": "Rua",
            "address": "Rua José dos Reis",
            "number": "425",
            "zip_code": "20921-320",
            "city": "Rio de Janeiro",
            "uf": "RJ",
            "country": "BRASIL",
            "complements": "Engenho de Dentro"
        },
        {
            "name": "Morumbi",
            "address_type": "Praça",
            "address": "Praça Roberto Gomes Pedrosa",
            "number": "1",
            "zip_code": "05653-070",
            "city": "São Paulo",
            "uf": "SP",
            "country": "BRASIL",
            "complements": "Morumbi"
        },
        {
            "name": "Arena Castelão",
            "address_type": "Avenida",
            "address": "Avenida Alberto Craveiro",
            "number": "2901",
            "zip_code": "60860-212",
            "city": "Fortaleza",
            "uf": "CE",
            "country": "BRASIL",
            "complements": "Castelão"
        }
    ]
    const storedVenuesCount = await prismaCliente.venue.count()
    if (storedVenuesCount !== venues.length) {
        await prismaCliente.venue.createMany({
            data: venues
        });
    }
}


const createCategories = async (prismaCliente: PrismaClient) => {
    try {
        await prismaCliente.category.createMany({
            data: [
                { name: "Música", description: "Eventos relacionados a apresentações musicais e shows." },
                { name: "Esportes", description: "Eventos esportivos incluindo futebol, basquete, etc." },
                { name: "Tecnologia", description: "Conferências de tecnologia, hackathons e workshops." },
                { name: "Arte", description: "Exposições de arte, oficinas de pintura e mais." },
                { name: "Educação", description: "Eventos educacionais, seminários e palestras." },
                { name: "Gastronomia", description: "Festivais de comida, degustações e competições culinárias." },
                { name: "Moda", description: "Desfiles de moda, lançamentos de coleções e exposições de moda." }
            ]
        });
        console.log("Categorias criadas com sucesso!");
    } catch (error) {
        console.error("Erro ao criar categorias:", error);
    }
}








const userRepo = new UserRepository();
const usersToCreate = [
    {
        "email": "root@ticketeasypro.com.br",
        "password": "fatec123#1sem.2024",
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
        "password": "fatec123_2#1sem.2024",
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
        "password": "maNaGeR1-2_3#2024&*",
        "email_confirmed": true,
        "birth_date": new Date("1990-05-15"),
        "name": "Manager",
        "salt": "as1da561sd5as1da56s4d",
        "phone": "5489-2022",
        "role": Role.EVENT_MANAGER
    },
    {
        "email": "staff@ticketeasypro.com.br",
        "password": "sTaFf-2_3#2024&*",
        "email_confirmed": true,
        "birth_date": new Date("1995-03-21"),
        "name": "Staff Member",
        "salt": "as1da561sd5as1da56s4d",
        "phone": "9135-2023",
        "role": Role.STAFF
    },
    {
        "email": "staff@ticketeasypro.com.br",
        "password": "sTaFf-2_3#2024&*",
        "email_confirmed": true,
        "birth_date": new Date("1995-03-21"),
        "name": "Staff Member",
        "salt": "as1da561sd5as1da56s4d",
        "phone": "9135-2023",
        "role": Role.STAFF
    },
    {
        email: "staff1@ticketeasypro.com.br",
        password: "stAff123!",
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
        password: "sEcure456@",
        email_confirmed: true,
        birth_date: new Date("1987-03-16"),
        name: "Staff Two",
        salt: "5df4DFG4",
        phone: "2345-6789",
        role: Role.STAFF
    },
    {
        email: "staff3@ticketeasypro.com.br",
        password: "paSs789*",
        email_confirmed: true,
        birth_date: new Date("1988-04-17"),
        name: "Staff Three",
        salt: "7gH54Fgd1",
        phone: "3456-7890",
        role: Role.STAFF
    },
    {
        email: "staff4@ticketeasypro.com.br",
        password: "wOrd012#",
        email_confirmed: true,
        birth_date: new Date("1989-05-18"),
        name: "Staff Four",
        salt: "tR456hgT",
        phone: "4567-8901",
        role: Role.STAFF
    },
    {
        "email": "staff5@ticketeasypro.com.br",
        "password": "secure234%",
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
        "password": "Manager123!",
        "email_confirmed": true,
        "birth_date": new Date("1981-07-20"),
        "name": "Manager One",
        "salt": "M1a2n3a4g5e6r7",
        "phone": "1122-3344",
        "role": Role.EVENT_MANAGER
    },
    {
        "email": "manager2@ticketeasypro.com.br",
        "password": "Password234!",
        "email_confirmed": true,
        "birth_date": new Date("1982-08-21"),
        "name": "Manager Two",
        "salt": "M2a2n2a2g2e2r2",
        "phone": "2233-4455",
        "role": Role.EVENT_MANAGER
    },
    {
        "email": "manager3@ticketeasypro.com.br",
        "password": "SecurePass345!",
        "email_confirmed": true,
        "birth_date": new Date("1983-09-22"),
        "name": "Manager Three",
        "salt": "M3a3n3a3g3e3r3",
        "phone": "3344-5566",
        "role": Role.EVENT_MANAGER
    },
    {
        "email": "manager4@ticketeasypro.com.br",
        "password": "ManagerPassword456!",
        "email_confirmed": true,
        "birth_date": new Date("1984-10-23"),
        "name": "Manager Four",
        "salt": "M4a4n4a4g4e4r4",
        "phone": "4455-6677",
        "role": Role.EVENT_MANAGER
    },
    {
        "email": "manager5@ticketeasypro.com.br",
        "password": "BestManager567!",
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
export const initialData = async () => {
    await createTicketTypes(prisma);
    await createVenues(prisma);
    await createCategories(prisma);

    for (const account of usersToCreate) {
        try {
            const { email, password, role, ...rest } = account;
            const { hash, salt } = hashPassword(password);
            const result = await userRepo.create({ ...rest, role, email, salt, password: hash });

            const userCreated = await userRepo.create(account);
            console.log('Usuário criado:', userCreated);
        } catch (error) {
            console.error(`Usuário ${account.email} já existe.\nErro:${error}`);
        }
    };

}
