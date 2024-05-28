import React from "react";
import styles from "../../styles/Colaborador.module.css";
import Image from "next/image";
import tick from "../../assets/ticky branco.png";
import ticket from "../../assets/ticket.png";
import lupa from "../../assets/Lupa.png";
import CabecalhoColaborador from "./CabecalhoColaborador";
import CabecalhoInfoColaborador from "./CabecalhoInfoColaborador";
import { useRouter } from "next/router";

export default function indexColaborador() {
    const router = useRouter();
    const VenderIngressos = () => {
        router.push("/Colaborador/Vender/VenderIngressos");
    };
    const ValidarIngressos = () => {
        router.push("/Colaborador/Validar/ListaEventos");
    };
    const VerificarIngressos = () => {
        router.push("/Colaborador/Verificar/VerificarIngresso");
    };
    return (
        <div>
            <CabecalhoColaborador />
            <CabecalhoInfoColaborador />
            <div className={styles.div_body_colaborador}>
                <div className={styles.vender_ingressos}>
                    <button onClick={() => VenderIngressos()}>
                        <Image
                            src={ticket}
                            alt="validar"
                            className={styles.vender_ingressos_img_vender}
                        />
                    </button>
                    <label>Vender</label>
                </div>
                <div className={styles.validar_ingressos}>
                    <button onClick={() => VerificarIngressos()}>
                        <Image
                            src={lupa}
                            alt="validar"
                            className={styles.vender_ingressos_img_validar}
                        />
                    </button>
                    <label>Verificar</label>
                </div>
                <div className={styles.validar_ingressos}>
                    <button onClick={() => ValidarIngressos()}>
                        <Image
                            src={tick}
                            alt="validar"
                            className={styles.vender_ingressos_img_validar}
                        />
                    </button>
                    <label>Validar</label>
                </div>
            </div>
        </div>
    );
}
