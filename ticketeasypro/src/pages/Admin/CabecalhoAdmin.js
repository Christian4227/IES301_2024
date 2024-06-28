import React from "react";
import Link from "next/link";
import styles from "@styles/Administracao.module.css";
import MenuUsuario from "@/components/MenuUsuario";

export default function CabecalhoAdmin() {
  return (
    <div className={styles.header_cabecalho_administrador}>
      <div>
        <Link href="/">
          <label>Ticket Easy Pro</label>
        </Link>
      </div>
      <MenuUsuario />
    </div>
  );
}
