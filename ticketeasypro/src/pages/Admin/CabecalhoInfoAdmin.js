import React from "react";
import Link from "next/link";
import styles from "@styles/Administracao.module.css";
import { useRouter } from "next/router";

export default function CabecalhoInfoAdmin({ secao }) {
  const router = useRouter();
  const Voltar = () => {
    router.back();
  };
  return (
    <div className={styles.header_administrador}>
      <div className={styles.header_administrador_subtitulo}>
        <h1>Administrador</h1>
        <label>{secao}</label>
      </div>
      <nav className={styles.header_administrador_nav}>
        <ul className={styles.header_administrador_menu}>
          <li>
            <Link href="/">Home</Link>
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
