// import React, { useContext, useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import download from "../assets/Download - escuro sem fundo.png";
import email from "../assets/e-mail sb.png";
import styles from "@styles/Componentes.module.css";
import client from "@/utils/client_axios";
import ToastMessage from "./ToastMessage/ToastMessage";
// import { AuthContext } from "@/context/Auth";
// import { useRouter } from "next/router";
import { getToken } from "@/utils";
import QRCode from "qrcode";
import html2canvas from "html2canvas";

const { jsPDF } = require("jspdf");

export default function PDFViewer({ idCompra }) {
  // const elementPDF = useRef(null);
  // const router = useRouter();
  // const { user } = useContext(AuthContext);
  const [documento, setDocumento] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [htmlContent, setHtmlContent] = useState("");
  const [imagem, setImagem] = useState("");

  var htmlTicket = `<!DOCTYPE html>
<html>
<head>
<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.info-table th,
.info-table td {
  padding: 10px;
  text-align: left;
}

.info-table th {
  font-weight: bold;
}

.venue-table,
.event-manager-table {
  width: 50%;
  float: left;
  margin-top: 20px;
}

.venue-table th,
.event-manager-table th {
  display: none;
}

.venue-table td,
.event-manager-table td {
  border-bottom: none;
  padding: 10px;
}

.qr-code {
  float: left;
  width: 50%;
  text-align: center;
  margin-bottom: 20px; /* added margin bottom */
  margin-top: 10vh;
}

.qr-code img {
  max-width: 100%;
  height: auto;
}

.check-in {
  float: right;
  width: 50%;
  text-align: center;
  margin-top: 10vh;
}

.check-in h2 {
  margin-top: 0;
}

.clear {
  clear: both;
}

/* added media query for responsive design */
@media (max-width: 768px) {
  .venue-table, .event-manager-table {
    width: 100%;
    float: none;
  }
  .qr-code, .check-in {
    width: 100%;
    float: none;
  }
}
</style>
</head>
<body>
  <div class="container">
    <h1>Evento</h1>
    <h2>Data Início | Data Término</h2>

    <table class="info-table">
      <tr>
        <th>ID DO INGRESSO</th>
        <th>TIPO DE EVENTO</th>
        <th>CLIENTE</th>
        <th>ID DA COMPRA</th>
      </tr>
      <tr>
        <td>1137</td>
        <td>Club Members</td>
        <td>Bob Snell</td>
        <td>68de1a9d30</td>
      </tr>
    </table>

    <table class="venue-table">
      <tr>
        <td><strong>ENDEREÇO</strong></td>
      </tr>
      <tr>
        <td>São Paulo, Brasil</td>
      </tr>
      <tr>
        <td>Rua muito bacana 777</td>
      </tr>
    </table>

    <table class="event-manager-table">
      <tr>
        <td><strong>GERENTE DO EVENTO</strong></td>
      </tr>
      <tr>
        <td>F. Scott Fitzgerald</td>
      </tr>
    </table>

    <div class="clear"></div>

    <div class="qr-code">
      <img src="qrcodeBase64" alt="QR Code">
    </div>
    <div class="check-in">
      <h2>Confira o evento</h2>
      <h3>Escaneie esse QR Code no local do evento para check in.</h3>
    </div>
    <div class="clear"></div>
  </div>
</body>
</html>`;

  const handlePDF = async () => {
    QRCode.toDataURL(idCompra)
      .then((url) => {
        htmlTicket = htmlTicket.replace("qrcodeBase64", url);

        const element = document.createElement("div");
        element.innerHTML = htmlTicket;
        document.body.appendChild(element);

        html2canvas(element).then((canvas) => {
          const imgData = canvas.toDataURL("image/png"); // Convert canvas to image data

          const pdf = new jsPDF();
          pdf.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size (210x297 mm)
          var dataURL = pdf.output("bloburl", { filename: "IES301.pdf" });
          setDocumento(dataURL);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };
  const BaixarPDFCompra = () => {
    QRCode.toDataURL(idCompra)
      .then((url) => {
        htmlTicket = htmlTicket.replace("qrcodeBase64", url);

        const element = document.createElement("div");
        element.innerHTML = htmlTicket;
        document.body.appendChild(element);

        html2canvas(element).then((canvas) => {
          const imgData = canvas.toDataURL("image/png"); // Convert canvas to image data

          const pdf = new jsPDF();
          pdf.addImage(imgData, "PNG", 0, 0, 250, 297); // A4 size (210x297 mm)
          pdf.save("IES301.pdf");
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const EnviarPDFEmail = async () => {
    handleEnviarCompra(idCompra);
  };

  const handleEnviarCompra = async (idCompra) => {
    try {
      const response = await client.get(`orders/${idCompra}/tickets-email`, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      if (response.status == 201) {
        handleSetMessage("Ingressos enviados por email.", "success");
      }
    } catch (error) {
      handleSetMessage("Erro ao enviar os ingressos por email.", "error");
    }
  };

  useEffect(() => {
    handlePDF();
  }, []);

  useEffect(() => {
    // Carregar o conteúdo HTML do arquivo externo
    fetch("/content.html")
      .then((response) => response.text())
      .then((data) => {
        setHtmlContent(data);
      });
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
