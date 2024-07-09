import React, { useEffect, useState } from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import PDFViewer from "@/components/PDFViewer";
import client from "@/utils/client_axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function IngressoClientePDF() {
  const router = useRouter();
  const idCompra = router.query.idCompra;
  const [dadosCompra, setDadosCompra] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = parseCookies();
        let token;
        let valorToken;
        if (cookies && cookies["ticket-token"]) {
          token = cookies["ticket-token"]; // Assumindo que o nome do cookie é 'ticket-token'
          valorToken = JSON.parse(token);
        }
        const response = await client.get(`orders/${idCompra}`, {
          headers: { Authorization: `Bearer ${valorToken?.accessToken}` },
        });
        if (response.status == 200) {
          setDadosCompra(response.data);
        }
      } catch (error) {
        toast.error("Erro ao carregar os dados");
        console.log("Erro na requisição " + error);
      }
    };
    if (idCompra) {
      fetchData();
    }
  }, [idCompra]);
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Ingresso PDF" />
      <SuporteTecnico role="Cliente"/>
      <div className="div_principal">
        <div className="div_formulario_container">
          <PDFViewer idCompra={idCompra} dado={dadosCompra} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
