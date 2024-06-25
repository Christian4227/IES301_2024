import React, { useState } from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import { useRouter } from "next/router";
import styles from "@styles/Cliente.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import adicionar from "../../../assets/adicionar_botao.png";
import diminuir from "../../../assets/reduzir_botao.png";
import adicionar_linha from "../../../assets/adicionar_linha.png";
import ToastMessage from "@/components/ToastMessage/ToastMessage";

export default function EventoEscolhidoForm() {
  const router = useRouter();
  const QRCodeCompra = () => {
    router.push("./CompraQRCode");
  };
  const ingressosEvento = [
    {
      tipo: "Ingresso comum",
      quantidade: 0,
      disabled: false,
    },
    {
      tipo: "Meia-Entrada para Estudantes",
      quantidade: 0,
      disabled: false,
    },
    {
      tipo: "Ingresso VIP",
      quantidade: 0,
      disabled: false,
    },
    {
      tipo: "Meia-Entrada para Idosos",
      quantidade: 0,
      disabled: false,
    },
    {
      tipo: "Especial",
      quantidade: 0,
      disabled: false,
    },
  ];
  const [tipoIngressos, setTipoIngressos] = useState(ingressosEvento);

  const [quantidade, setQuantidade] = useState(0);
  const [adicionarLinha, setAdicionarLinha] = useState([]);
  const [quantidadeLinhas, setQuantidadeLinhas] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [ingressoSelecionado, setIngressoSelecionado] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const AdicionarQuantidade = () => {
    setQuantidade(quantidade + 1);
  };

  const DiminuirQuantidade = () => {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  };

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const AdicionarLinha = () => {
    if (quantidadeLinhas >= ingressosEvento.length) {
      handleSetMessage("Quantidade de tipos de ingressos esgotados.", "error");
      return;
    }

    if (tipoIngressos == "" || quantidade == 0) {
      handleSetMessage(
        "Selecione um tipo e uma quantidade de ingresso.",
        "error"
      );
      return;
    }
    if (quantidadeLinhas > 1) {
      document.getElementById(
        `TxtTipoIngresso${quantidadeLinhas - 1}`
      ).disabled = true;
    }

    setQuantidadeLinhas(quantidadeLinhas + 1);

    const index = tipoIngressos.findIndex(
      (item) => item.tipo == ingressoSelecionado
    );

    if (index !== -1) {
      tipoIngressos.splice(index, 1);
    }
    setTipoIngressos(tipoIngressos);
    setDisabled(true);

    const novoComponente = (
      <div>
        <div className={styles.div_quantidade_ingresso}>
          <div className="mb-3">
            <label>Tipo de ingresso</label>
            <select
              id={`TxtTipoIngresso${quantidadeLinhas}`}
              className="form-select"
              onChange={(e) => setIngressoSelecionado(e.target.value)}
              disabled={tipoIngressos[index].disabled}
            >
              <option value="">Selecione o tipo de ingresso...</option>
              {tipoIngressos.map((tipoIngresso, index) => (
                <option
                  key={`tipo-ticket-${index}`}
                  index={index}
                  value={tipoIngresso.tipo}
                >
                  {tipoIngresso.tipo}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.div_quantidade_ingresso_botao}>
            <button
              className={styles.botao_adicionar_ingressos}
              onClick={() => AdicionarQuantidade()}
            >
              <Image src={adicionar} alt="diminuir" />{" "}
            </button>
          </div>
          <div className="mb-3">
            <label>Quantidade</label>
            <input
              type="number"
              className="form-control"
              id="InputNomeCompleto"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>
          <div className={styles.div_quantidade_ingresso_botao}>
            <button
              className={styles.botao_diminuir_ingressos}
              onClick={() => DiminuirQuantidade()}
            >
              <Image src={diminuir} alt="diminuir" />{" "}
            </button>
          </div>
        </div>
      </div>
    );
    setAdicionarLinha([...adicionarLinha, novoComponente]);
  };
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Formulário de compra" />
      <SuporteTecnico />
      <div className={styles.div_principal}>
        <div className="div_container_principal">
          <div className="div_subtitulo">
            <h1>Formulário de compra do ingresso</h1>
          </div>
          <div>
            <div className={styles.div_quantidade_ingresso}>
              <div className="mb-3">
                <label>Tipo de ingresso</label>
                <select
                  className="form-select"
                  onChange={(e) => setIngressoSelecionado(e.target.value)}
                  disabled={disabled}
                >
                  <option value="">Selecione o tipo de ingresso...</option>
                  {ingressosEvento.map((tipoIngresso, index) => (
                    <option
                      key={`tipo-ticket-${index}`}
                      index={index}
                      value={tipoIngresso.tipo}
                    >
                      {tipoIngresso.tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.div_quantidade_ingresso_botao}>
                <button
                  className={styles.botao_adicionar_ingressos}
                  onClick={() => AdicionarQuantidade()}
                >
                  <Image src={adicionar} alt="diminuir" />{" "}
                </button>
              </div>
              <div className="mb-3">
                <label>Quantidade</label>
                <input
                  type="number"
                  className="form-control"
                  id="InputNomeCompleto"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </div>
              <div className={styles.div_quantidade_ingresso_botao}>
                <button
                  className={styles.botao_diminuir_ingressos}
                  onClick={() => DiminuirQuantidade()}
                >
                  <Image src={diminuir} alt="diminuir" />{" "}
                </button>
              </div>
            </div>
            {adicionarLinha.map((linhas, index) => (
              <div key={`linha-${index}`} index={index}>
                {linhas}
              </div>
            ))}
            {quantidadeLinhas < ingressosEvento.length ? (
              <div className={styles.div_quantidade_ingresso_adicionar}>
                <div className={styles.div_quantidade_ingresso_adicionar_filha}>
                  <button
                    onClick={() => AdicionarLinha()}
                    className={styles.btn_quantidade_ingresso_adicionar}
                  >
                    <Image
                      src={adicionar_linha}
                      alt=""
                      className={styles.img_quantidade_ingresso_adicionar}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
            <input
              type="button"
              value="Reservar"
              className="botao_sistema"
              onClick={() => QRCodeCompra()}
            />
          </div>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
