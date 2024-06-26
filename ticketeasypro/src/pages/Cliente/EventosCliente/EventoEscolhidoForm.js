import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/router";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Cliente.module.css";
import TicketRow from '@/components/TicketRow/TicketRow';
import client from "@/utils/client_axios";

const TicketForm = () => {
  const [tickets, setTickets] = useState([{ type: '', quantity: 1 }]);
  const [total, setTotal] = useState(0);
  const [event, setEvent] = useState({});
  const [availableTicketTypes, setAvailableTicketTypes] = useState([]);
  const MAX_TICKETS_FOR_USER = 5;
  const router = useRouter();
  const { eventId } = router.query;
  let tickets_free = 0

  const fetchDataEvent = useCallback(async (eventId) => {
    try {
      const response = await client.get(`events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Erro ao buscar os detalhes do evento:', error);
    }
  });

  const fetchTicketTypes = useCallback(async () => {
    try {
      const response = await client.get('ticket-types/');
      setAvailableTicketTypes(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar os tipos de ingressos:', error);
    }
  });

  const fetchTicketFree = useCallback(async () => {
    try {
      const response = await client.get(`ticket/${eventId}`);
      tickets_free = response.data.data;
    } catch (error) {
      console.error('Erro ao buscar os tipos de ingressos:', error);
    }
  });


  useEffect(() => {
    if (!eventId)
      router.back()
    fetchDataEvent(eventId);
    fetchTicketTypes();
  }, []);

  const handleAddRow = () => {
    if (tickets.length < MAX_TICKETS_FOR_USER && tickets.reduce((acc, curr) => acc + curr.quantity, 0) < MAX_TICKETS_FOR_USER) {
      setTickets([...tickets, { type: '', quantity: 0 }]);
    }
  };

  const handleRemoveRow = (index) => {
    if (tickets.length > 1) {
      const newTickets = tickets.filter((_, i) => i !== index);
      setTickets(newTickets);
      updateTotal(newTickets);
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const newTickets = tickets.map((ticket, i) => (i === index ? { ...ticket, quantity } : ticket));
    const totalQuantity = newTickets.reduce((acc, curr) => acc + curr.quantity, 0);

    if (totalQuantity <= MAX_TICKETS_FOR_USER) {
      setTickets(newTickets);
      updateTotal(newTickets);

      if (quantity === 0) {
        handleRemoveRow(index);
      }
    }
  };

  const handleTypeChange = (index, type) => {
    const newTickets = tickets.map((ticket, i) => (i === index ? { ...ticket, type } : ticket));
    setTickets(newTickets);
  };

  const updateTotal = (tickets) => {
    const basePrice = 100;
    const total = tickets.reduce((acc, ticket) => {
      const type = availableTicketTypes.find(t => t.name === ticket.type);
      if (!type) return acc;
      const discount = type.discount;
      return acc + ((basePrice - (basePrice * discount / 100)) * ticket.quantity);
    }, 0);
    setTotal(total);
  };

  const getAvailableTypes = (index) => {
    const selectedTypes = tickets.map((ticket) => ticket.type).filter((type) => type);
    return availableTicketTypes.filter((type) => !selectedTypes.includes(type.name) || tickets[index].type === type.name);
  };

  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Formulário de compra" />
      <SuporteTecnico />
      <div className={styles.div_principal}>
        <div className="flex-col justify-center items-center w-2/3">
          <div className="div_subtitulo ">
            <h1 className='text-center py-5'>Formulário de compra do ingresso</h1>
            <div className='flex justify-between'>
              <div className="mb-4">
                <label className="block text-gray-700">Ingressos disponíveis</label>
                <p> {tickets_free}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Preço base</label>
                <p>R$ {(event.base_price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className={`flex flex-col items-center justify-center`}>
              {tickets.map((ticket, index) => (
                <TicketRow
                  key={index}
                  basePrice={event.base_price}
                  index={index}
                  ticket={ticket}
                  onAddRow={handleAddRow}
                  onRemoveRow={handleRemoveRow}
                  onQuantityChange={handleQuantityChange}
                  onTypeChange={handleTypeChange}
                  availableTypes={getAvailableTypes(index)}
                  totalTickets={tickets.length}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center my-4">
            <h2 className="text-xl font-bold">Total</h2>
            <h2 className="text-xl font-bold">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          </div>
          <div className="flex justify-between">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Salvar</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;