import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Login.module.css";
import Link from "next/link";
import { AuthContext } from "@/context/Auth";

export default function LogInCliente() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    function Login() {
        let data = JSON.stringify({
            email: email,
            password: senha,
        });
        login(data);
    }

    useEffect(() => {
        document
            .getElementById("txtSenha")
            .addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    document.getElementById("btnEntrar").click();
                }
            });
    });

    return (
        <div className={styles.body_login_cliente}>
            <div className={styles.div_Login}>
                <h1>Seja bem vindo!</h1>
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
                    type="submit"
                    value="Entrar"
                    onClick={Login}
                />
                <label className={styles.descricao_cadastrar}>
                    <b>Não tem uma conta? </b>
                    <Link
                        href="/CadastroCliente"
                        className={styles.link_cadastrar}
                    >
                        Cadastre-se
                    </Link>
                </label>
            </div>
        </div>
    );
}
