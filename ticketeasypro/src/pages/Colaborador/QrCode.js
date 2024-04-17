import React, { useState } from "react";
import styles from "../../styles/Colaborador.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import seta from "../../assets/seta para cima.jpg";

export default function QrCode() {
    const router = useRouter();
    const [botao, setBotao] = useState(false);
    // setTimeout(() => {
    //     router.push("/Colaborador/ValidarIngresso");
    // }, 1000);
    const MenuValidar = () => {
        setBotao(!botao);
    };
    const ValidarCodigo = () => {
        router.push("/Colaborador/CodigoIngresso");
    };
    return (
        <div className={styles.qrcode_scanner}>
            <div className={styles.embaixo}>
                <button
                    className={styles.botao_img}
                    onClick={() => MenuValidar()}
                >
                    <Image src={seta} alt="" className={styles.img_botao} />
                </button>
                {botao ? (
                    <div className={styles.botao_grupo}>
                        <input
                            id="btnCodigoIngresso"
                            className={styles.botao_codigo}
                            type="button"
                            value="Validar com código do ingresso"
                            onClick={() => ValidarCodigo()}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
