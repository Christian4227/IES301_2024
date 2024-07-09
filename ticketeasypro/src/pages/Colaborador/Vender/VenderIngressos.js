import React from "react";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import CabecalhoColaborador from "../CabecalhoColaborador";
import Image from "next/image";
import styles from "@styles/Colaborador.module.css";
import sacola from "public/assets/Sacola 2.png";
import qrcode from "public/assets/qr code.png";
import { useRouter } from "next/router";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";

export default function VenderIngressos() {
  const router = useRouter();
  const ValidarCompra = () => {
    router.push("./VerificarCompra");
  };
  const RecuperarIngresso = () => {
    router.push("./QRCodeIngresso");
  };
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Opções vender" />
      <SuporteTecnico role="Colaborador" />
      <div className={styles.div_body_colaborador}>
        <div className={styles.vender_ingressos}>
          <button onClick={() => ValidarCompra()}>
            <Image
              src={sacola}
              alt="validar"
              className={styles.vender_ingressos_img_vender}
            />
          </button>
          <label>Validar Compra</label>
        </div>
        <div className={styles.validar_ingressos}>
          <button onClick={() => RecuperarIngresso()}>
            <Image
              src={qrcode}
              alt="validar"
              className={styles.vender_ingressos_img_validar}
            />
          </button>
          <label>QR Code</label>
        </div>
      </div>
    </div>
  );
}
