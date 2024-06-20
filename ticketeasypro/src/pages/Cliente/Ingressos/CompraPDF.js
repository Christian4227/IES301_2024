import React from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";

export default function CompraPDF() {
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente />
      <SuporteTecnico />
    </div>
  );
}
