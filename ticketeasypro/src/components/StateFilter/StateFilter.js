import React from 'react';
import StateColumn from '../StateColumn/StateColumn';
import stylese from "@/styles/InfoEventos.module.css";


const statesGroup1 = [
  { code: 'AC', label: 'AC' },
  { code: 'AL', label: 'AL' },
  { code: 'AP', label: 'AP' },
  { code: 'AM', label: 'AM' },
  { code: 'BA', label: 'BA' },
  { code: 'CE', label: 'CE' },
  { code: 'DF', label: 'DF' },
  { code: 'ES', label: 'ES' },
  { code: 'GO', label: 'GO' },
  { code: 'MA', label: 'MA' },
];

const statesGroup2 = [
  { code: 'MT', label: 'MT' },
  { code: 'MS', label: 'MS' },
  { code: 'MG', label: 'MG' },
  { code: 'PA', label: 'PA' },
  { code: 'PB', label: 'PB' },
  { code: 'PR', label: 'PR' },
  { code: 'PE', label: 'PE' },
  { code: 'PI', label: 'PI' },
  { code: 'RJ', label: 'RJ' },
  { code: 'RN', label: 'RN' },
];

const statesGroup3 = [
  { code: 'RS', label: 'RS' },
  { code: 'RO', label: 'RO' },
  { code: 'RR', label: 'RR' },
  { code: 'SC', label: 'SC' },
  { code: 'SP', label: 'SP' },
  { code: 'SE', label: 'SE' },
  { code: 'TO', label: 'TO' },
];

const StateFilter = ({ selectedStates, handleCheckboxChange }) => {
  return (
    <div>
      <div className={stylese.filtro_localidade_estado}>
        <StateColumn states={statesGroup1} handleChange={handleCheckboxChange} selectedStates={selectedStates} />
        <StateColumn states={statesGroup2} handleChange={handleCheckboxChange} selectedStates={selectedStates} />
        <StateColumn states={statesGroup3} handleChange={handleCheckboxChange} selectedStates={selectedStates} />
      </div>
    </div>
  );
};

export default StateFilter;
