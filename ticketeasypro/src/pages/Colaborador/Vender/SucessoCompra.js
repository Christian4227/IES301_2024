import React from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import Image from "next/image";
import sucesso from "public/assets/ticky_verde.png";
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
      <CabecalhoInfoColaborador secao="Compra bem sucedida." />
      <SuporteTecnico role="Colaborador" />
      <div className="div_principal">
        <div className={styles.div_mensagem_colaborador}>
          <div className="div_container_maior">
            <div className={styles.div_img_sucesso_colaborador}>
              <div className={styles.div_img_sucesso_colaborador_itens}>
                <Image
                  src={sucesso}
                  alt=""
                  className={styles.img_sucesso_colaborador}
                />
                <h1>Compra validada com sucesso!</h1>
                <p>
                  Agora o cliente pode baixar o PDF com os ingressos e garantir
                  a sua entrada no evento.
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
    </div>
  );
}
