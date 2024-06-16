import React from "react";
import Link from "next/link";
import styles from "../../styles/Cliente.module.css";
import { useRouter } from "next/router";

export default function CabecalhoInfoCliente({ secao }) {
  const router = useRouter();
  const Voltar = () => {
    router.back();
  };
  return (
    <div className={styles.header_cliente}>
      <div className={styles.header_cliente_subtitulo}>
        <h1>Cliente</h1>
        <label>{secao}</label>
      </div>
      <nav className={styles.header_cliente_nav}>
        <ul className={styles.header_cliente_menu}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/Cliente/GeralCliente">Home cliente</Link>
          </li>
          <li>
            <Link href="/Cliente/Dadoscliente">Meus dados</Link>
          </li>
          <li>
            <a href="#" onClick={Voltar}>
              Voltar
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
