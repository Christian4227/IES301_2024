// import React, { useEffect, useState } from "react";
import React from "react";
import Cabecalho from "./Cabecalho";
import Menu from "./Menu";
import styles from "@styles/Home.module.css";
import stylese from "../styles/InfoEventos.module.css";
import Image from "next/image";
import torre from "../assets/torre_miroku.jpg";
import CabecalhoHomeMenu from "./CabecalhoHomeMenu";
// import client from "@/utils/client_axios";

export default function InfoTipoEvento() {
  return (
    <div id="div-principal">
      <Cabecalho className={styles.Header} />
      <div>
        <div className={stylese.header_infoEventos}>
          <h1>Nome do tipo do evento</h1>
          <CabecalhoHomeMenu />
        </div>
        <div className={stylese.body_imagem_tipoEvento}>
          <Image
            src={torre}
            alt="img_tipo_evento"
            className={stylese.img_tipoEvento}
          />
        </div>
        <div className={stylese.body_infoTipoEventos}>
          <div className={stylese.body_infoTipoEvento_secao}>
            <h1>Seção</h1>
            <ul>
              <li>Informações do evento</li>
              <li>Ingressos</li>
              <li>Recomendações</li>
            </ul>
          </div>
          <div className={stylese.infoTipoEvento_Principal}>
            <div className={stylese.infoTipoEvento_DescricaoEvento}>
              <h1>Título da descrição ou das informações do evento</h1>
              <p>
                Descrição do evento - Em meados do ano 2000, o Reverendo Minoru
                Nakahashi (1935-2012), fundador do Templo Luz do Oriente,
                visitou, em companhia de alguns adeptos, o templo Horyu,
                localizado na cidade de Nara, Japão. Erigido pelo príncipe
                Shotoku em 607, o magnífico templo japonês foi reconhecido em
                1993 como Patrimônio Histórico e Cultural da Humanidade, pela
                Organização das Nações Unidas para a Educação, a Ciência e a
                Cultura (UNESCO).
              </p>
              <p>
                A bela construção causou-lhes tamanha admiração que, ao
                retornarem, traziam em seus corações o desejo de edificar algo
                semelhante no Brasil em devoção a Meishu Sama e ao Mundo Ideal
                anunciado por Ele. A partir de então, erigir a Torre de Miroku
                tornou-se objetivo de todos os membros do Templo Luz do Oriente,
                que, para tal intento, em sinal de gratidão a Kannon – principal
                divindade na doutrina de Meishu Sama –, dedicaram sua devoção,
                tempo e recursos materiais para a concretização .
              </p>
            </div>
            <div className={stylese.infoTipoEvento_Ingressos}>
              <h1>Ingressos disponíveis</h1>
              <p>
                As informações sobre os valores, a quantidade de ingressos e
                datas disponíveis são mostrados na tabela a seguir.
              </p>
              <table className={stylese.table_info_tipoeventos}>
                <thead className={stylese.table_head_tipoEventos}>
                  <tr>
                    <th>Nome do evento</th>
                    <th>Local</th>
                    <th>Data</th>
                    <th>Ingressos</th>
                    <th>Disponível</th>
                    <th colSpan={2}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nome do evento</td>
                    <td>Local</td>
                    <td>Data</td>
                    <td>Ingressos</td>
                    <td>Disponível</td>
                    <td>
                      <button className={stylese.botao_comprar}>Comprar</button>
                    </td>
                    <td>
                      <button className={stylese.botao_ver}>Ver</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={stylese.infoTipoEvento_Recomendacoes}>
              <h1>Recomendações para os eventos</h1>
              <h2>Prepare-se para a retomada dos eventos</h2>
              <p>
                É preciso planejar suas produções de forma a garantir o máximo
                de segurança possível para os participantes e a sua equipe.
                Munido desse pensamento, é necessário acompanhar as medidas e
                protocolos de segurança definidos pela sua cidade.
              </p>
              <p>
                Além de pensar nesses protocolos, vale a pena olhar com cuidado
                para o seu evento e seu público. Não há uma receita de bolo que
                pode ser aplicada a todos os contextos. Por isso, use diferentes
                ferramentas e alternativas que podem ser efetivas na sua
                produção.
              </p>
              <p>
                Outro ponto importante é o valor da comunicação e do
                treinamento. Tanto sua equipe, quanto seu público, devem estar
                preparados para viver uma experiência coletiva presencialmente
                após tanto tempo em isolamento. Temos que reaprender a conviver!
                Já pensou nisso? Preparamos um kit de planilhas gratuitas para a
                produção de eventos em 2021, confira.
              </p>
              <p>
                A seguir, compartilhamos dez dicas que a gente recomenda que
                sejam aplicadas no seu evento, em diferentes etapas.
              </p>
              <p>Confira!</p>
            </div>
          </div>
        </div>
      </div>
      <Menu id="menu-lateral" className={styles.menu_lateral} />
    </div>
  );
}
