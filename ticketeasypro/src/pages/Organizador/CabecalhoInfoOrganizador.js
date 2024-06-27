import React from "react";
import Link from "next/link";
import styles from "@styles/Organizador.module.css";
import { useRouter } from "next/router";

export default function CabecalhoInfoOrganizador({ secao }) {
  const router = useRouter();
  const Voltar = () => {
    router.back();
  };
  return (
    <div className={styles.header_organizador}>
      <div className={styles.header_organizador_subtitulo}>
        <h1>Organizador</h1>
        <label>{secao}</label>
      </div>
      <nav className={styles.header_organizador_nav}>
        <ul className={styles.header_organizador_menu}>
          <li>
            <Link href="/Organizador/GeralOrganizador">Home</Link>
          </li>
          <li>
            <Link href="/organizador/Dados/Dadosorganizador">Meus dados</Link>
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
