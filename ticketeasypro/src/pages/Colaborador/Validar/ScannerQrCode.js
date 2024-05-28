import React, { useEffect, useState } from "react";
import styles from "../../../styles/Colaborador.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import seta from "../../../assets/seta para cima.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import client from "@/utils/client_axios";

export default function ScannerQrCode() {
    const router = useRouter();
    const [botao, setBotao] = useState(false);
    const [idIngresso, setIdIngresso] = useState("");
    // const [scannedData, setScannedData] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("qrcode", {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 100,
        });

        scanner.render(success, error);

        function success(result) {
            scanner.clear();
            // setScannedData(result);
            console.log(result);
        }

        function error(err) {
            console.warn(err);
        }

        return () => {
            scanner.clear();
        };
    }, []);

    const MenuValidar = () => {
        setBotao(!botao);
    };
    const ValidarCodigo = () => {
        let data = JSON.stringify({
            idIngresso: idIngresso,
        });
        client
            .post("", data)
            .then(() => {
                router.push("./ValidarIngresso");
            })
            .catch((error) => {
                console.log("Não foi possível identificar o ingresso.", error);
            });
    };
    return (
        <div className={styles.body_qr_code}>
            <div id="qrcode" className={styles.qrcode_scanner}></div>
            <div>
                <div className={styles.embaixo}>
                    <button
                        className={styles.botao_img}
                        onClick={() => MenuValidar()}
                    >
                        <Image src={seta} alt="" className={styles.img_botao} />
                    </button>
                    {botao ? (
                        <div className={styles.botao_grupo}>
                            <div className="mb-3">
                                <label>Código do ingresso</label>
                                <input
                                    id="btnCodigoIngresso"
                                    className="form-control"
                                    type="text"
                                    value={idIngresso}
                                    onChange={(e) =>
                                        setIdIngresso(e.target.value)
                                    }
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    id="btnCodigoIngresso"
                                    className={styles.botao_codigo}
                                    type="button"
                                    value="Validar com código do ingresso"
                                    onClick={() => ValidarCodigo()}
                                />
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}
