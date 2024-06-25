import React from 'react';
import StateCheckbox from '../StateCheckBox/StateCheckBox';
import stylese from "@/styles/InfoEventos.module.css";

const StateColumn = ({ states, handleChange, selectedStates }) => {
    return (
        <div className={stylese.filtro_localidade_estado_col}>
            {states.map(state => (
                <StateCheckbox
                    key={state.code}
                    stateCode={state.code}
                    stateLabel={state.label}
                    handleChange={handleChange}
                    checked={selectedStates.includes(state.code)}
                />
            ))}
        </div>
    );
};
export default StateColumn;
