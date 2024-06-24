import React from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";

export default function TelaConfirmacaoIngresso() {
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador />
      <SuporteTecnico />
      <div>
        <h1>Pagamento realizado com sucesso!</h1>
        <p>
          O ingresso do cliente já está disponível na seção Ingressos ao
          realizar o log in na área restrita.
        </p>
      </div>
    </div>
  );
}
