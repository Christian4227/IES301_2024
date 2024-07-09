import React from "react";
import CabecalhoColaborador from "./CabecalhoColaborador";
import CabecalhoInfoColaborador from "./CabecalhoInfoColaborador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";

export default function PerfilColaborador() {
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Perfil do colaborador" />
      <SuporteTecnico role="Colaborador" />
    </div>
  );
}
