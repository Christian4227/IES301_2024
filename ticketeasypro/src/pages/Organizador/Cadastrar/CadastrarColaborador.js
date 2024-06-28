import React, { useCallback, useEffect, useState } from "react";
import CabecalhoOrganizador from "../CabecalhoOrganizador";
import CabecalhoInfoOrganizador from "../CabecalhoInfoOrganizador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import LoadingOverlay from "@components/LoadingOverlay";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@styles/Organizador.module.css";
import client from "@/utils/client_axios";
import {
  emailRegex,
  dateFormat,
  formatFixPhone,
  formatCellPhone,
} from "@/utils";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import { parseCookies } from "nookies";

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

export default function CadastrarColaborador() {
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
      dataNascimento >= minDate && dataNascimento <= maxDate;
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
      email_confirmed: false,
      birth_date: dataNascimento,
      phone: telefone,
      cellphone: celular,
      role: "STAFF",
    };
    try {
      setLoadingWithDelay(true);
      const response = await client.post("/accounts/", data, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      if (response.status == 201) {
        handleSetMessage(
          "Dados cadastrados com sucesso!\nVerifique no seu e-mail cadastrado uma mensagem de confirmação.",
          "success"
        );
      } else {
        handleSetMessage("Email ainda não enviado. Tente novamente.", "error");
      }
    } catch (error) {
      handleSetMessage("Erro desconhecido.", "error");
    } finally {
      setLoadingWithDelay(false);
    }
  };
  return (
    <div>
      <CabecalhoOrganizador />
      <CabecalhoInfoOrganizador secao="Cadastrar colaborador" />
      <SuporteTecnico />
      {loading && <LoadingOverlay />}
      <div className="div_principal">
        <div className={styles.div_form_body_organizador}>
          <form className="div_container_grande">
            <div className="div_subtitulo">
              <h1>Cadastro do colaborador</h1>
              <label>
                Insira os dados do colaborador para ajudar nos eventos.
              </label>
            </div>
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
                  value={dateFormat(dataNascimento)}
                  min={dateFormat(minDate)}
                  max={dateFormat(maxDate)}
                  onChange={(e) => setDataNascimento(new Date(e.target.value))}
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
              Cadastrar
            </button>
          </form>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
