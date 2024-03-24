import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import Link from "next/link";
import axios from "axios";

export default function LogInCliente() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    function Login() {
        let data = JSON.stringify({
            email: email,
            password: senha,
        });
        console.log(data);
        axios
            .post("http://localhost:3210/v1/users/login", data)
            .then((response) => {
                alert(response.data);
            })
            .catch((error) => {
                alert("Erro na requisição: " + error);
            });
    }

    return (
        <div className={styles.body_login_cliente}>
            <div className={styles.div_Login}>
                <input
                    id="txtEmail"
                    className={styles.login_campo}
                    type="text"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    id="txtSenha"
                    className={styles.login_campo}
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <input
                    id="btnEntrar"
                    className={styles.botao_submit}
                    type="button"
                    value="Entrar"
                    onClick={Login}
                />
                <label className={styles.descricao_cadastrar}>
                    Não tem uma conta?{" "}
                    <Link
                        href="/TelaCadastroCliente"
                        className={styles.link_cadastrar}
                    >
                        Cadastre-se
                    </Link>
                </label>
            </div>
        </div>
    );
}
