import React, { useState } from "react";
import Cabecalho from "./Cabecalho";
import styles from "../styles/CadastroCliente.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function TelaCadastroCliente() {
    const [telefoneE, setTelefoneE] = useState("");
    const [celularE, setCelularE] = useState("");
    function MascaraContato(tipo, value) {
        if (tipo == "Telefone") {
            value = value.replace(/\D/g, "");
            value = value.replace(/(\d{2})(\d)/, "($1) $2");
            value = value.replace(/(\d)(\d{4})$/, "$1-$2");
            setTelefoneE(value);
        } else {
            value = value.replace(/\D/g, "");
            value = value.replace(/(\d{2})(\d)/, "($1) $2");
            value = value.replace(/(\d{5})(\d{4})$/, "$1-$2");
            setCelularE(value);
        }

        return value;
    }

    function InserirDados() {
        const nome = document.getElementById("InputNomeCompleto").value;
        const telefone = document.getElementById("InputTelefone").value;
        const celular = document.getElementById("InputCelular").value;
        var dataNascimento = document.getElementById(
            "InputDataNascimento"
        ).value;
        const email = document.getElementById("InputEmail").value;
        const senha = document.getElementById("InputSenha").value;
        const novaSenha = document.getElementById("InputNovaSenha").value;

        if (senha != novaSenha || senha.length == 0) {
            alert("As senhas não correspondem.");
            return;
        }

        dataNascimento = new Date(dataNascimento);
        dataNascimento = dataNascimento.toISOString();
        let data = JSON.stringify({
            email: email,
            password: senha,
            name: nome,
            birth_date: dataNascimento,
            phone: celular,
            phone_fix: telefone,
        });
        axios
            .post("http://127.0.0.1:3210/v1/users/cadastrar", data)
            .then((response) => {
                alert(response.data);
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
                            value={telefoneE}
                        />
                        <input
                            type="tel"
                            className="form-control"
                            id="InputCelular"
                            maxLength={15}
                            onChange={(e) =>
                                MascaraContato("Celular", e.target.value)
                            }
                            value={celularE}
                        />
                        <input
                            type="date"
                            className="form-control"
                            id="InputDataNascimento"
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
