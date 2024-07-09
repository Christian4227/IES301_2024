import React from "react";
import CabecalhoCliente from "./CabecalhoCliente";
import CabecalhoInfoCliente from "./CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";

export default function PerfilCliente() {
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Perfil do usuário" />
      <SuporteTecnico role="Cliente"/>
    </div>
  );
}
