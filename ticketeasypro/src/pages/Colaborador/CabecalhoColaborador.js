import React from "react";
import Link from "next/link";
import styles from "@styles/Colaborador.module.css";
import MenuUsuario from "@/components/MenuUsuario";

export default function CabecalhoColaborador() {
  return (
    <div className={styles.header_cabecalho_colaborador}>
      <div>
        <Link href="/">
          <label>Ticket Easy Pro</label>
        </Link>
      </div>
      <MenuUsuario />
    </div>
  );
}
