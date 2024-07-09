import React, { useState, useEffect } from "react";
import Cabecalho from "./Cabecalho";
import styles from "@styles/CadastroCliente.module.css";
import styleh from "@styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingOverlay from "@components/LoadingOverlay";
import Link from "next/link";
import client from "@/utils/client_axios";
import PasswordAndConfirmForm from "@/components/forms/PasswordAndConfirmForm";
import {
  emailRegex,
  dateFormat,
  formatFixPhone,
  formatCellPhone,
} from "@/utils";
import { useCallback } from "react";
import CabecalhoHomeMenu from "./CabecalhoHomeMenu";
import ToastMessage from "@/components/ToastMessage/ToastMessage";

const minDate = (() => new Date("1910-01-01"))();
const maxDate = (() => new Date())();

const TelaCadastroCliente = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [celular, setCelular] = useState("");
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [birthDateValid, setBirthDateValid] = useState(true);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
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
    const isFormCurrentlyValid = allBasicFieldsValid && isPasswordValid;

    setIsFormValid(isFormCurrentlyValid);
  }, [nome, telefone, celular, email, isPasswordValid, birthDateValid]);

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const handleValidityChange = (isValid) => setIsPasswordValid(isValid);
  const handlePasswordChange = (password) => setPassword(password);

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
      email,
      password,
      confirm_password: password,
      name: nome,
      birth_date: dataNascimento,
      phone: telefone,
      cellphone: celular,
    };
    try {
      setLoadingWithDelay(true);
      await client.post("/users/signin", data);
      handleSetMessage(
        "Dados cadastrados com sucesso!\nVerifique no seu e-mail cadastrado uma mensagem de confirmação.",
        "success"
      );
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

  return (
    <main>
      {loading && <LoadingOverlay />}
      <div id="div-principal">
        <Cabecalho className={styleh.header} />
        <CabecalhoHomeMenu componente="Cadastrar" />
        <div className={styles.div_cadastrar}>
          <form className="div_container_grande">
            <div className={styles.cabecalho_cadastro}>
              <h1>Cadastro das informações</h1>
              <label>Insira os seus dados para se inscrever nos eventos</label>
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
              <PasswordAndConfirmForm
                minStrength={2}
                onPasswordChange={handlePasswordChange}
                onValidityChange={handleValidityChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={inserirDados}
              disabled={!isFormValid}
            >
              Cadastrar
            </button>
            <hr />
            <div className={styles.footer_form}>
              <label>
                Não recebeu o e-mail de confirmação?{" "}
                <Link href="/Contas/RecuperarEmail">Clique aqui</Link>
              </label>
            </div>
          </form>
        </div>
        {!!message.text && (
          <ToastMessage text={message.text} type={message.type} />
        )}
      </div>
    </main>
  );
};

export default TelaCadastroCliente;
