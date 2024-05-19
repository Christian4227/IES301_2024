import React from "react";
import CabecalhoInfoColaborador from "./CabecalhoInfoColaborador";
import CabecalhoColaborador from "./CabecalhoColaborador";

export default function VenderIngressos() {
    return (
        <div>
            <CabecalhoColaborador />
            <CabecalhoInfoColaborador />
            <table>
                <thead>
                    <tr>
                        <th>Nome do evento</th>
                        <th>Local</th>
                        <th>Data</th>
                        <th>Vagas</th>
                        <th>Disponível</th>
                        <th colSpan={2}>Ação</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
}
