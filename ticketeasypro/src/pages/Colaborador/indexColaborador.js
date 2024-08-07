import React from "react";
import styles from "@styles/Colaborador.module.css";
import Image from "next/image";
import tick from "public/assets/ticky branco.png";
import ticket from "public/assets/ticket.png";
import CabecalhoColaborador from "./CabecalhoColaborador";
import CabecalhoInfoColaborador from "./CabecalhoInfoColaborador";
import { useRouter } from "next/router";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";

const IndexColaborador = () => {
  const router = useRouter();
  const VenderIngressos = () => {
    router.push("/Colaborador/Vender/VenderIngressos");
  };
  const ValidarIngressos = () => {
    router.push("/Colaborador/Validar/ScannerQrCode");
  };
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Home colaborador" />
      <SuporteTecnico role="Colaborador" />
      <div className={styles.div_body_colaborador}>
        <div className={styles.vender_ingressos}>
          <button onClick={() => VenderIngressos()}>
            <Image
              src={ticket}
              alt="validar"
              className={styles.vender_ingressos_img_vender}
            />
          </button>
          <label>Vender</label>
        </div>
        {/* <div className={styles.validar_ingressos}>
          <button onClick={() => VerificarIngressos()}>
            <Image
              src={lupa}
              alt="validar"
              className={styles.vender_ingressos_img_validar}
            />
          </button>
          <label>Verificar</label>
        </div> */}
        <div className={styles.validar_ingressos}>
          <button onClick={() => ValidarIngressos()}>
            <Image
              src={tick}
              alt="validar"
              className={styles.vender_ingressos_img_validar}
            />
          </button>
          <label>Validar</label>
        </div>
      </div>
    </div>
  );
};
export default IndexColaborador;
