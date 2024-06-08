import client from "@/utils/client_axios";
import React, { useState } from "react";
import PropTypes from 'prop-types';
import zxcvbn from "zxcvbn";
import client from "@/utils/client_axios";

// eslint-disable-next-line react/prop-types
const PasswordResetForm = ({ token }) => {
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    const { score } = zxcvbn(newPassword);
    setScore(score);
  };

  const getPasswordStrength = (score) => {
    switch (score) {
      case 0:
      case 1:
        return "Muito fraca";
      case 2:
        return "Fraca";
      case 3:
        return "Boa";
      case 4:
        return "Forte";
      default:
        return "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await client.post("/api/reset-password", {
        token,
        newPassword: password,
      });

      if (response.status === 200) {
        setMessage("Senha redefinida com sucesso.");
      } else {
        setMessage("Erro ao redefinir senha.");
      }
    } catch (error) {
      setMessage("Erro ao redefinir senha.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded"
    >
      <label className="block mb-2">
        Nova Senha:
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
          className="w-full p-2 mt-1 border rounded"
        />
      </label>
      <div className="mt-2">
        <strong>Força da senha:</strong> {getPasswordStrength(score)}
      </div>
      <div className="flex mt-2 space-x-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 ${i < score + 1 ? getColor(score) : "bg-gray-200"}`}
          ></div>
        ))}
      </div>
      <button
        type="submit"
        className="w-full p-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Redefinir Senha
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

const getColor = (score) => {
  switch (score) {
    case 0:
      return "bg-red-500";
    case 1:
      return "bg-orange-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-green-500";
    default:
      return "bg-gray-200";
  }
};

PasswordResetForm.propTypes = {
    token: PropTypes.string.isRequired
}

export default PasswordResetForm;
