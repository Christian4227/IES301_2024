"c"
import React, { useState } from "react";
import PasswordAndConfirmForm from "@/components/forms/PasswordAndConfirmForm";

const RedefinirSenha = () => {
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleValidityChange = (isValid) => {
    setIsPasswordValid(isValid);
  };

  const handlePasswordChange = (newPassword, newConfirmPassword) => {
    setPassword(newPassword);
    setConfirmPassword(newConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPasswordValid) {
      // Lógica para enviar o formulário
      console.log("Formulário válido e enviado!", { password, confirmPassword });
    } else {
      console.log("Formulário inválido, corrija os erros.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PasswordAndConfirmForm
        minStrength={2}
        onValidityChange={handleValidityChange}
        onPasswordChange={handlePasswordChange}
      />
      <button type="submit" disabled={!isPasswordValid}>
        Enviar
      </button>
    </form>
  );
};

export default RedefinirSenha;