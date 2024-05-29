import styleh from "../../../styles/Home.module.css";
import styles from "../../../styles/CadastroCliente.module.css";
import Cabecalho from "./../../Cabecalho";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:3210/v1/",
  headers: { "Content-Type": "application/json" },
});

const RecuperarEmail = () => {
  const router = useRouter();
  const { query } = router;
  const token = query.token;
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true); // Controla a exibição do formulário
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        // Redirecionar para /RecuperarEmail/index.js se não houver token
        router.push('/RecuperarEmail');
        return;
      }
      try {
        setLoading(true);
        const response = await client.get(`accounts/confirm-email?token=${encodeURIComponent(token)}`);

        if (response.status === 200) {
          setShowForm(false)
          setSuccess('Email confirmado!');
          setTimeout(() => {
            router.push('/Login');
          }, 1750);
        } else if (response.data.error === 'EmailAlreadyConfirmed') {
          setSuccess('Email já confirmado.');
          setTimeout(() => {
            router.push('/Login');
          }, 1750);
        } else if (response.data.error === 'InvalidOrExpiredToken') {
          router.push('/RecuperarEmail');
        } else {
          setError('Erro desconhecido');
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);

        setError('Falha ao validar email. Por favor tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      validateToken();
    }
  }, [token, router]);

  const EnviarEmail = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    // Validate email before sending
    if (!emailRegex.test(email)) {
      setError(''); setSuccess('');
      setError('Por favor, digite um email válido.');
      return;
    }

    try {
      setLoading(true);
      setShowForm(false); // Oculta o formulário durante o envio

      setError(''); setSuccess('');

      const response = await client.get(`accounts/resend-email-confirmation/${email}`);
      if (response.status === 200)
        setSuccess('Email de confirmação reenviado com sucesso!');
      else
        setError('Erro ao reenviar o email de confirmação');

    } catch (error) {
      if (error.response?.data?.message === "EmailAlreadyConfirmed") {
        setSuccess('Email já confirmado.');
      } else if (error.response?.data?.message === "AccountNotFound") {
        setError('Email não encontrado.');
      } else {
        setError('Erro ao reenviar email de confirmação.');
      }
    } finally {
      setLoading(false);
      setShowForm(true); // Mostra o formulário após o término do envio
    }
  };

  return (
    <div>
      <Cabecalho className={styleh.header} />
      <div className={styles.divPrincipal_recuperar_email}>
        <div className="div_container_grande">
          {loading && <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-25 z-50">
            <div className="loader">Loading...</div>
          </div>}
          {showForm && !loading && (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Não recebeu o e-mail de confirmação?</h1>
                <label className="block mb-4">
                  Digite novamente o seu e-mail no campo abaixo.
                  Depois, clique no botão <b>Reenviar</b>.
                </label>
              </div>
              <hr className="mb-4 bg-gray-300" />
              <form onSubmit={EnviarEmail} className="space-y-4">
                <div className="mb-3">
                  <label htmlFor="email" className="block mb-1">Email cadastrado:</label>
                  <input
                    type="email"
                    className="form-control w-full p-2 border border-black border-opacity-25"
                    name="email"
                    id="email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  value="Reenvia"
                  className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Reenviar
                </button>
              </form>
            </>
          )}
          {error && <p className="text-red-500 mt-4 text-lg text-center">{error}</p>}
          {success && <p className="text-green-500 mt-4 text-lg text-center">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default RecuperarEmail;
