export interface User {
    id: string;
    email: string;
    name: string;
    emailConfirmed?: boolean;
    birth_date: Date;
    phone?: string | null;
    phone_fix?: string | null;
    type: number;
    created_at: Date;
    updated_at: Date;
}


export interface UserCreate {
    email: string;
    name: string;
    birth_date: Date;
    phone: string;
    phone_fix?: string;
}