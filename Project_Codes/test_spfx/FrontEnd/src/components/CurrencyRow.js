import React from 'react';

export default function CurrencyRow({ currencyOptions, selectedCurrency, onChangeCurrency, onChangeAmount, amount }) {
  return (
    <div className="currency-row">
      <input 
        type="number" 
        className="input" 
        value={amount} 
        onChange={onChangeAmount} 
        min="0" 
      />
      <select value={selectedCurrency} onChange={onChangeCurrency}>
        {currencyOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
