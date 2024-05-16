import React, { useState } from "react";
import Cabecalho from "./Cabecalho";
import Menu from "./Menu";
import styles from "../styles/CadastroCliente.module.css";
import styleh from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import client from "@/utils/client_axios";
import Image from "next/image";
import certo from "../assets/ticky_verde.png";
import erro from "../assets/x_vermelho.png";

export default function RecuperarEmail() {
    const [email, setEmail] = useState("");

    const EnviarEmail = () => {
        let data = JSON.stringify({
            to: email,
            from: "eventmaisvoce@gmail.com",
            subject: "E-mail de recuperação",
        });
        client
            .post("/email/send-email", data)
            .then(() => {
                document.getElementById("divMensagemSucesso").style.display =
                    "";
                setTimeout(() => {
                    document.getElementById(
                        "divMensagemSucesso"
                    ).style.display = "";
                }, 7000);
            })
            // Caso dê algum erro na hora de enviar o e-mail
            .catch(() => {
                document.getElementById("divMensagemErro").style.display = "";
                setTimeout(() => {
                    document.getElementById("divMensagemErro").style.display =
                        "";
                }, 7000);
            });
    };
    return (
        <div>
            <Cabecalho className={styleh.header} />
            <div className={styles.divPrincipal_recuperar_email}>
                <div className={styles.recuperar_email}>
                    <div className={styles.recuperar_email_titulo}>
                        <h1>
                            Perdeu ou não recebeu o seu e-mail de confirmação?
                        </h1>
                        <label>
                            Digite novamente o seu e-mail no campo abaixo.
                            Clique no botão <b>Reenviar</b>.
                        </label>
                    </div>
                    <div className="mb-3">
                        <label>E-mail cadastrado</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <input
                        type="button"
                        value="Reenviar"
                        className="btn btn-primary"
                        onClick={() => EnviarEmail()}
                    />
                </div>
            </div>
            <Menu id="menu-lateral" className={styleh.menu_lateral} />
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
        </div>
    );
}
