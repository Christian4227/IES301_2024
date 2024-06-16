import React from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";

export default function ComprarIngressoCliente() {
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Pagamento" />
      <SuporteTecnico />
    </div>
  );
}
