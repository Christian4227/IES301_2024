import React, { useEffect, useState } from "react";
import Cabecalho from "./Cabecalho";
import styles from "@styles/Home.module.css";
import stylese from "@styles/InfoEventos.module.css";
import Image from "next/image";
import CabecalhoHomeMenu from "./CabecalhoHomeMenu";
import { useRouter } from "next/router";
import client from "@/utils/client_axios";
import { getFullAddress } from "@/utils";
import Link from "next/link";

export default function InfoTipoEvento() {
  const router = useRouter();
  const eventId = router.query.eventId;
  const [evento, setEvento] = useState([]);
  const [imageData, setImageData] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await client.get(`events/public/${eventId}`);
        setEvento(response.data);
        setImageData(response.data.img_banner);
      } catch (error) {
        console.log("Erro na requisição de categorias:", error);
      }
    };
    if (eventId) {
      fetchCategories();
    } else {
      router.back();
    }
  }, [eventId]);

  if (!imageData) return <div>Carregando imagem...</div>;

  return (
    <div id="div-principal">
      <Cabecalho className={styles.Header} />
      <div>
        <div>
          <CabecalhoHomeMenu componente={evento.name} />
        </div>
        <div className={stylese.body_imagem_tipoEvento}>
          <Image
            src={imageData}
            alt="img_tipo_evento"
            className={stylese.img_tipoEvento}
            width={200}
            height={200}
          />
        </div>
        <div className={stylese.body_infoTipoEventos}>
          <div className={stylese.body_infoTipoEvento_secao}>
            <h1>Seção</h1>
            <ul>
              <li>
                <Link href="#Informacoes_evento">Informações do evento</Link>
              </li>
              <li>
                <Link href="#Ingressos">Ingressos</Link>
              </li>
              <li>
                <Link href="#Recomendacoes">Recomendações</Link>
              </li>
            </ul>
          </div>
          <div className={stylese.infoTipoEvento_Principal}>
            <div
              className={stylese.infoTipoEvento_DescricaoEvento}
              id="Informacoes_evento"
            >
              <h1>{evento.name}</h1>
              <p>
                {evento.location == undefined
                  ? ""
                  : "Local do evento: " + getFullAddress(evento.location)}
              </p>
              <p>
                {"Data de início: " +
                  new Date(evento.initial_date).toLocaleDateString()}
              </p>
              <p>
                {"Data de término: " +
                  new Date(evento.final_date).toLocaleDateString()}
              </p>
              <p>{evento.description}</p>
            </div>
            <div className={stylese.infoTipoEvento_Ingressos} id="Ingressos">
              <h1>Ingressos disponíveis</h1>
              <p>
                {evento.base_price === undefined
                  ? ""
                  : "Preço base: " +
                    (evento.base_price / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
              </p>
              <p>{"Capacidade: " + evento.capacity}</p>
            </div>
            <div
              className={stylese.infoTipoEvento_Recomendacoes}
              id="Recomendacoes"
            >
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
    </div>
  );
}
