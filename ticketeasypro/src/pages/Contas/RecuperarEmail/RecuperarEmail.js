import styleh from "../../../styles/Home.module.css";
import styles from "../../../styles/CadastroCliente.module.css";
import Cabecalho from "./../../Cabecalho";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import certo from "../../../assets/ticky_verde.png";
import erro from "../../../assets/x_vermelho.png";
import CabecalhoHomeMenu from "@/pages/CabecalhoHomeMenu";
import client from "@/utils/client_axios";

export default function RecuperarEmail() {
    const router = useRouter();
    const { query } = router;
    const token = query.token;
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [emailconfirmado, setEmailConfirmado] = useState(false);
    const [emailNaoConfirmado, setEmailNaoConfirmado] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(true); // Controla a exibição do formulário
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                // Redirecionar para /RecuperarEmail/index.js se não houver token
                router.push("/RecuperarEmail");
                return;
            }
            try {
                setLoading(true);
                const response = await client.get(
                    `accounts/confirm-email?token=${encodeURIComponent(token)}`
                );

                if (response.status === 200) {
                    setShowForm(false);
                    setEmailConfirmado("Email confirmado!");
                    setTimeout(() => {
                        router.push("/Login");
                    }, 4000);
                } else if (response.data.error === "EmailAlreadyConfirmed") {
                    setEmailConfirmado("Email já confirmado.");
                    setTimeout(() => {
                        router.push("/Login");
                    }, 6000);
                } else if (response.data.error === "InvalidOrExpiredToken") {
                    router.push("/RecuperarEmail");
                } else {
                    setEmailNaoConfirmado("Erro desconhecido");
                }
            } catch (error) {
                console.error("Erro ao validar token:", error);

                setEmailNaoConfirmado(
                    "Falha ao validar email. Por favor tente novamente."
                );
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
            setError("");
            setSuccess("");
            setError("Por favor, digite um email válido.");
            return;
        }

        try {
            setLoading(true);
            setShowForm(false); // Oculta o formulário durante o envio

            setError("");
            setSuccess("");

            const response = await client.get(
                `accounts/resend-email-confirmation/${email}`
            );
            if (response.status === 200)
                setSuccess("Email de confirmação reenviado com sucesso!");
            else setError("Erro ao reenviar o email de confirmação");
        } catch (error) {
            if (error.response?.data?.message === "EmailAlreadyConfirmed") {
                setSuccess("Email já confirmado.");
            } else if (error.response?.data?.message === "AccountNotFound") {
                setError("Email não encontrado.");
            } else {
                setError("Erro ao reenviar email de confirmação.");
            }
        } finally {
            setLoading(false);
            setShowForm(true); // Mostra o formulário após o término do envio
        }
        setTimeout(() => {
            setSuccess(false);
            setError(false);
        }, 4000);
    };

    return (
        <div>
            <Cabecalho className={styleh.header} />
            <CabecalhoHomeMenu componente="Recuperar Email" />
            <div className={styles.divPrincipal_recuperar_email}>
                <div className="div_container_grande">
                    {loading && (
                        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-25 z-50">
                            <div className="loader">Loading...</div>
                        </div>
                    )}
                    {showForm && !loading && (
                        <>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold mb-4">
                                    Não recebeu o e-mail de confirmação?
                                </h1>
                                <label className="block mb-4">
                                    Digite novamente o seu e-mail no campo
                                    abaixo. Depois, clique no botão{" "}
                                    <b>Reenviar</b>.
                                </label>
                            </div>
                            <hr className="mb-4 bg-gray-300" />
                            <form onSubmit={EnviarEmail} className="space-y-4">
                                <div className="mb-3">
                                    <label
                                        htmlFor="email"
                                        className="block mb-1"
                                    >
                                        Email cadastrado:
                                    </label>
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
                    {error && (
                        <div
                            id="divMensagemErro"
                            className={styles.Mensagem_erro}
                        >
                            <div className={styles.Mensagem_erro_imagem}>
                                <Image
                                    src={erro}
                                    alt="erro"
                                    className={styles.erro}
                                />
                            </div>
                            <div className={styles.Mensagem_erro_texto}>
                                <h1>{error}</h1>
                                <p>
                                    Verifique se os seus dados e o seu e-mail
                                    estão certos.
                                </p>
                            </div>
                        </div>
                    )}
                    {success && (
                        <div
                            id="divMensagemSucesso"
                            className={styles.Mensagem_sucesso}
                        >
                            <div className={styles.Mensagem_sucesso_imagem}>
                                <Image
                                    src={certo}
                                    alt="certo"
                                    className={styles.tick_verde}
                                />
                            </div>
                            <div className={styles.Mensagem_sucesso_texto}>
                                <h1>{success}</h1>
                                <p>
                                    Verifique na sua caixa de mensagens o e-mail
                                    de confirmação e clique no botão no final da
                                    mensagem. Se já confirmou o seu cadastro,
                                    ignore esta mensagem.
                                </p>
                            </div>
                        </div>
                    )}
                    {emailNaoConfirmado && (
                        <div className={styles.Mensagem_erro}>
                            <div className={styles.Mensagem_erro_imagem}>
                                <Image
                                    src={erro}
                                    alt="erro"
                                    className={styles.erro}
                                />
                            </div>
                            <div className={styles.Mensagem_erro_texto}>
                                <h1>{emailNaoConfirmado}</h1>
                                <p>Tente novamente mais tarde.</p>
                            </div>
                        </div>
                    )}
                    {emailconfirmado && (
                        <div
                            id="divMensagemSucesso"
                            className={styles.Mensagem_sucesso}
                        >
                            <div className={styles.Mensagem_sucesso_imagem}>
                                <Image
                                    src={certo}
                                    alt="certo"
                                    className={styles.tick_verde}
                                />
                            </div>
                            <div className={styles.Mensagem_sucesso_texto}>
                                <h1>{emailconfirmado}</h1>
                                <p>
                                    Agora pode entrar no nosso sistema e
                                    acompanhar todo o processo de compra dos
                                    ingressos e os seus dados.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
