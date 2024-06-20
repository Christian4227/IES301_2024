import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import download from "../assets/Download - escuro sem fundo.png";
import email from "../assets/e-mail sb.png";
import styles from "@styles/Componentes.module.css";
import client from "@/utils/client_axios";
import ToastMessage from "./ToastMessage/ToastMessage";
import { AuthContext } from "@/context/Auth";
import { useRouter } from "next/router";
const { jsPDF } = require("jspdf");

export default function PDFViewer({ emailCliente }) {
  // const elementPDF = useRef(null);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [documento, setDocumento] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const handlePDF = async () => {
    var doc = new jsPDF();

    doc.text("Primeiro arquivo PDF", 10, 10);
    var dataURL = doc.output("bloburl", { filename: "IES301.pdf" });
    console.log(dataURL);
    setDocumento(dataURL);
  };
  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };
  const BaixarPDFCompra = () => {
    var doc = new jsPDF();
    doc.text("Primeiro arquivo PDF", 10, 10);
    doc.save("IES301.pdf");
  };
  const EnviarPDFEmail = () => {
    var emailEnviar;
    if (emailCliente == "") {
      emailEnviar = user.email;
    }
    client
      .get()
      .then((response) => {
        if (response.status == 200) {
          handleSetMessage("Ingresso enviado por e-mail.", "success");
        } else {
          handleSetMessage("Algo deu errado. Tente novamente.", "error");
        }
      })
      .catch((error) => {
        handleSetMessage("Erro ao enviar o e-mail.", "error");
        console.log("Erro na requisição " + error);
      });
  };

  useEffect(() => {
    handlePDF();
  }, []);
  return (
    <div>
      <div>
        <div>
          <button
            className={styles.botao_download_pagamento}
            onClick={() => BaixarPDFCompra()}
          >
            <Image src={download} alt="download" width={40} height={40} />
          </button>
          <button
            className={styles.botao_download_pagamento}
            onClick={() => EnviarPDFEmail()}
          >
            <Image src={email} alt="email" width={40} height={40} />
          </button>
        </div>
        <iframe
          src={documento}
          id="pdf-container"
          className={styles.div_pdf}
        ></iframe>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
