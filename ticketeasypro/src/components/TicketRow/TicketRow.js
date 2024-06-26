import React from 'react';

const TicketRow = ({ index, ticket, onAddRow, onRemoveRow, onQuantityChange, onTypeChange, availableTypes }) => {
  return (
    <div className="flex items-center space-x-2 my-2 border-b border-solid border-gray-300">
      <select
        value={ticket.type}
        onChange={(e) => onTypeChange(index, e.target.value)}
        className="border p-2 flex-1 w-6/12"
      >
        <option value="" disabled>Selecione o tipo de ingresso</option>
        {availableTypes.map((type, i) => (
          <option key={i} value={type.name}>{type.name}</option>
        ))}
      </select>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onQuantityChange(index, Math.max(0, ticket.quantity - 1))}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          -
        </button>
        <input
          type="number"
          value={ticket.quantity}
          onChange={(e) => onQuantityChange(index, Math.max(0, Math.min(5, parseInt(e.target.value))))}
          className="border p-2 w-16 text-center"
          min="0"
          max="5"
        />
        <button
          onClick={() => onQuantityChange(index, Math.min(5, ticket.quantity + 1))}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          +
        </button>
        <button onClick={onAddRow} className="bg-green-500 text-white px-2 py-1 rounded">
          +
        </button>
        <button onClick={() => onRemoveRow(index)} className="bg-red-500 text-white px-2 py-1 rounded">
          -
        </button>
      </div>
    </div>
  );
};

export default TicketRow;
