import React, { useState } from "react";
// import styles from "../../styles/Colaborador.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";

export default function CodigoIngresso() {
    const router = useRouter();
    const [codigoIngresso, setCodigoIngresso] = useState("");
    const ValidarCodigoIngresso = () => {
        router.push("/Colaborador/ValidarIngresso");
    };
    return (
        <div>
            <div>
                <form>
                    <label>Código do ingresso</label>
                    <input
                        type="text"
                        placeholder="X0"
                        value={codigoIngresso}
                        onChange={(e) => setCodigoIngresso(e.target.value)}
                    />
                    <input
                        type="submit"
                        id="btnValidarCodigoIngresso"
                        value="Enviar"
                        onClick={() => ValidarCodigoIngresso()}
                    />
                </form>
            </div>
        </div>
    );
}
