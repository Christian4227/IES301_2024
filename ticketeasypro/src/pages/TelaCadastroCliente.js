import React, { useState } from "react";
import Cabecalho from "./Cabecalho";
import styles from "../styles/CadastroCliente.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

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
            name: nome,
            birth_date: dataNascimentoC,
            phone: celular,
            phone_fix: telefone,
        });
        axios
            .post("http://localhost:3210/v1/users/cadastrar", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(() => {
                alert("Dados cadastrados com sucesso!");
            })
            .catch((error) => {
                alert("Erro na requisição: " + error);
            });
    }

    return (
        <div>
            <Cabecalho />
            <div className={styles.div_cadastrar}>
                <form className={styles.form_cadastrar}>
                    <div className={styles.cabecalho_cadastro}>
                        <b>
                            <h1>Cadastro das informações</h1>
                        </b>
                        <label>
                            Insira os seus dados para se inscrever nos eventos
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
                            onChange={(e) => setDataNascimento(e.target.value)}
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
                        defaultValue="Submit"
                    />
                </form>
            </div>
        </div>
    );
}
