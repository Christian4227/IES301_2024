import React, { useContext, useState } from "react";
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
