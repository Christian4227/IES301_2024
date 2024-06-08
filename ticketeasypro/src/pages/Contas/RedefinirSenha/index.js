"c"
import React, { useCallback, useState } from "react";
import PasswordAndConfirmForm from "@/components/forms/PasswordAndConfirmForm";

const RedefinirSenha = () => {
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleValidityChange = useCallback((isValid) => {
    setIsPasswordValid(isValid);
  }, [setIsPasswordValid])


  const handlePasswordChange = useCallback((newPassword, newConfirmPassword) => {
    setPassword(newPassword);
    setConfirmPassword(newConfirmPassword);
  }, [setPassword, setConfirmPassword])

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (isPasswordValid) {
      // Lógica para enviar o formulário
      console.log("Formulário válido e enviado!", { password, confirmPassword });
    } else {
      console.log("Formulário inválido, corrija os erros.");
    }
  }, [isPasswordValid, confirmPassword, password])

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