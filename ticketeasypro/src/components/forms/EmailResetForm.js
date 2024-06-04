import React, { useState } from "react";
import client from "@/utils/client_axios";

const EmailResetForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await client.post('/api/request-reset-password', { email });

            if (response.status === 200) {
                setMessage('Link para redefinição de senha enviado para o email.');
            } else {
                setMessage('Erro ao enviar o email de redefinição de senha.');
            }
        } catch (error) {
            setMessage('Erro ao enviar o email de redefinição de senha.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
            <label className="block mb-2">
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 mt-1 border rounded"
                />
            </label>
            <button type="submit" className="w-full p-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700">
                Enviar link de redefinição
            </button>
            {message && <p className="mt-4 text-center">{message}</p>}
        </form>
    );
};

export default EmailResetForm;
