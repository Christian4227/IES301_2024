import React, { useEffect, useState } from "react";
import Image from "next/image";
import download from "public/assets/Download - escuro sem fundo.png";
import email from "public/assets/e-mail sb.png";
import styles from "@styles/Componentes.module.css";
import { getToken } from "@/utils";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import ticketTemplate from "@/utils/templateHTMLTicket";
import { getFullAddress } from "@/utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const { jsPDF } = require("jspdf");

export default function PDFViewer({ idCompra, dado }) {
  const [isPdf, setIsPdf] = useState(false);
  const [pdf, setPdf] = useState(
    new jsPDF({
      orientation: "landscape",
      unit: "cm",
      format: [10, 7],
      compress: true,
    })
  );

  async function adicionarPaginaIngresso(dados, pdf, idTicket) {
    try {
      const url = await QRCode.toDataURL(idTicket);
      var htmlTicket = ticketTemplate;
      htmlTicket = htmlTicket.replace("qrcodeBase64", url);
      htmlTicket = htmlTicket.replace(
        "#TIPOEVENTO#",
        dados.event.category.name
      );
      htmlTicket = htmlTicket.replace("#IDCOMPRA#", dados.id);
      htmlTicket = htmlTicket.replace(
        "#DATAINICIO#",
        new Date(dados.event.initial_date).toLocaleDateString()
      );
      htmlTicket = htmlTicket.replace(
        "#DATATERMINO#",
        new Date(dados.event.final_date).toLocaleDateString()
      );
      htmlTicket = htmlTicket.replace("#EVENTO#", dados.event.name);
      htmlTicket = htmlTicket.replace(
        "#ENDERECO#",
        getFullAddress(dados.event.location)
      );
      htmlTicket = htmlTicket.replace("#IDINGRESSO#", idTicket);
      htmlTicket = htmlTicket.replace("#PESSOA#", dados.customer.name);

      const element = document.createElement("div");
      element.innerHTML = htmlTicket;
      document.body.appendChild(element);

      const canvas = await html2canvas(element.querySelector(".container"));
      const imgData = canvas.toDataURL("image/png", 0.4);
      pdf.addImage(imgData, "PNG", 0, 0, 10, 7);

      document.body.removeChild(element);

      return pdf;
    } catch (err) {
      console.error(err);
    }
  }

  async function gerarPdf(dados) {
    var documento;
    var idTicket;

    if (!isPdf) {
      for (var k = 0; k <= dados.OrderTicket.length - 1; k++) {
        if (k != 0) {
          pdf.addPage({
            orientation: "landscape",
            unit: "cm",
            format: [10, 7],
            compress: true,
          });
        }
        idTicket = dados?.OrderTicket[k].ticket_id;
        documento = await adicionarPaginaIngresso(dados, pdf, idTicket);
      }
    }

    if (documento) {
      setIsPdf(true);
      var dataURL = documento.output("blob");
      const blobURL = URL.createObjectURL(dataURL);
      setPdf(dataURL);
      document.getElementById("pdf_container").src = blobURL;
    }
  }

  const BaixarPDFCompra = () => {
    pdf.save("IES301.pdf");
  };
  const EnviarPDFEmail = async () => {
    handleEnviarCompra(idCompra);
  };

  const handleEnviarCompra = async (idCompra) => {
    const arquivo = new File([pdf], "IES301.pdf");

    const form = new FormData();
    form.append("file", arquivo);

    try {
      const response = axios.post(
        `http://127.0.0.1:3210/v1/orders/${idCompra}/tickets-email`,
        form,
        {
          headers: {
            Authorization: `Bearer ${getToken()?.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 201) {
        toast.success("Ingressos enviados por email.");
      }
    } catch (error) {
      toast.error("Erro ao enviar os ingressos por email.");
    }
  };

  useEffect(() => {
    if (dado.length == undefined) {
      gerarPdf(dado);
    }
  }, [dado]);
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
        <iframe id="pdf_container" className={styles.div_pdf}></iframe>
      </div>
      <ToastContainer />
    </div>
  );
}
