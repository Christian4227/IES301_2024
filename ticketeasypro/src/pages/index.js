import { useRouter } from "next/router";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@styles/Home.module.css";
import facebook from "/public/assets/facebook.png";
import whatsapp from "public/assets/whatsapp.png";
import instagram from "public/assets/instagram.jpg";
import capoeira from "public/assets/capoeira.jpg";
import futebol from "public/assets/jogo de futebol.webp";
import disney from "public/assets/disney_World.jpg";
import fest_japao from "public/assets/festival do japão.jpg";
import torre_miroku from "public/assets/torre_miroku.jpg";
import festas from "public/assets/formatura.jpg";
import musica from "public/assets/rock in rio.jpg";
import fechar from "public/assets/x.png";
import Cabecalho from "./Cabecalho";
import { parseCookies } from "nookies";
import { AuthContext } from "@/context/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const listaImagens = [
    { imagem: musica, descricao: "Rock in Rio" },
    { imagem: disney, descricao: "Disney World" },
    { imagem: festas, descricao: "Formatura" },
    { imagem: fest_japao, descricao: "Festival do Japão" },
    { imagem: capoeira, descricao: "Capoeira" },
    { imagem: futebol, descricao: "Futebol" },
    { imagem: torre_miroku, descricao: "Torre de Miroku" },
  ];
  const router = useRouter();
  const { setPoliticaCookies } = useContext(AuthContext);
  const [imagem, setImagem] = useState(listaImagens[0].imagem);
  const [click, setClick] = useState(false);
  const [indexI, setIndexI] = useState(0);
  const [valorOption, setValorOption] = useState(listaImagens[0].descricao);
  const [divCokkie, setDivCokkie] = useState(true);
  const [aviso, setAviso] = useState(true);

  useEffect(() => {
    const cookie = parseCookies();
    const politica = cookie["ticket-politica"];
    if (politica) {
      setDivCokkie(false);
    }
  }, []);

  const MudarValorOption = (e) => {
    setValorOption(e.target.value);
  };

  if (!click) {
    setTimeout(() => {
      setIndexI(indexI + 1);
      if (indexI >= listaImagens.length - 1) {
        setIndexI(0);
      }
      var imagemSel = listaImagens[indexI].imagem;
      var imagemDescricao = listaImagens[indexI].descricao;
      setImagem(imagemSel);
      setValorOption(imagemDescricao);
    }, 3000);
  }

  const TrocarImagem = (index) => {
    var imagemSel = listaImagens[index].imagem;
    setImagem(imagemSel);
    document.getElementById("imgPainel").src = imagem;
    setClick(true);
  };

  const VisualizarTipoEvento = () => {
    toast.error("Selecione um evento na página de eventos");
  };

  const VisualizarEvento = () => {
    router.push("./InfoEventos");
  };

  // Política de cookies
  const FecharPolitica = () => {
    setPoliticaCookies();
    setDivCokkie(false);
  };

  const Aviso = () => {
    setAviso(!aviso);
  };
  return (
    <main className={styles.div_principal}>
      <div id="div-principal">
        <Cabecalho className={styles.header} />
        <div className={styles.div_aviso}>
          {aviso ? (
            <div className={styles.div_conteudo}>
              <button className={styles.btn_fechar} onClick={() => Aviso()}>
                <Image src={fechar} alt="" width={20} height={20} />
              </button>
              <label>Aviso</label>
              <p>
                Este site tem como propósito educacional e não têm outros
                objetivos. Por meio deste site, é possível ver o trabalho feito
                por alunos, apesar de utilizar cookies com o objetivo de
                armazenar informações para serem utilizadas no sistema para o
                seu funcionamento.
              </p>
              <p>
                No entanto, esta é uma versão estática e não funcional, mesmo
                com acesso a páginas dos tipos de usuários criados para este
                fim.
              </p>
            </div>
          ) : (
            <div className={styles.div_conteudo}>
              <button className={styles.btn_abrir} onClick={() => Aviso()}>
                Expandir aviso
              </button>
            </div>
          )}
        </div>
        <div className={styles.div_demonstracao}>
          <Image
            id="imgPainel"
            src={imagem}
            alt="imagens_demonstracao"
            className={styles.imagem_demonstracao}
          />
          <nav className={styles.navOpcoes}>
            <ul className={styles.ul_opcoes}>
              <li>
                <input
                  type="radio"
                  value={listaImagens[0].descricao}
                  id="ul_opcap_imagem0"
                  className={styles.opcao_imagem}
                  name="img_dem"
                  onClick={() => TrocarImagem(0)}
                  onChange={MudarValorOption}
                  checked={valorOption === "Rock in Rio"}
                />
              </li>
              <li>
                <input
                  type="radio"
                  value={listaImagens[1].descricao}
                  id="ul_opcap_imagem1"
                  className={styles.opcao_imagem}
                  name="img_dem"
                  onClick={() => TrocarImagem(1)}
                  onChange={MudarValorOption}
                  checked={valorOption === "Disney World"}
                />
              </li>
              <li>
                <input
                  type="radio"
                  value={listaImagens[2].descricao}
                  id="ul_opcap_imagem2"
                  className={styles.opcao_imagem}
                  name="img_dem"
                  onClick={() => TrocarImagem(2)}
                  onChange={MudarValorOption}
                  checked={valorOption === "Formatura"}
                />
              </li>
              <li>
                <input
                  type="radio"
                  value={listaImagens[3].descricao}
                  id="ul_opcap_imagem3"
                  className={styles.opcao_imagem}
                  name="img_dem"
                  onClick={() => TrocarImagem(3)}
                  onChange={MudarValorOption}
                  checked={valorOption === "Festival do Japão"}
                />
              </li>
              <li>
                <input
                  type="radio"
                  value={listaImagens[4].descricao}
                  id="ul_opcap_imagem4"
                  className={styles.opcao_imagem}
                  name="img_dem"
                  onClick={() => TrocarImagem(4)}
                  onChange={MudarValorOption}
                  checked={valorOption === "Capoeira"}
                />
              </li>
              <li>
                <input
                  type="radio"
                  value={listaImagens[5].descricao}
                  id="ul_opcap_imagem5"
                  className={styles.opcao_imagem}
                  name="img_dem"
                  onClick={() => TrocarImagem(5)}
                  onChange={MudarValorOption}
                  checked={valorOption === "Futebol"}
                />
              </li>
              <li>
                <input
                  type="radio"
                  value={listaImagens[6].descricao}
                  id="ul_opcap_imagem6"
                  className={styles.opcao_imagem}
                  name="img_dem"
                  onClick={() => TrocarImagem(6)}
                  onChange={MudarValorOption}
                  checked={valorOption === "Torre de Miroku"}
                />
              </li>
            </ul>
          </nav>
        </div>
        <div className={styles.home_body}>
          <div className={styles.div_body1}>
            <div className={styles.home_body_esquerda}>
              <h1>Compre ingressos agora!</h1>
              <label className={styles.body_descricao}>
                Verifique os eventos disponíveis a partir de hoje com diferentes
                preços.
              </label>
              <br />
              <label className={styles.frase_botao}>Veja mais!</label>
              <br />
              <input
                type="button"
                value="Conferir"
                id="botaoHomeConferir"
                className="botao_sistema"
                onClick={() => VisualizarEvento()}
              />
            </div>
            <div className={styles.home_body_direita}>
              <label className={styles.home_body_titulo}>
                Cronograma de eventos
              </label>
              <div className={styles.menu_direita}>
                <div className={styles.home_eventos_info}>
                  <label>Eventos culturais</label>
                  <br />
                  <Image
                    src={capoeira}
                    alt="img Event. Culturais"
                    className={styles.img_menu}
                  />
                  <br />
                  <input
                    type="button"
                    value="Veja mais"
                    id="botaoEventosCulturais"
                    className="botao_sistema"
                    onClick={VisualizarTipoEvento}
                  />
                </div>
                <div className={styles.home_eventos_info}>
                  <label>Eventos esportivos</label>
                  <br />
                  <Image
                    src={futebol}
                    alt="img Event. esportivos"
                    className={styles.img_menu}
                  />
                  <br />
                  <input
                    type="button"
                    value="Veja mais"
                    id="botaoEventosEsportivos"
                    className="botao_sistema"
                    onClick={VisualizarTipoEvento}
                  />
                </div>
                <div className={styles.home_eventos_info}>
                  <label>Festas</label>
                  <br />
                  <Image
                    src={festas}
                    alt="img Festas"
                    className={styles.img_menu}
                  />
                  <br />
                  <input
                    type="button"
                    value="Veja mais"
                    id="botaoEventosFestas"
                    className="botao_sistema"
                    onClick={VisualizarTipoEvento}
                  />
                </div>
                <div className={styles.home_eventos_info}>
                  <label>Eventos musicais</label>
                  <br />
                  <Image
                    src={musica}
                    alt="img Event. Musicais"
                    className={styles.img_menu}
                  />
                  <br />
                  <input
                    type="button"
                    value="Veja mais"
                    id="botaoEventosMusicais"
                    className="botao_sistema"
                    onClick={VisualizarTipoEvento}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.home_footer}>
          <div className={styles.footer_esquerda}>
            <label>Empresa fictícia Excelsior Event Solution</label>
            <p>Sede na Faculdade de Tecnologia de São Paulo - FATEC SP</p>
            <p>
              Av. Tiradentes, 615, Bom Retiro, São Paulo, São Paulo - Brasil
            </p>
            <label className={styles.footer_direitos}>
              © Copyrights | Todos os direitos reservados.
            </label>
          </div>
          <div className={styles.footer_direita}>
            <div>
              <label>Siga a gente nas redes sociais</label>
            </div>
            <div>
              <Link href="https://www.facebook.com">
                <Image src={facebook} alt="facebook" className={styles.img} />
              </Link>
              <Link href="https://www.instagram.com">
                <Image src={instagram} alt="instagram" className={styles.img} />
              </Link>
              <Link href="https://www.whatsapp.com">
                <Image src={whatsapp} alt="whatsapp" className={styles.img} />
              </Link>
              <label>(11) 99999-9999</label>
            </div>
          </div>
        </div>
        {divCokkie ? (
          <div className={styles.div_cookie}>
            <div className={styles.div_cookie_titulo}>
              <h1>Política de utlização de cookies</h1>
            </div>
            <div className={styles.div_cookie_body}>
              <div className={styles.div_cookie_body_texto}>
                <p>
                  Nós utilizamos cookies em nosso site para armazenar
                  informações que são usadas no nosso sistema e que estão na
                  nossa <a href="3">política de cookies</a>.
                </p>
                <p> Ao concordar, você aceita a utilização de cookies.</p>
              </div>
              <div>
                <input
                  type="button"
                  className="botao_sistema"
                  value="Aceitar"
                  onClick={() => FecharPolitica()}
                />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <ToastContainer />
    </main>
  );
}
