import React from 'react';

const StateCheckbox = ({ stateCode, stateLabel, handleChange, checked }) => {
    const inputId = `checkbox-${stateCode}`;

    return (
        <div className="mb-3 select-none">
            <label htmlFor={inputId}>{stateLabel}</label>
            <input
                type="checkbox"
                className="form-check-input"
                id={inputId}
                value={stateCode}
                onChange={handleChange}
                checked={checked}
            />
        </div>
    );
};


export default StateCheckbox;
