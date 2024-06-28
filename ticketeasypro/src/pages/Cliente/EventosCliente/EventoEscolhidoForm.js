import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Cliente.module.css";
import TicketRow from "@/components/TicketRow/TicketRow";
import client from "@/utils/client_axios";
import { getToken } from "@/utils";
import LoadingOverlay from "@components/LoadingOverlay";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import "bootstrap/dist/css/bootstrap.min.css";

const TicketForm = () => {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([{ type: "", quantity: 1 }]);
  const [total, setTotal] = useState(0);
  const [ticketsFree, setTicketsFree] = useState(0);
  const [event, setEvent] = useState({});
  const [paymentMethod, setpaymentMethod] = useState("PIX");
  const [availableTicketTypes, setAvailableTicketTypes] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const MAX_TICKETS_FOR_USER = 5;
  const router = useRouter();
  const { eventId } = router.query;

  const setErrorMessage = useCallback(
    (message) => setMessage({ text: message, type: "error" }),
    []
  );
  const setSuccessMessage = useCallback(
    (message) => setMessage({ text: message, type: "success" }),
    []
  );

  const onPaymentMethodChange = useCallback((e) => {
    setpaymentMethod(e.target.value);
  }, []);

  const setLoadingWithDelay = (isLoading) => {
    if (isLoading) setLoading(true);
    else setTimeout(() => setLoading(false), 100);
  };

  const handleSubmit = useCallback(async () => {
    try {
      setLoadingWithDelay(true);

      const orderTickets = tickets.map((ticket) => {
        const type = availableTicketTypes.find((t) => t.name === ticket.type);
        return { typeId: type.id, quantity: ticket.quantity };
      });

      const data = {
        eventId: event.id,
        paymentMethod: paymentMethod,
        orderTickets: orderTickets,
      };

      const accessToken = getToken().accessToken;
      const response = await client.post("orders", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        setSuccessMessage(
          "Compra Efetivada! Você será redirecionado para a tela de reservas."
        );
        setTimeout(() => {
          router.push("/Cliente/Ingressos/IngressosCliente");
        }, 3000); // Redireciona após 3 segundos (3000 milissegundos)
      }
    } catch (error) {
      setErrorMessage("Erro ao registrar os detalhes da compra.");
      console.error("Erro ao enviar detalhes da ordem de compra:", error);
    } finally {
      setLoadingWithDelay(false);
    }
  }, [
    tickets,
    availableTicketTypes,
    event,
    paymentMethod,
    router,
    setSuccessMessage,
    setErrorMessage,
  ]);

  const fetchDataEvent = useCallback(async () => {
    try {
      const response = await client.get(`events/${eventId}`, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });

      setEvent(response.data);
    } catch (error) {
      console.error("Erro ao buscar os detalhes do evento:", error);
    }
  }, [eventId]);

  const fetchTicketTypes = useCallback(async () => {
    try {
      const response = await client.get("ticket-types/", {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      setAvailableTicketTypes(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar os tipos de ingressos:", error);
    }
  }, []);

  const fetchTicketFree = useCallback(async () => {
    try {
      const response = await client.get(`tickets/${eventId}`, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      setTicketsFree(response.data);
    } catch (error) {
      console.error("Erro ao buscar os tipos de ingressos:", error);
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) {
      router.push("/Cliente/Ingressos/IngressosCliente");
      return;
    }

    const initialFetch = async () => {
      await fetchDataEvent();
      await fetchTicketTypes();
      await fetchTicketFree();
      updateTotal(tickets);
    };

    initialFetch();
  }, [eventId, fetchDataEvent, fetchTicketTypes, fetchTicketFree, router]);

  const handleAddRow = () => {
    if (
      tickets.length < MAX_TICKETS_FOR_USER &&
      tickets.reduce((acc, curr) => acc + curr.quantity, 0) <
        MAX_TICKETS_FOR_USER
    ) {
      setTickets([...tickets, { type: "", quantity: 1 }]);
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
    const newTickets = tickets.map((ticket, i) =>
      i === index ? { ...ticket, quantity } : ticket
    );
    const totalQuantity = newTickets.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );

    if (totalQuantity <= MAX_TICKETS_FOR_USER) {
      setTickets(newTickets);
      updateTotal(newTickets);

      if (quantity === 0) {
        handleRemoveRow(index);
      }
    }
  };

  const handleTypeChange = (index, type) => {
    const newTickets = tickets.map((ticket, i) =>
      i === index ? { ...ticket, type } : ticket
    );
    setTickets(newTickets);
    updateTotal(newTickets);
  };

  const updateTotal = useCallback(
    (tickets) => {
      const total = tickets.reduce((acc, ticket) => {
        const type = availableTicketTypes.find((t) => t.name === ticket.type);
        if (!type) return acc;
        const discount = type.discount;
        return (
          acc +
          (event.base_price - (event.base_price * discount) / 100) *
            ticket.quantity
        );
      }, 0);
      setTotal(total);
    },
    [availableTicketTypes, event]
  );

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
      {loading && <LoadingOverlay />}
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Formulário de compra" />
      <SuporteTecnico />
      <div className={styles.div_principal}>
        <div className={styles.div_principal_form}>
          <div className="div_container_maior">
            <div className="div_subtitulo">
              <h2>Formulário de compra do ingresso</h2>
            </div>
            <div>
              <h2 className="text-center py-1">{event.name}</h2>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Ingressos disponíveis
                    </label>
                    <p> {ticketsFree}</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Forma de Pagamento:
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => onPaymentMethodChange(e.target.value)}
                      className="form-select border p-2 min-w-60 max-w-72"
                    >
                      <option value="PIX">PIX</option>
                      <option value="CREDIT_CARD">Cartão de Crédito</option>
                      <option value="DEBIT_CARD">Cartão de Débito</option>
                      <option value="BANK_SLIP">Boleto Bancário</option>
                      <option value="CASH">Dinheiro</option>
                    </select>
                  </div>
                </div>{" "}
                <div className="mb-4">
                  <label className="block text-gray-700">Preço base</label>
                  <p>
                    R${" "}
                    {(event.base_price / 100).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
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
                    totalTickets={tickets.length}
                  />
                ))}
              </div>
            </div>
            <hr />
            <div className="flex justify-between items-center my-4">
              <h2 className="text-xl font-bold">Total</h2>
              <h2 className="text-xl font-bold">
                R${" "}
                {(total / 100).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>
            <div className="flex justify-around">
              <button
                onClick={handleSubmit}
                disabled={total === 0}
                className={`${total === 0 ? "bg-gray-500" : "bg-blue-500"} text-white px-4 py-2 rounded`}
              >
                Salvar
              </button>
              <button
                className={`bg-red-500 text-white px-4 py-2 rounded`}
                onClick={() => router.back()}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
};
export default TicketForm;
