import React, { useEffect } from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import styles from "@styles/Colaborador.module.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import Image from "next/image";
import email from "../../../assets/e-mail sb.png";
import impressora from "../../../assets/Impressora sb.png";

export default function QRCodeIngresso() {
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
    return (
        <div>
            <CabecalhoColaborador />
            <CabecalhoInfoColaborador />
            <div className={styles.qrcode_scanner_body_imprimir}>
                <div id="qrcode" className={styles.qrcode_scanner_ingresso} />
                <div className={styles.div_ingresso_status}>
                    <div>
                        <label>Ingresso encontrado? Sim / Não</label>
                    </div>
                    <div className={styles.div_opcoes}>
                        <label>Opções</label>
                        <div className={styles.div_items}>
                            <div className={styles.div_img}>
                                <label>E-mail</label>
                                <Image
                                    src={email}
                                    alt=""
                                    className={
                                        styles.img_qr_code_ingresso_email
                                    }
                                />
                            </div>
                            <div className={styles.div_img}>
                                <label>Impressão / PDF</label>
                                <Image
                                    src={impressora}
                                    alt=""
                                    className={styles.img_qr_code_ingresso_pdf}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
