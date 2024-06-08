import React from "react";
import styles from "@styles/Componentes.module.css";

const SuporteTecnico = () => {
  return (
    <div className={styles.div_suporte_tecnico}>
      <input
        type="button"
        value="Suporte técnico"
        className={styles.botao_suporte}
      />
    </div>
  );
};

export default SuporteTecnico;
