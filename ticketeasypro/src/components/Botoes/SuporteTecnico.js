import React from "react";
import styles from "@styles/Componentes.module.css";
import { useRouter } from "next/router";

const SuporteTecnico = ({ role }) => {
  const router = useRouter();
  const DirecionarPaginaSuporte = () => {
    switch (role) {
      case "Cliente":
        router.push();
        break;
      case "Colaborador":
        router.push();
        break;
      case "Organizador":
        router.push();
        break;
      case "Administrador":
        router.push();
        break;
      default:
        break;
    }
  };
  return (
    <div className={styles.div_suporte_tecnico}>
      <input
        type="button"
        value="Suporte técnico"
        className={styles.botao_suporte}
        onClick={() => DirecionarPaginaSuporte()}
      />
    </div>
  );
};

export default SuporteTecnico;
