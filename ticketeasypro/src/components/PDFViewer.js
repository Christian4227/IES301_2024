import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import download from "../assets/Download - escuro sem fundo.png";
import styles from "@styles/Componentes.module.css";
const { jsPDF } = require("jspdf");

export default function PDFViewer({ file }) {
  const elementPDF = useRef(null);
  const [documento, setDocumento] = useState("");
  const handlePDF = async () => {
    var doc = new jsPDF();
    doc.text("Primeiro arquivo PDF", 10, 10);
    const dataURL = doc.output("bloburl");
    console.log(dataURL);
    setDocumento(dataURL);
  };
  const BaixarPDFCompra = () => {
    var doc = new jsPDF();
    doc.text("Primeiro arquivo PDF", 10, 10);
    doc.save("IES301.pdf");
  };

  useEffect(() => {
    handlePDF();
  }, []);
  return (
    <div>
      <div>
        <button
          className={styles.botao_download_pagamento}
          onClick={() => BaixarPDFCompra()}
        >
          <Image src={download} alt="download" width={40} height={40} />
        </button>
      </div>
      <iframe
        src={documento}
        id="pdf-container"
        className={styles.div_pdf}
      ></iframe>
    </div>
  );
}
