import { useRef, useState } from 'react';
import client from '@/utils/client_axios';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailResendForm = ({ handleSetMessage, setLoading }) => {
  const [email, setEmail] = useState("");

  const setErrorMessage = (message) => handleSetMessage(message, 'error');
  const setSuccessMessage = (message) => handleSetMessage(message, 'success');

  const EnviarEmail = async (event) => {
    event.preventDefault();
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor, digite um email válido.');
      return;
    }

    try {
      setLoading(true);
      const response = await client.get(`accounts/resend-email-confirmation/${email.trim()}`);
      if (response.status === 200)
        setSuccessMessage('Email de confirmação reenviado');
      else
        handleSetMessage('Erro ao reenviar o email de confirmação');
    } catch (error) {
      if (error.response?.data?.message === "EmailAlreadyConfirmed") {
        setSuccessMessage('Email já confirmado.');
      } else if (error.response?.data?.message === "AccountNotFound") {
        setErrorMessage('Email não encontrado.');
      } else {
        setErrorMessage('Erro ao reenviar email de confirmação.');
      }
    } finally {
      setLoading(false);
      setTimeout(setEmail(""), 1500);
    }
  };

  return (
    <form onSubmit={EnviarEmail} className="space-y-4">
      <div className="mb-3">
        <label htmlFor="email" className="block mb-1">Email cadastrado:</label>
        <input
          type="email"
          className="form-control w-full p-2 border border-black border-opacity-25"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" value="Reenvia"
        className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Reenviar</button>
    </form>
  );
};

export default EmailResendForm;
