import React, { useState } from 'react';
import Link from "next/link";
import styles from "../styles/Login.module.css";
import client from "./../utils/client_axios";
import { useRouter } from "next/router";



export default function LogInCliente() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const login = async () => {
        const requestBody = { email, password: senha };
        try {
            const response = await client.post("users/login", requestBody);

            console.log(response.data);
            localStorage.setItem("token", response.data.accessToken);
            router.push("/Admin/TelaInicialAdmin");
        } catch (error) {
            console.error(error);
        }
    };


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
                <button
                    id="btnEntrar"
                    className={styles.botao_submit}
                    type="button"
                    onClick={login}
                >
                    Entrar
                </button>
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
