import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/Colaborador.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import seta from "../../../assets/seta para cima.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import client from "@/utils/client_axios";
import { parseCookies } from "nookies";
import ToastMessage from "@/components/ToastMessage/ToastMessage";

function getToken() {
  const cookies = parseCookies();
  let token;
  let valorToken;
  if (cookies && cookies["ticket-token"]) {
    token = cookies["ticket-token"]; // Assumindo que o nome do cookie é 'ticket-token'
    valorToken = JSON.parse(token);
  }
  return valorToken;
}

export default function ScannerQrCode() {
  const router = useRouter();
  const [botao, setBotao] = useState(false);
  const [idIngresso, setIdIngresso] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSetMessage = (message, type) => {
    ({ text: message, type });
  };

  const setErrorMessage = useCallback(
    (message) => setMessage(message, "error"),
    []
  );
  const setSuccessMessage = useCallback(
    (message) => setMessage(message, "success"),
    []
  );

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qrcode", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 100,
    });

    scanner.render(success, error);

    function success(result) {
      scanner.pause();
      const regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUUID4 = regex.test(result);

      if (isUUID4) {
        ValidarCodigo(result);
      } else {
        handleSetMessage(
          "Não foi encontrado o ingresso com este QR Code.",
          "error"
        );
      }
    }

    function error(err) {
      scanner.pause();
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, []);

  const MenuValidar = () => {
    setBotao(!botao);
  };

  const ValidarCodigo = async (idIngresso) => {
    try {
      const response = await client.get(`tickets/${idIngresso}/checkin`, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });

      if (response == 200) {
        if (response?.message?.fail) {
          const mensagem = response?.message?.fail;
          switch (mensagem) {
            case "TicketHasBeenUsed":
              setErrorMessage("Esse ingresso já foi usado.");
              return;
            case "TicketCancelled":
              setErrorMessage("Esse ingresso foi cancelado.");
              return;
            case "TicketExpired":
              setErrorMessage("Esse ingresso está expirado.");
              return;
          }
        }
        if (response?.message == "TicketReservedPendingPayment") {
          setErrorMessage("O ingresso/ordem de compra precisa ser pago.");
          return;
        }

        setSuccessMessage("Ingresso validado com sucesso!");
        setTimeout(() => {
          router.back();
        }, 7000);
      }
    } catch (error) {
      setErrorMessage("Falha ao validar o ticket. Erro inesperado.");
    }
  };
  return (
    <div className={styles.body_qr_code}>
      <div id="qrcode" className={styles.qrcode_scanner}></div>
      <div>
        <div className={styles.embaixo}>
          <button className={styles.botao_img} onClick={() => MenuValidar()}>
            <Image src={seta} alt="" className={styles.img_botao} />
          </button>
          {botao ? (
            <div className={styles.botao_grupo}>
              <div className="mb-3">
                <label>Código do ingresso</label>
                <input
                  id="btnCodigoIngresso"
                  className="form-control"
                  type="text"
                  value={idIngresso}
                  onChange={(e) => setIdIngresso(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  id="btnCodigoIngresso"
                  className={styles.botao_codigo}
                  type="button"
                  value="Validar com código do ingresso"
                  onClick={() => ValidarCodigo(idIngresso)}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
