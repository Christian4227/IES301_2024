import React, { useState } from "react";
import Cabecalho from "./Cabecalho";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@styles/Recuperacao.module.css";
import client from "@/utils/client_axios";

export default function RedefinicaoSenha() {
    const [senha, setSenha] = useState("");
    const [repetirSenha, setRepetirSenha] = useState("");
    const [senhaLength, setSenhaLenght] = useState(0);
    const [repetirSenhaLength, setRepetirSenhaLenght] = useState(0);

    const Senha = (valor) => {
        setSenha(valor);
        setSenhaLenght(valor.length);
    };
    const NovaSenha = (valor) => {
        setRepetirSenha(valor);
        setRepetirSenhaLenght(valor.length);
    };
    const RedefinirSenha = () => {
        if (
            !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/.test(
                senha
            )
        ) {
            return;
        }
        if (senha != repetirSenha) {
            alert("As senhas não correspondem.");
            return;
        }

        let data = JSON.stringify({
            senha: senha,
            repetirSenha: repetirSenha,
        });
        client
            .post("", data)
            .then(() => { })
            .catch((error) => {
                console.log("Erro na requisição. " + error);
            });
    };
    return (
        <div className={styles.div_corpo}>
            <Cabecalho />
            <div className={styles.div_corpo_body}>
                <div className={styles.div_corpo_recuperacao}>
                    <div className={styles.div_corpo_recuperacao_titulo}>
                        <label>Redefinição da senha do usuário</label>
                    </div>
                    <div>
                        <p>
                            É possível que o sistema demore para efetivar a
                            mudança da sua senha devido ao grande uso do
                            sistema.
                        </p>
                        <hr />
                        <div className={styles.label_senha}>
                            <label>Para redefinir a senha, é necessário:</label>
                            <ul>
                                <li>Mínimo de 8 caracteres</li>
                                <li>1 letra maiúscula</li>
                                <li>1 número</li>
                                <li>1 caracter especial</li>
                            </ul>
                        </div>
                        <hr />
                        <div className="mb-3">
                            <label className={styles.label}>Nova senha</label>
                            <label>{senhaLength + " / " + 20}</label>
                            <input
                                type="password"
                                className="form-control"
                                value={senha}
                                onChange={(e) => Senha(e.target.value)}
                                maxLength={20}
                                pattern="^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}"
                            />
                        </div>
                        <div className="mb-3">
                            <label className={styles.label} htmlFor="cpf">
                                Repetir senha
                            </label>
                            <label>{repetirSenhaLength + " / " + 20}</label>
                            <input
                                type="password"
                                id="cpf"
                                className="form-control"
                                value={repetirSenha}
                                onChange={(e) => NovaSenha(e.target.value)}
                                maxLength={20}
                                pattern="^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}"
                            />
                        </div>
                        <input
                            type="button"
                            className="btn btn-primary"
                            onClick={() => RedefinirSenha()}
                            defaultValue="Redefinir"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
