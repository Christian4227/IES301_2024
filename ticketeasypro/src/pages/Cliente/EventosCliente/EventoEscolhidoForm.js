import React from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import { useRouter } from "next/router";
import styles from "@styles/Cliente.module.css";

export default function EventoEscolhidoForm() {
  const router = useRouter();
  const QRCodeCompra = () => {
    router.push("./CompraQRCode");
  };
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Formulário de compra" />
      <SuporteTecnico />
      <input
        type="button"
        value="Reservar"
        className={styles.botao_reservar_evento_escolhido}
        onClick={() => QRCodeCompra()}
      />
    </div>
  );
}
