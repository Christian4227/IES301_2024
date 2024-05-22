import React, { useEffect, useState } from "react";
import styles from "../../styles/Colaborador.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import seta from "../../assets/seta para cima.jpg";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScannerQrCode() {
    const router = useRouter();
    const [botao, setBotao] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("qrcode", {
            qrbox: {
                width: 300,
                height: 300,
            },
            fps: 5,
        });

        scanner.render(success, error);

        function success(result) {
            scanner.clear();
            setScannedData(result);
            alert(scannedData);
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
        router.push("/Colaborador/CodigoIngresso");
    };
    return (
        <div className={styles.body_qr_code}>
            <div id="qrcode" className={styles.qrcode_scanner}></div>
            <div className={styles.embaixo}>
                <button
                    className={styles.botao_img}
                    onClick={() => MenuValidar()}
                >
                    <Image src={seta} alt="" className={styles.img_botao} />
                </button>
                {botao ? (
                    <div className={styles.botao_grupo}>
                        <input
                            id="btnCodigoIngresso"
                            className={styles.botao_codigo}
                            type="button"
                            value="Validar com código do ingresso"
                            onClick={() => ValidarCodigo()}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
