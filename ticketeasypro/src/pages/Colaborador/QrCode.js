import React, { useRef, useState } from "react";
import QRCode from "qrcode";

export default function QrCode() {
    const canvasRef = useRef(null);
    const [image, setImage] = useState("");
    const Gerar = () => {
        QRCode.toCanvas(canvasRef.current, "Teste", { width: 250 }, (error) => {
            if (error) {
                console.error("Erro ao gerar o QR Code.", error);
            } else {
                // Capture the image as a Data URL
                const dataUrl = canvasRef.current.toDataURL();
                setImage(dataUrl);
                console.log(image);
            }
        });
    };
    return (
        <div>
            <button onClick={() => Gerar()}>Gerar</button>
            <canvas
                ref={canvasRef}
                style={{ width: "100vw", height: "100vh" }}
            ></canvas>
        </div>
    );
}
