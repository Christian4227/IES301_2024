import React, { useState } from "react";
import Cabecalho from "./Cabecalho";
import styles from "../styles/CadastroCliente.module.css";
import styleh from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Menu from "./Menu";
import certo from "../assets/ticky_verde.png";
import erro from "../assets/x_vermelho.png";
import Image from "next/image";
import Link from "next/link";

export default function TelaCadastroCliente() {
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [celular, setCelular] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [novaSenha, setNovaSenha] = useState("");

    function MascaraContato(tipo, value) {
        if (tipo == "Telefone") {
            value = value.replace(/\D/g, "");
            value = value.replace(/(\d{2})(\d)/, "($1) $2");
            value = value.replace(/(\d)(\d{4})$/, "$1-$2");
            setTelefone(value);
        } else {
            value = value.replace(/\D/g, "");
            value = value.replace(/(\d{2})(\d)/, "($1) $2");
            value = value.replace(/(\d{5})(\d{4})$/, "$1-$2");
            setCelular(value);
        }

        return value;
    }

    function InserirDados() {
        if (
            nome.length == 0 ||
            telefone.length == 0 ||
            celular.length == 0 ||
            dataNascimento == "" ||
            email.length == 0 ||
            senha.length == 0 ||
            novaSenha.length == 0
        ) {
            alert("Algum campo do formulário não foi preenchido.");
            return;
        }

        if (senha != novaSenha) {
            alert("As senhas não correspondem.");
            return;
        }

        var dataNascimentoC = new Date(dataNascimento);
        dataNascimentoC = dataNascimentoC.toISOString().slice(0, 19) + "Z";

        let data = JSON.stringify({
            email: email,
            password: senha,
            confirm_password: novaSenha,
            email_confirmed: true,
            name: nome,
            birth_date: dataNascimentoC,
            phone: celular,
            phone_fix: telefone,
        });
        /*
        let dataEmail = JSON.stringify({
            to: email,
            subject: "Envio de confirmação: Ticket Easy Pro",
            text: "",
        });
        */
        axios
            .post("http://localhost:3210/v1/users/signin", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(() => {
                alert("Dados cadastrados com sucesso!");
                document.getElementById("divMensagemSucesso").style.display =
                    "";
                setTimeout(() => {
                    document.getElementById(
                        "divMensagemSucesso"
                    ).style.display = "";
                }, 7000);
                // Começa a requisição para enviar o e-mail
                /*
                axios
                    .post(
                        "http://localhost:3210/v1/users/send-email",
                        dataEmail,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    )
                    // Se obter sucesso na hora de enviar o e-mail
                    .then(() => {
                        document.getElementById(
                            "divMensagemSucesso"
                        ).style.display = "";
                        setTimeout(() => {
                            document.getElementById(
                                "divMensagemSucesso"
                            ).style.display = "";
                        }, 7000);
                    })
                    // Caso dê algum erro na hora de enviar o e-mail
                    .catch(() => {
                        document.getElementById(
                            "divMensagemErro"
                        ).style.display = "";
                        setTimeout(() => {
                            document.getElementById(
                                "divMensagemErro"
                            ).style.display = "";
                        }, 7000);
                    });
                // Termina
                */
            })
            .catch((error) => {
                alert("Erro na requisição: " + error);
            });
    }
    return (
        <main>
            <div id="div-principal">
                <Cabecalho className={styleh.header} />
                <div className={styles.div_cadastrar}>
                    <form className="div_container_grande">
                        <div className={styles.cabecalho_cadastro}>
                            <b>
                                <h1>Cadastro das informações</h1>
                            </b>
                            <label>
                                Insira os seus dados para se inscrever nos
                                eventos
                            </label>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="exampleInputEmail1"
                                className="form-label"
                            >
                                Nome completo
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="InputNomeCompleto"
                                aria-describedby="emailHelp"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>
                        <div
                            className="mb-3"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: "20px",
                            }}
                        >
                            <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                            >
                                Telefone
                            </label>
                            <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                            >
                                Celular
                            </label>
                            <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                            >
                                Data de nascimento
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="InputTelefone"
                                maxLength={14}
                                onChange={(e) =>
                                    MascaraContato("Telefone", e.target.value)
                                }
                                value={telefone}
                            />
                            <input
                                type="tel"
                                className="form-control"
                                id="InputCelular"
                                maxLength={15}
                                onChange={(e) =>
                                    MascaraContato("Celular", e.target.value)
                                }
                                value={celular}
                            />
                            <input
                                type="date"
                                className="form-control"
                                id="InputDataNascimento"
                                value={dataNascimento}
                                onChange={(e) =>
                                    setDataNascimento(e.target.value)
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                            >
                                E-mail
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="InputEmail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                            >
                                Senha
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="InputSenha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                            <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                            >
                                Repetir senha
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="InputNovaSenha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                            />
                        </div>
                        <input
                            type="button"
                            className="btn btn-primary"
                            onClick={() => InserirDados()}
                            defaultValue="Cadastrar"
                        />
                        <div className={styles.footer_form}>
                            <label>
                                Não recebeu o e-mail de confirmação?{" "}
                                <Link href="/RecuperarEmail">Clique aqui</Link>
                            </label>
                        </div>
                    </form>
                </div>
                <Menu id="menu-lateral" className={styleh.menu_lateral} />
            </div>
            <div id="divMensagemSucesso" className={styles.Mensagem_sucesso}>
                <div className={styles.Mensagem_sucesso_imagem}>
                    <Image
                        src={certo}
                        alt="certo"
                        className={styles.tick_verde}
                    />
                </div>
                <div className={styles.Mensagem_sucesso_texto}>
                    <h1>Dados cadastrados com sucesso!</h1>
                    <p>
                        Verifique no seu e-mail cadastrado uma mensagem de
                        confirmação. Clique em <b>Confirmar e-mail</b> para
                        acessar os seus dados cadastraqdos na área restrita do
                        participante.
                    </p>
                </div>
            </div>
            <div id="divMensagemErro" className={styles.Mensagem_erro}>
                <div className={styles.Mensagem_erro_imagem}>
                    <Image src={erro} alt="erro" className={styles.erro} />
                </div>
                <div className={styles.Mensagem_erro_texto}>
                    <h1>
                        Erro ao enviar o e-mail de confirmação ao seu e-mail.
                    </h1>
                    <p>
                        Verifique se os seus dados e o seu e-mail estão certos.
                    </p>
                </div>
            </div>
        </main>
    );
}
