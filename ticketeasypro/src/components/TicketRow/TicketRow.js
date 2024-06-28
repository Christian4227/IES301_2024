import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TicketRow = ({
  index,
  ticket,
  onAddRow,
  onRemoveRow,
  onQuantityChange,
  onTypeChange,
  availableTypes,
  totalTickets,
}) => {
  return (
    <div className="flex items-center justify-between my-2 border-b border-solid border-gray-300">
      <div className="flex items-center space-x-2 mr-4">
        <select
          value={ticket.type}
          onChange={(e) => onTypeChange(index, e.target.value)}
          className="form-select border p-2 min-w-60 max-w-72"
        >
          <option value="">Selecione o tipo de ingresso</option>
          {availableTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            onQuantityChange(index, Math.max(0, ticket.quantity - 1))
          }
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          &#x2193;
        </button>
        <input
          type="number"
          value={ticket.quantity}
          onChange={(e) =>
            onQuantityChange(
              index,
              Math.max(0, Math.min(5, parseInt(e.target.value) || 0))
            )
          }
          className="border p-2 w-16 text-center"
          min="0"
          max="5"
        />
        <button
          onClick={() =>
            onQuantityChange(index, Math.min(5, ticket.quantity + 1))
          }
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          &#x2191;
        </button>
      </div>
      <div className="flex space-x-2 ml-4">
        {index === totalTickets - 1 && (
          <button
            onClick={onAddRow}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            +
          </button>
        )}
        <button
          onClick={() => onRemoveRow(index)}
          className={`px-2 py-1 rounded ${index === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 text-white"}`}
          disabled={index === 0}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default TicketRow;
