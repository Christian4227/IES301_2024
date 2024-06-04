import React from "react";
import CabecalhoCliente from "./CabecalhoCliente";
import CabecalhoInfoCliente from "./CabecalhoInfoCliente";
import { useRouter } from "next/router";
// import styles from "../../styles/Cliente.module.css";

export default function GeralCliente() {
    const router = useRouter();
    const TelaIngressos = () => {
        router.push("./Ingressos/IngressosCliente");
    };
    return (
        <div>
            <CabecalhoCliente />
            <CabecalhoInfoCliente />
            <input
                type="button"
                value="Tabela ingressos"
                onClick={() => TelaIngressos()}
            />
        </div>
    );
}
