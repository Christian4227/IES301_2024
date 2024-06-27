import React, { useContext, useEffect, useState } from "react";
import CabecalhoOrganizador from "../CabecalhoOrganizador";
import CabecalhoInfoOrganizador from "../CabecalhoInfoOrganizador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Organizador.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "@/context/Auth";
import client from "@/utils/client_axios";
import Image from "next/image";
import eventos from "../../../assets/Evento desconhecido.png";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import { dateFormat } from "@/utils";
// import { dateFormat } from "@/utils";

function getToken() {
  const cookies = parseCookies();
  let token;
  let valorToken;
  if (cookies && cookies["ticket-token"]) {
    token = cookies["ticket-token"]; // Assumindo que o nome do cookie é 'ticket-token'
    valorToken = JSON.parse(token);
  }
  return valorToken;
}

export default function EventoOrganizadorForm() {
  const router = useRouter();
  const idEvento = router.query.eventId;
  const { user } = useContext(AuthContext);
  const [nome, setNome] = useState("");
  const [dataInicio, setDataInicio] = useState();
  const [dataFinal, setDataFinal] = useState();
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState(0);
  const [capacidade, setCapacidade] = useState(0);
  const [status, setStatus] = useState("");
  const [img_baner, setImgBaner] = useState(null);
  const [img_miniatura, setImgMiniatura] = useState(null);
  const [categoria, setCategoria] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [cor, setCor] = useState("#000000");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [idLocal, setIdLocal] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [locais, setLocais] = useState([]);
  const [tipoEventos, setTipoEventos] = useState([]);

  const AdicionarLocal = () => {
    if (idLocal == "") {
      handleSetMessage("Escolha um local para obter a localização.", "error");
      return;
    }
    const info = locais.filter((item) => item.id == idLocal);

    setLatitude(info[0].latitude);
    setLongitude(info[0].longitude);
    handleSetMessage("Coordenadas obtidas com sucesso!", "success");
  };

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const salvarDados = async () => {
    const agora = new Date();

    let data;
    if (idEvento) {
      data = JSON.stringify({
        name: nome,
        event_manager: user.sub,
        description: descricao,
        ts_initial_date: new Date(dataInicio).getTime(),
        ts_final_date: new Date(dataFinal).getTime(),
        base_price: parseInt(preco),
        capacity: parseInt(capacidade),
        status: status,
        img_banner: img_baner,
        img_thumbnail: img_miniatura,
        category_id: parseInt(categoria),
        color: cor.toUpperCase(),
        location_id: parseInt(idLocal),
        updated_at: new Date(agora),
      });
    } else {
      data = JSON.stringify({
        name: nome,
        event_manager: user.sub,
        description: descricao,
        ts_initial_date: new Date(dataInicio).getTime(),
        ts_final_date: new Date(dataFinal).getTime(),
        base_price: parseInt(preco),
        capacity: parseInt(capacidade),
        status: status,
        img_banner: img_baner,
        img_thumbnail: img_miniatura,
        category_id: parseInt(categoria),
        color: cor.toUpperCase(),
        location_id: parseInt(idLocal),
        created_at: new Date(agora),
        updated_at: new Date(agora),
      });
    }

    if (idEvento) {
      try {
        await client.put(`/events/${idEvento}`, data, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        handleSetMessage("Dados do evento atualizados com sucesso!", "success");
      } catch (error) {
        handleSetMessage(
          "O seu evento não foi atualizado. Tente novamente.",
          "error"
        );
      }
    } else {
      try {
        await client.post("/events/", data, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        handleSetMessage("Dados do evento cadastrados com sucesso!", "success");
      } catch (error) {
        handleSetMessage(
          "O seu evento não foi adicionado. Tente novamente.",
          "error"
        );
      }
    }
  };

  const TransformarImagem = (arquivo, tipo) => {
    if (arquivo) {
      const reader = new FileReader();

      if (tipo == "Banner") {
        reader.onload = function (e) {
          const base64Image = e.target.result;
          setImgBaner(base64Image);
          setImageData(base64Image);
        };
      } else {
        reader.onload = function (e) {
          const base64Image = e.target.result;
          setImgMiniatura(base64Image);
        };
      }

      reader.readAsDataURL(arquivo);
    }
  };

  const VisualizarMapa = () => {
    router.push(`./MapsEventoOrganizador?lat=${latitude}&long=${longitude}`);
  };

  useEffect(() => {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = data.getMonth() + 1;
    const dia = data.getDate();

    setDataInicio(ano + "-" + mes + "-" + dia);
    setDataFinal(ano + "-" + mes + "-" + dia);
  }, []);

  useEffect(() => {
    const isNomeValid = nome.length > 0;
    const isEventTipo = categoria != "";

    var isEventStatus;
    if (idEvento) {
      isEventStatus = status != "";
    } else {
      isEventStatus = status != "" && status == "PLANNED";
    }

    const isPreco = preco >= 0;
    const isCapacidade = capacidade >= 0;
    const isDescricao = descricao.length > 0;
    const isImgBanner = img_baner != null;
    const isImgMiniatura = img_miniatura != null;
    const isLatitude = latitude != 0;
    const isLongitude = longitude != 0;
    const allBasicFieldsValid =
      isNomeValid &&
      dataInicio &&
      dataFinal &&
      isEventTipo &&
      isEventStatus &&
      isPreco &&
      isCapacidade &&
      isDescricao &&
      isImgBanner &&
      isImgMiniatura &&
      isLatitude &&
      isLongitude;

    setIsFormValid(allBasicFieldsValid);
  }, [
    nome,
    dataInicio,
    dataFinal,
    categoria,
    preco,
    capacidade,
    descricao,
    img_baner,
    img_miniatura,
    latitude,
    longitude,
    status,
    idEvento,
  ]);

  useEffect(() => {
    const fetchLocais = async () => {
      try {
        const isCookie = getToken()?.accessToken;
        if (!isCookie) {
          router.push("/");
        }
        const response = await client.get("venues/", {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        setLocais(response.data.data);
      } catch (error) {
        handleSetMessage("Erro ao carregar os locais", "error");
        console.log("Erro na requisição de locais:", error);
      }
    };
    fetchLocais();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const isCookie = getToken()?.accessToken;
        if (!isCookie) {
          router.push("/");
        }
        const response = await client.get("categories/", {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        setTipoEventos(response.data.data);
      } catch (error) {
        handleSetMessage("Erro ao carregar as categorias", "error");
        console.log("Erro na requisição de categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchDataAtualizar = async () => {
      try {
        const response = await client.get(`events/${idEvento}`, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        if (response.status == 200) {
          setNome(response.data.name);
          setDataInicio(dateFormat(new Date(response.data.initial_date)));
          setDataFinal(dateFormat(new Date(response.data.final_date)));
          setCategoria(response.data.category.id);
          setStatus(response.data.status);
          setPreco(response.data.base_price);
          setCapacidade(response.data.capacity);
          setCor(response.data.color);
          setIdLocal(response.data.location.id);
          setLatitude(response.data.location.latitude);
          setLongitude(response.data.location.longitude);
          setDescricao(response.data.description);
          setImgBaner(response.data.img_banner);
          setImgMiniatura(response.data.img_thumbnail);
          setImageData(response.data.img_banner);
        }
      } catch (error) {
        handleSetMessage("Erro ao carregar os dados", "error");
        console.log("Erro na requisição de pedidos:", error);
      }
    };
    if (idEvento) {
      fetchDataAtualizar();
    }
  }, [idEvento]);

  return (
    <div>
      <CabecalhoOrganizador />
      <CabecalhoInfoOrganizador secao="Formulário do evento" />
      <SuporteTecnico />
      <div className="div_principal">
        <div className="div_container_principal">
          <div className="div_subtitulo">
            <h2>Formulário do evento</h2>
          </div>
          <div className={styles.div_form_evento}>
            <div className={styles.div_form_evento_dados}>
              <div className="mb-3">
                <label htmlFor="InputNomeEvento" className="form-label">
                  Nome do evento
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="InputNomeEvento"
                  value={nome}
                  maxLength={20}
                  onChange={(e) => setNome(e.target.value)}
                />
                <label className="form-label">
                  Caracteres: {nome.length} / 20
                </label>
              </div>
              <div className={styles.div_form_evento_dados_data}>
                <div className="mb-3">
                  <label htmlFor="InputDataInicio" className="form-label m-0">
                    Data de início
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="InputDataInicio"
                    value={dataInicio}
                    min={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                  {!dataInicio && (
                    <i className="absolute text-red-600 text-sm mt-[0.1rem]">
                      Data inválida.
                    </i>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="InputDataFinal" className="form-label m-0">
                    Data de término
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="InputDataFinal"
                    value={dataFinal}
                    min={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                  />
                  {!dataFinal && (
                    <i className="absolute text-red-600 text-sm mt-[0.1rem]">
                      Data inválida.
                    </i>
                  )}
                </div>
                <div className="mb-3">
                  <label>Categoria do evento</label>
                  <select
                    className="form-select"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    <option value="">Selecione o tipo de categoria</option>
                    {tipoEventos.map((tipoEvento, index) => (
                      <option key={`categorias-${index}`} value={tipoEvento.id}>
                        {tipoEvento.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.div_form_evento_dados_categoria}>
                <div className="mb-3">
                  <label>Estado do evento</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Selecione o status do evento...</option>
                    <option value="PLANNED">Planejado</option>
                    <option value="IN_PROGRESS">Em progresso</option>
                    <option value="COMPLETED">Realizado</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="InputPrecoBase" className="form-label m-0">
                    Preço base
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="InputPrecoBase"
                    value={preco}
                    min={0}
                    onChange={(e) => setPreco(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="InputCapacidade" className="form-label m-0">
                    Capacidade
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="InputCapacidade"
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.div_form_evento_dados_capacidade}>
                <div className="mb-3">
                  <label>Cor do evento</label>
                  <input
                    type="color"
                    className="form-control"
                    id="InputPrecoBase"
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label>Local do evento</label>
                  <select
                    className="form-select"
                    value={idLocal}
                    onChange={(e) => setIdLocal(e.target.value)}
                  >
                    <option value="">Selecione o local do evento...</option>
                    {locais.map((local, index) => (
                      <option key={`local-evento${index}`} value={local.id}>
                        {local.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="button"
                  className="botao_sistema"
                  value="Adicionar local"
                  onClick={() => AdicionarLocal()}
                />
                <div className="mb-3">
                  <label htmlFor="InputDescricao" className="form-label">
                    Descrição
                  </label>
                  <textarea
                    className="form-control"
                    id="InputDescricao"
                    rows="3"
                    maxLength={400}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  ></textarea>
                  <label className="form-label">
                    Caracteres: {descricao.length} / 400
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.div_form_evento_img_mapa_descricao}>
              <div className={styles.div_form_evento_img}>
                <div className={styles.div_form_evento_img_mapa}>
                  <Image
                    src={imageData == null ? eventos : imageData}
                    alt=""
                    width={200}
                    height={200}
                    className={styles.img_evento_form}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="InputDataFinal" className="form-label m-0">
                    Imagem do banner
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(img) =>
                      TransformarImagem(img.target.files[0], "Banner")
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="InputDataFinal" className="form-label m-0">
                    Imagem da miniatura
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(img) =>
                      TransformarImagem(img.target.files[0], "Miniatura")
                    }
                  />
                </div>
                <input
                  type="button"
                  className="botao_sistema"
                  value="Ver mapa"
                  onClick={() => VisualizarMapa()}
                  disabled={!(latitude && longitude)}
                />
              </div>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={salvarDados}
              disabled={!isFormValid}
            >
              {idEvento ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
