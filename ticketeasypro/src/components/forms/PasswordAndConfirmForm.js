import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import zxcvbn from "zxcvbn";
import PropTypes from "prop-types";

const PasswordAndConfirmForm = ({ minStrength, onPasswordChange, onValidityChange }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const [score, setScore] = useState(0);

    const handlePasswordInputChange = (event) => {
        const newPassword = event.target.value;
        const { score } = zxcvbn(newPassword);
        setScore(score);
        setPassword(newPassword);
        onPasswordChange(newPassword, confirmPassword); // Passando a senha e a confirmação para fora
    };

    const handleConfirmPasswordInputChange = (event) => {
        const newConfirmPassword = event.target.value;
        setConfirmPassword(newConfirmPassword);
        onPasswordChange(password, newConfirmPassword); // Passando a senha e a confirmação para fora
    };

    const getPasswordStrength = (score) => {
        switch (score) {
            case 0:
                return "Muito fraca";
            case 1:
                return "Fraca";
            case 2:
                return "Boa";
            case 3:
                return "Forte";
            case 4:
                return "Muito Forte";
            default:
                return "";
        }
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
                return "bg-green-400";
            case 4:
                return "bg-green-700";
            default:
                return "bg-gray-200";
        }
    };

    useEffect(() => {
        const valid = score >= minStrength && password === confirmPassword;
        onValidityChange(valid);
    }, [password, confirmPassword, score, minStrength, onValidityChange]);

    return (
        <>
            {/* {console.log(`Força da senha: ${score}`)}
            {console.log(`Força mínima da senha: ${minStrength}`)} */}
            <div className="mb-0">
                <label htmlFor="InputSenha" className="form-label">
                    Senha
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="InputSenha"
                    value={password}
                    onChange={handlePasswordInputChange}
                    maxLength={32}
                    minLength={8}
                />
                <i className="text-xs p-0">Pelo menos 8 caracteres, contendo letras maiúsculas e minúsculas, números e caracteres especiais</i>
            </div>
            <div className="mb-3 p-0">
                <label htmlFor="InputConfirmSenha" className="form-label">
                    Repetir senha
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="InputConfirmSenha"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordInputChange}
                    maxLength={32}
                    minLength={8}
                    disabled={score < minStrength}
                />
            </div>
            <div className="mt-2">
                <strong>Força da senha:</strong> {getPasswordStrength(score)}
            </div>
            <div className="flex mt-2 space-x-1">
                {
                    [...Array(5)].map((_, i) => (
                        <div key={`scr-${i}`} className={`h-2 flex-1 ${i < score + 1 ? getColor(score) : "bg-gray-200"}`}></div>
                    ))
                }
            </div>
        </>
    );
};
PasswordAndConfirmForm.propTypes = {
    minStrength: PropTypes.number.isRequired,
    onPasswordChange: PropTypes.func.isRequired,
    onValidityChange: PropTypes.func.isRequired
}
export default PasswordAndConfirmForm;
