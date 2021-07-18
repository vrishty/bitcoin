import React, { useState, useEffect, useRef } from "react";
import Dashboard from './components/Dashboard';

function App() {
  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState("");
  const [price, setprice] = useState("0.00");

  const ws = useRef(null);
  let first = useRef(false);
  const url = "https://rest.coinapi.io/";

  useEffect(() => {
    let pairs = [];
    const wsKey = "CF622E65-66D9-4CD3-A022-F4432836A5DA";
    ws.current = new WebSocket("wss://ws.coinapi.io/v1/");
    const api = async () => {
      await fetch(url + `v1/exchangerate/BTC?apikey=${wsKey}`)
        .then((res) => res.json())
        .then((data) => pairs = data.rates);

      let filtered = pairs.filter((pair) => {
        if (pair.asset_id_quote === "USD" || pair.asset_id_quote === "AUD" ||
          pair.asset_id_quote === "EUR") {
          return pair;
        }
      });

      setcurrencies(filtered);
      first.current = true;
    }
    api();
  }, []);

  useEffect(() => {
    //prevents this hook from running on initial render
    if (!first.current) {
      return;
    }
    let msg = {
      type: "hello",
      apikey: "CF622E65-66D9-4CD3-A022-F4432836A5DA",
      heartbeat: false,
      subscribe_data_type: ["quote"],
      subscribe_filter_asset_id: [pair]
    };
    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      // update the price in state
      if (data.asset_id_quote === pair) {
        setprice(data.rate);
      }
    };
  }, [pair]);

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
                {cur.asset_id_quote}
              </option>
            );
          })}
        </select>
      }
      </div>
      <Dashboard price={price} />
    </div>
  )
}

export default App;
