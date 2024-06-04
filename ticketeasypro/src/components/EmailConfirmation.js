import { useEffect } from 'react';
import { useRouter } from 'next/router';
import client from '@/utils/client_axios';

const EmailConfirmation = ({ token, handleSetMessage, setLoading }) => {
  const router = useRouter();
  const setErrorMessage = (message) => handleSetMessage(message, 'error');
  const setSuccessMessage = (message) => handleSetMessage(message, 'success');


  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        const response = await client.get(`accounts/confirm-email?token=${encodeURIComponent(token)}`);
        if (response.status === 200) {
          setErrorMessage('Email confirmado!');
          setTimeout(() => router.push('/Login'), 1750);
        } else
          handleError(response);

      } catch (error) {
        console.error('Erro na requisição para confirmar token:', error);
        handleError(error.response);
      } finally {
        setLoading(false);
      }
    };

    const handleError = (response) => {
      if (response?.data?.message) {
        const messageError = response.data.message;
        switch (messageError) {
          case 'EmailAlreadyConfirmed':
            setSuccessMessage('Email já confirmado. Faça seu login.');
            setTimeout(() => router.push('/Login'), 3000);
            break;
          case 'InvalidOrExpiredToken':
            setErrorMessage('Seu email de confirmação expirou.');
            setTimeout(() => router.push('/Contas/RecuperarEmail'), 3000);
            break;
          default:
            console.log(response);
            setErrorMessage('Erro desconhecido');
        }
      } else {
        setErrorMessage('Falha ao validar email. Por favor tente novamente.');
      }
    };

    if (token) validateToken();
    else router.push('/Contas/RecuperarEmail');
  }, [token]);

  return null;  // Remova qualquer renderização condicional aqui
};

export default EmailConfirmation;
