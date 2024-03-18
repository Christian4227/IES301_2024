import Cabecalho from "./Cabecalho";
import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import facebook from "../assets/facebook.png";
import whatsapp from "../assets/whatsapp.png";
import instagram from "../assets/instagram.jpg";
// import imagem1 from "../assets/torre_miroku.jpg";
import capoeira from "../assets/capoeira.jpg";
import futebol from "../assets/jogo de futebol.webp";
import disney from "../assets/disney_World.jpg";
import fest_japao from "../assets/festival do japão.jpg";
import torre_miroku from "../assets/torre_miroku.jpg";
import festas from "../assets/formatura.jpg";
import musica from "../assets/rock in rio.jpg";
import seta_direita from "../assets/seta_direita.png";
import seta_esquerda from "../assets/seta esquerda.png";

export default function Home() {
    const [imagem, setImagem] = useState(musica);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [indexI, setIndexI] = useState(0);
    const containerRef = useRef();
    const listaImagens = [
        musica,
        disney,
        festas,
        fest_japao,
        capoeira,
        futebol,
        torre_miroku,
    ];

    function TrocarImagem(index) {
        var imagemSel = listaImagens[index];
        setImagem(imagemSel);
        document.getElementById("imgPainel").src = imagem;
    }

    const DeslocarImagemNovidade = (amount) => {
        const newScrollPosition = scrollPosition + amount;

        if (newScrollPosition <= 0) {
            setScrollPosition(0);
        } else if (newScrollPosition >= 700) {
            setScrollPosition(700);
        } else {
            setScrollPosition(newScrollPosition);
        }

        containerRef.current.scrollLeft = newScrollPosition;
    };

    setTimeout(() => {
        setIndexI(indexI + 1);
        if (indexI >= 6) {
            setIndexI(0);
        }
        var imagemSel = listaImagens[indexI];
        setImagem(imagemSel);
    }, 10000);

    return (
        <main>
            <Cabecalho />
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
                                value=""
                                id="ul_opcap_imagem0"
                                className={styles.opcao_imagem}
                                name="img_dem"
                                onClick={() => TrocarImagem(0)}
                            />
                        </li>
                        <li>
                            <input
                                type="radio"
                                value=""
                                id="ul_opcap_imagem1"
                                className={styles.opcao_imagem}
                                name="img_dem"
                                onClick={() => TrocarImagem(1)}
                            />
                        </li>
                        <li>
                            <input
                                type="radio"
                                value=""
                                id="ul_opcap_imagem2"
                                className={styles.opcao_imagem}
                                name="img_dem"
                                onClick={() => TrocarImagem(2)}
                            />
                        </li>
                        <li>
                            <input
                                type="radio"
                                value=""
                                id="ul_opcap_imagem3"
                                className={styles.opcao_imagem}
                                name="img_dem"
                                onClick={() => TrocarImagem(3)}
                            />
                        </li>
                        <li>
                            <input
                                type="radio"
                                value=""
                                id="ul_opcap_imagem4"
                                className={styles.opcao_imagem}
                                name="img_dem"
                                onClick={() => TrocarImagem(4)}
                            />
                        </li>
                        <li>
                            <input
                                type="radio"
                                value=""
                                id="ul_opcap_imagem5"
                                className={styles.opcao_imagem}
                                name="img_dem"
                                onClick={() => TrocarImagem(5)}
                            />
                        </li>
                        <li>
                            <input
                                type="radio"
                                value=""
                                id="ul_opcap_imagem6"
                                className={styles.opcao_imagem}
                                name="img_dem"
                                onClick={() => TrocarImagem(6)}
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
                            Compre 1 ingresso por R$ 50,00 + 4 pessoas R$ 30,00
                            cada
                        </label>
                        <br />
                        <label className={styles.frase_botao}>
                            Veja todos os ingressos disponíveis
                        </label>
                        <br />
                        <input
                            type="button"
                            value="Conferir"
                            id="botaoHomeConferir"
                            className={styles.botao_corpo}
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
                                    className={styles.botao_corpo}
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
                                    className={styles.botao_corpo}
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
                                    className={styles.botao_corpo}
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
                                    className={styles.botao_corpo}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.titulo_novidades}>
                    <h1>Novidades</h1>
                </div>
                <div className={styles.div_body2}>
                    <button
                        onClick={() => DeslocarImagemNovidade(-100)}
                        className={styles.seta_botao_esquerda}
                    >
                        <Image
                            src={seta_esquerda}
                            alt="set direita"
                            className={styles.img_seta_esquerda}
                        />
                    </button>
                    <div
                        className={styles.div_festas_novidades}
                        ref={containerRef}
                    >
                        <div className={styles.festas_novidades}>
                            <Image
                                src={capoeira}
                                alt="img_nov"
                                className={styles.img_festas_novidades}
                            />
                            <h2>Descrição do evento</h2>
                            <label>
                                Breve descrição do evento com no máximo três
                                linhas
                            </label>
                        </div>
                        <div className={styles.festas_novidades}>
                            <Image
                                src={futebol}
                                alt="img_nov"
                                className={styles.img_festas_novidades}
                            />
                            <h2>Descrição do evento</h2>
                            <label>
                                Breve descrição do evento com no máximo três
                                linhas
                            </label>
                        </div>
                        <div className={styles.festas_novidades}>
                            <Image
                                src={festas}
                                alt="img_nov"
                                className={styles.img_festas_novidades}
                            />
                            <h2>Descrição do evento</h2>
                            <label>
                                Breve descrição do evento com no máximo três
                                linhas
                            </label>
                        </div>
                        <div className={styles.festas_novidades}>
                            <Image
                                src={fest_japao}
                                alt="img_nov"
                                className={styles.img_festas_novidades}
                            />
                            <h2>Descrição do evento</h2>
                            <label>
                                Breve descrição do evento com no máximo três
                                linhas
                            </label>
                        </div>
                        <div className={styles.festas_novidades}>
                            <Image
                                src={disney}
                                alt="img_nov"
                                className={styles.img_festas_novidades}
                            />
                            <h2>Descrição do evento</h2>
                            <label>
                                Breve descrição do evento com no máximo três
                                linhas
                            </label>
                        </div>
                        <div className={styles.festas_novidades}>
                            <Image
                                src={torre_miroku}
                                alt="img_nov"
                                className={styles.img_festas_novidades}
                            />
                            <h2>Descrição do evento</h2>
                            <label>
                                Breve descrição do evento com no máximo três
                                linhas
                            </label>
                        </div>
                        <div className={styles.festas_novidades}>
                            <Image
                                src={musica}
                                alt="img_nov"
                                className={styles.img_festas_novidades}
                            />
                            <h2>Descrição do evento</h2>
                            <label>
                                Breve descrição do evento com no máximo três
                                linhas
                            </label>
                        </div>
                    </div>
                    <button
                        onClick={() => DeslocarImagemNovidade(100)}
                        className={styles.seta_botao_direita}
                    >
                        <Image
                            src={seta_direita}
                            alt="set direita"
                            className={styles.img_seta_direita}
                        />
                    </button>
                </div>
            </div>
            <div className={styles.home_footer}>
                <div className={styles.footer_esquerda}>
                    <label>Empresa fictícia Ticket Easy Pro</label>
                    <label>
                        Sede na Faculdade de Tecnologia de São Paulo - FATEC SP
                        Av. Tiradentes, 615, Bom Retiro, São Paulo, São Paulo -
                        Brasil
                    </label>
                    <label className={styles.footer_direitos}>
                        ©Copyrights | Todos os direitos reservados.
                    </label>
                </div>
                <div className={styles.footer_direita}>
                    <label>Siga a gente nas redes sociais</label>
                    <Image
                        src={facebook}
                        alt="facebook"
                        className={styles.img}
                    />
                    <Image
                        src={instagram}
                        alt="instagram"
                        className={styles.img}
                    />
                    <Image
                        src={whatsapp}
                        alt="whatsapp"
                        className={styles.img}
                    />
                    <label>(11)99999-9999</label>
                </div>
            </div>
        </main>
    );
}
