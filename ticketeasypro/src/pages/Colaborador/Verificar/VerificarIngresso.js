import React from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";

export default function VerificarIngresso() {
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Verificar ingresso" />
    </div>
  );
}
