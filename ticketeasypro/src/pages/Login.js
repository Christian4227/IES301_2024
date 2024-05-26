import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Login.module.css";
import Link from "next/link";
import { AuthContext } from "@/context/Auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
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
            <div className="div_container_pequeno">
                <div className={styles.div_Login_titulo}>
                    <label>Área restrita</label>
                    <hr />
                </div>
                <div className={styles.div_Login_campos}>
                    <form>
                        <div className="mb-3">
                            <input
                                id="txtEmail"
                                type="text"
                                className="form-control"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                id="txtSenha"
                                type="password"
                                className="form-control"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                        <input
                            id="btnEntrar"
                            type="button"
                            className="btn btn-primary"
                            defaultValue="Entrar"
                            onClick={Login}
                        />
                    </form>
                </div>
                <hr />
                <div className={styles.div_Login_footer}>
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
        </div>
    );
}
