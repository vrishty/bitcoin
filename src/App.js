import React, { useState, useEffect } from "react";

function App() {
  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState("");

  const api = "https://rest.coinapi.io/";

  useEffect(() => {
    let pairs = [];
    const wsKey = "7E345BFE-CF37-4A84-9310-A615D18ED9E4";
    const fetchCur = async () => {
      await fetch(api + `v1/exchangerate/BTC?apikey=${wsKey}`)
        .then((res) => res.json())
        .then((data) => pairs = data.rates);
      // we want only USD, AUD & EUR currencies to display
      let filtered = pairs.filter((pair) => {
        if (pair.asset_id_quote === "USD" || pair.asset_id_quote === "AUD" ||
          pair.asset_id_quote === "EUR") {
          return pair;
        }
      });

      setcurrencies(filtered);
    }
    fetchCur();
  }, []);


  // change of dropdown
  const handleSelect = (e) => {
    setpair(e.target.value);
  };

  return (
    <div className="container">
      <p>Choose a currency to see exchange rate for Bitcoin: </p>
      <div>
        {
          <select name="currency" value={pair} onChange={handleSelect}
            className="btn btn-primary">
            {currencies.map((cur, idx) => {
              return (
                <option key={idx} value={cur.asset_id}>
                  {cur.asset_id_quote} : {cur.rate}
                </option>
              );
            })}
          </select>
        }
      </div>
    </div>
  )
}

export default App;
