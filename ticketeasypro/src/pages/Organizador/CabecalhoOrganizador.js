import React from "react";
import styles from "@styles/Organizador.module.css";
import Link from "next/link";
import MenuUsuario from "@/components/MenuUsuario";

export default function CabecalhoOrganizador() {
  return (
    <div className={styles.header_cabecalho_organizador}>
      <div>
        <Link href="/">
          <label>Ticket Easy Pro</label>
        </Link>
      </div>
      <MenuUsuario />
    </div>
  );
}
