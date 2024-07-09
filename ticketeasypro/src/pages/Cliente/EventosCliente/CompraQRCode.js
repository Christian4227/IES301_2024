import React from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";

export default function CompraQRCode() {
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Comprovante de compra" />
      <SuporteTecnico role="Cliente"/>
    </div>
  );
}
