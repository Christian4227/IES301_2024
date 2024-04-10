import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/Menu.module.css";
import Image from "next/image";
import Link from "next/link";
import fechar from "../assets/x.png";

export default function Menu() {
    const router = useRouter();
    const EntrarCliente = () => {
        router.push("./LoginCliente");
    };

    const EntrarAreaRestrita = () => {
        router.push("./LoginAdm");
    };

    const FecharMenuLateral = () => {
        document.getElementById("menu-lateral").style.width = 0;
        document.getElementById("menu-lateral").style.padding = 0;
    };
    return (
        <div id="menu-lateral" className={styles.menu_lateral}>
            <nav>
                <div className={styles.menu_lateral_header}>
                    <b>
                        <h1>Área do cliente</h1>
                    </b>
                    <button onClick={() => FecharMenuLateral()}>
                        <Image
                            src={fechar}
                            alt="fechar"
                            className={styles.img_menu_lateral}
                        />
                    </button>
                </div>
                <hr />
                <div className={styles.menu_lateral_cliente}>
                    <div className={styles.menu_lateral_cliente_botao}>
                        <input
                            type="button"
                            id="inputEntrar"
                            value="Entrar"
                            className={styles.botao_entrar}
                            onClick={() => EntrarCliente()}
                        />
                    </div>
                    <div className={styles.menu_lateral_cliente_texto}>
                        <label>Ainda não tem uma conta?</label>
                        <br />
                        <Link href="./CadastroCliente">Cadastre-se</Link>
                    </div>
                </div>
                <hr />
                <div className={styles.menu_lateral_area_restrita}>
                    <input
                        type="button"
                        id="inputAreaRestrita"
                        value="Área restrita"
                        className={styles.botao_area_restrita}
                        onClick={() => EntrarAreaRestrita()}
                    />
                </div>
            </nav>
        </div>
    );
}
