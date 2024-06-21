import React, { useEffect } from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import styles from "@styles/Colaborador.module.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";

export default function QRCodeIngresso() {
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
      scanner.clear();
      // setScannedData(result);
      console.log(result);
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, []);
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Vender ingresso QR Code" />
      <SuporteTecnico />
      <div className={styles.qrcode_scanner_body_imprimir}>
        <div id="qrcode" className={styles.qrcode_scanner_ingresso} />
      </div>
    </div>
  );
}
