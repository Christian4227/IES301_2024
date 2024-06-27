import React from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import Image from "next/image";
import sucesso from "../../../assets/ticky_verde.png";
import styles from "@styles/Colaborador.module.css";
import { useRouter } from "next/router";

export default function SucessoValidacao() {
  const router = useRouter();
  const VoltarHomeColaborador = () => {
    router.replace("/Colaborador/IndexColaborador");
  };
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Validação bem sucedida." />
      <SuporteTecnico />
      <div className="div_principal">
        <div className="div_container_principal">
          <div className={styles.div_img_sucesso_colaborador}>
            <div className={styles.div_img_sucesso_colaborador_itens}>
              <Image
                src={sucesso}
                alt=""
                className={styles.img_sucesso_colaborador}
              />
              <h1>Ingresso validado com sucesso!</h1>
              <p>
                Acesso liberado e o cliente pode aproveitar o evento com
                tranquilidade.
              </p>
              <input
                type="button"
                className="botao_sistema"
                value="Voltar para a página inicial do colaborador"
                onClick={() => VoltarHomeColaborador()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
