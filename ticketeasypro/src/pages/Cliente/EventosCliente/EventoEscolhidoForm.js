import React, { useState, useEffect } from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Cliente.module.css";
import TicketRow from "@/components/TicketRow/TicketRow";
import client from "@/utils/client_axios";

const TicketForm = () => {
  const [tickets, setTickets] = useState([{ type: "", quantity: 0 }]);
  const [total, setTotal] = useState(0);
  const [availableTicketTypes, setAvailableTicketTypes] = useState([]);

  useEffect(() => {
    // Função para buscar os tipos de ingressos
    const fetchTicketTypes = async () => {
      try {
        const response = await client.get("ticket-types/");
        setAvailableTicketTypes(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar os tipos de ingressos:", error);
      }
    };

    fetchTicketTypes();
  }, []);

  const handleAddRow = () => {
    if (tickets.length < 5) {
      setTickets([...tickets, { type: "", quantity: 0 }]);
    }
  };

  const handleRemoveRow = (index) => {
    const newTickets = tickets.filter((_, i) => i !== index);
    setTickets(newTickets);
    updateTotal(newTickets);
  };

  const handleQuantityChange = (index, quantity) => {
    const newTickets = tickets.map((ticket, i) =>
      i === index ? { ...ticket, quantity } : ticket
    );
    if (newTickets.reduce((acc, curr) => acc + curr.quantity, 0) <= 5) {
      setTickets(newTickets);
      updateTotal(newTickets);
    }
  };

  const handleTypeChange = (index, type) => {
    const newTickets = tickets.map((ticket, i) =>
      i === index ? { ...ticket, type } : ticket
    );
    setTickets(newTickets);
  };

  const updateTotal = (tickets) => {
    const total = tickets.reduce((acc, curr) => acc + curr.quantity * 100, 0);
    setTotal(total);
  };

  const getAvailableTypes = (index) => {
    const selectedTypes = tickets
      .map((ticket) => ticket.type)
      .filter((type) => type);
    return availableTicketTypes.filter(
      (type) =>
        !selectedTypes.includes(type.name) || tickets[index].type === type.name
    );
  };

  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Formulário de compra" />
      <SuporteTecnico />
      <div className={styles.div_principal}>
        <div className="div_container_principal w-2/3">
          <div className="div_subtitulo ">
            <h1 className="text-center">Formulário de compra do ingresso</h1>
            <div className="flex justify-between">
              <div className="mb-4">
                <label className="block text-gray-700">
                  Ingressos disponíveis
                </label>
                <p>100</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Preço base</label>
                <p>R$ 100,00</p>
              </div>
            </div>
            <div className={`flex flex-col items-center justify-center`}>
              {tickets.map((ticket, index) => (
                <TicketRow
                  key={index}
                  index={index}
                  ticket={ticket}
                  onAddRow={handleAddRow}
                  onRemoveRow={handleRemoveRow}
                  onQuantityChange={handleQuantityChange}
                  onTypeChange={handleTypeChange}
                  availableTypes={getAvailableTypes(index)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center my-4">
            <h2 className="text-xl font-bold">Total</h2>
            <h2 className="text-xl font-bold">
              R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="flex justify-between">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Salvar
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
