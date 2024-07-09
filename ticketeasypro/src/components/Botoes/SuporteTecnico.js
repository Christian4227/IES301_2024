import React from "react";
import styles from "@styles/Componentes.module.css";

const SuporteTecnico = ({ role }) => {
  const DirecionarPaginaSuporte = () => {
    switch (role) {
      case "Cliente":
        window.open("/pdf/Manual de uso - Rota Cliente.pdf", "_blank");
        break;
      case "Colaborador":
        window.open("/pdf/Manual de uso - Rota Colaborador.pdf", "_blank");
        break;
      case "Organizador":
        window.open("/pdf/Manual de uso - Rota Organizador.pdf", "_blank");
        break;
      case "Administrador":
        window.open("/pdf/Manual de uso - Rota Administrador.pdf", "_blank");
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
