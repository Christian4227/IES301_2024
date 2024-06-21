import React from "react";
import styles from "@styles/Cliente.module.css";
import Link from "next/link";
import MenuUsuario from "@/components/MenuUsuario";

export default function CabecalhoCliente() {
  return (
    <div className={styles.Header}>
      <div>
        <Link href="/">
          <label>Ticket Easy Pro</label>
        </Link>
      </div>
      <MenuUsuario />
    </div>
  );
}
