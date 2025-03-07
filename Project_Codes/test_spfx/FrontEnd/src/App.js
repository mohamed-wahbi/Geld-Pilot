import React, { useEffect, useState } from "react";
import "./App.css";

const BASE_URL = 'https://api.exchangeratesapi.io/v1/latest?access_key=50312359a46dbae8f60e6e8682755ad6';

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [error, setError] = useState(null);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = exchangeRate ? (amount * exchangeRate).toFixed(4) : "";
  } else {
    toAmount = amount;
    fromAmount = exchangeRate ? (amount / exchangeRate).toFixed(4) : "";
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(response => response.json())
      .then(data => {
        if (data.rates) {
          const firstCurrency = Object.keys(data.rates)[0];
          setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
          setFromCurrency(data.base);
          setToCurrency(firstCurrency);
          setExchangeRate(data.rates[firstCurrency]);
        } else {
          setError("Erreur lors de la récupération des taux de change.");
        }
      })
      .catch(() => setError("Impossible de récupérer les taux de change."));
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`${BASE_URL}&base=${fromCurrency}&symbols=${toCurrency}`)
        .then(response => response.json())
        .then(data => {
          if (data.rates && data.rates[toCurrency]) {
            setExchangeRate(data.rates[toCurrency]);
          } else {
            setError("Erreur lors de la conversion.");
          }
        })
        .catch(() => setError("Impossible de récupérer les taux mis à jour."));
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}

      <div className="currency-row">
        <input type="number" className="input" value={fromAmount} onChange={handleFromAmountChange} min="0" />
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {currencyOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="equals">=</div>

      <div className="currency-row">
        <input type="number" className="input" value={toAmount} onChange={handleToAmountChange} min="0" />
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {currencyOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default App;



