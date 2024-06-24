import React from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";

export default function VerificarIngresso() {
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Verificar ingresso" />
      <SuporteTecnico />
      <div></div>
    </div>
  );
}
