import React, { useCallback, useContext, useEffect, useState } from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import LoadingOverlay from "@components/LoadingOverlay";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@styles/Colaborador.module.css";
import client from "@/utils/client_axios";
import {
  emailRegex,
  dateFormat,
  formatFixPhone,
  formatCellPhone,
} from "@/utils";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "@/context/Auth";

const minDate = (() => new Date("1910-01-01"))();
const maxDate = (() => new Date())();

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

export default function DadosColaborador() {
  const { user } = useContext(AuthContext);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [celular, setCelular] = useState("");
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [birthDateValid, setBirthDateValid] = useState(true);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const setLoadingWithDelay = (isLoading) => {
    if (isLoading) setLoading(true);
    else setTimeout(() => setLoading(false), 100);
  };
  const checkBirthdateIsValid = useCallback(() => {
    const isDataNascimentoValid =
      new Date(dataNascimento).getTime() >= new Date(minDate).getTime() &&
      new Date(dataNascimento).getTime() <= new Date(maxDate).getTime();
    setBirthDateValid(isDataNascimentoValid);
  }, [dataNascimento]);

  useEffect(() => {
    checkBirthdateIsValid();
  }, [checkBirthdateIsValid]);

  useEffect(() => {
    const isNomeValid = nome.length > 0;
    const isTelefoneValid = telefone.length === 0 || telefone.length === 14;
    const isCelularValid = celular.length === 0 || celular.length === 15;
    const isEmailValid = emailRegex.test(email);
    const allBasicFieldsValid =
      isNomeValid &&
      isTelefoneValid &&
      isCelularValid &&
      birthDateValid &&
      isEmailValid;
    const isFormCurrentlyValid = allBasicFieldsValid;

    setIsFormValid(isFormCurrentlyValid);
  }, [nome, telefone, celular, email, birthDateValid]);

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const validateEmail = (email) => emailRegex.test(email);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailValid(validateEmail(e.target.value));
  };

  const handleTelefoneChange = (e) =>
    setTelefone(formatFixPhone(e.target.value));
  const handleCelularChange = (e) =>
    setCelular(formatCellPhone(e.target.value));

  const inserirDados = async () => {
    const data = {
      email: email,
      name: nome,
      birth_date: new Date(dataNascimento).toISOString(),
      phone_fix: telefone,
      phone: celular,
    };
    try {
      setLoadingWithDelay(true);
      await client.put("/users/", data, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      handleSetMessage("Dados atualizados com sucesso.", "success");
    } catch (error) {
      const messageError = error?.response?.data?.message;
      switch (messageError) {
        case "UserAlreadyExists":
          handleSetMessage("Email já cadastrado. Faça seu login.", "error");
          break;
        default:
          handleSetMessage("Erro desconhecido.", "error");
          break;
      }
    } finally {
      setLoadingWithDelay(false);
    }
  };

  const EnviarEmailRedefinicaoSenha = async () => {
    try {
      const email = user.login;
      const response = await client.get(`accounts/password-reset/${email}`, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      if (response.status == 200) {
        handleSetMessage(
          "E-mail de redefinição de senha enviado com sucesso!",
          "success"
        );
      }
    } catch (error) {
      handleSetMessage("Erro ao carregar o perfil", "error");
      console.log("Erro na requisição de accounts:", error);
    }
  };
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const idUsuario = jwtDecode(getToken()?.accessToken.toString()).sub;
        const response = await client.get(`accounts/${idUsuario}`, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        console.log;
        setNome(response.data.name);
        setEmail(response.data.email);
        setDataNascimento(response.data.birth_date.split("T")[0]);
        setTelefone(
          response.data.phone_fix == null ? " " : response.data.phone_fix
        );
        setCelular(response.data.phone == null ? " " : response.data.phone);
      } catch (error) {
        handleSetMessage("Erro ao carregar o perfil", "error");
        console.log("Erro na requisição de accounts:", error);
      }
    };
    fetchUsuario();
  }, []);
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Dados do Colaborador" />
      <SuporteTecnico role="Colaborador" />
      {loading && <LoadingOverlay />}
      <div className="div_principal">
        <div className={styles.div_form_body_Colaborador}>
          <form className="form_perfil">
            <div className={styles.div_titulo_usuario}>
              <h2>Dados do Colaborador</h2>
            </div>
            <div className="div_form_perfil">
              <div className="mb-3">
                <label htmlFor="InputNomeCompleto" className="form-label">
                  Nome completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="InputNomeCompleto"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div
                className="mb-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "8px 20px",
                  alignItems: "center",
                }}
              >
                <label htmlFor="InputTelefone" className="form-label m-0">
                  Telefone
                </label>
                <label htmlFor="InputCelular" className="form-label m-0">
                  Celular
                </label>
                <label htmlFor="InputDataNascimento" className="form-label m-0">
                  Data de nascimento
                </label>
                <div>
                  <input
                    type="tel"
                    className="form-control"
                    id="InputTelefone"
                    maxLength={14}
                    onChange={handleTelefoneChange}
                    value={telefone}
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    className="form-control"
                    id="InputCelular"
                    maxLength={15}
                    onChange={handleCelularChange}
                    value={celular}
                  />
                </div>
                <div>
                  <input
                    type="date"
                    className="form-control"
                    id="InputDataNascimento"
                    value={
                      dataNascimento.length == 10
                        ? dataNascimento
                        : dateFormat(dataNascimento)
                    }
                    min={dateFormat(minDate)}
                    max={dateFormat(maxDate)}
                    onChange={(e) =>
                      setDataNascimento(new Date(e.target.value))
                    }
                  />
                  {!birthDateValid && (
                    <i className="absolute text-red-600 text-sm mt-[0.1rem]">
                      Data inválida.
                    </i>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="InputEmail" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className={`form-control mb-4 ${!emailValid ? "is-invalid" : ""}`}
                  id="InputEmail"
                  value={email}
                  onChange={handleEmailChange}
                />
                {!emailValid && (
                  <i className="absolute text-red-600 text-sm -mt-6">
                    Por favor, insira um e-mail válido.
                  </i>
                )}
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={inserirDados}
                disabled={!isFormValid}
              >
                Atualizar
              </button>
              <hr />
              <div className={styles.div_redefinir_senha}>
                <label>
                  Clique no botão abaixo para receber um e-mail de redefinição
                  da sua senha.
                </label>
                <input
                  type="button"
                  className="botao_sistema"
                  value="Enviar e-mail"
                  onClick={() => EnviarEmailRedefinicaoSenha()}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
