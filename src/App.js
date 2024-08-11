import React, { useEffect, useState } from "react";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-toastify";

function App() {
  const [cacheSize, setCacheSize] = useState(0);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date());
  const [lookupKey, setLookupKey] = useState("");
  const [valueInCache, setValueInCache] = useState("");
  const [cacheItems, setCacheItems] = useState([]);

  const [currCapacity, setCurrCapacity] = useState(0);

  const fetchCacheSize = async () => {
    try {
      const response = await axios.get("http://localhost:3001/capacity");
      setCurrCapacity(response.data.capacity);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInitializeCache = async () => {
    try {
      await axios.post("http://localhost:3001/initialize", {
        capacity: cacheSize,
      });

      toast.success("Cache initialized successfully");
      fetchCacheSize();
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  const handleSetCache = async () => {
    try {
      await axios.post("http://localhost:3001/", {
        key,
        value,
        expiry: Math.floor(date.getTime() / 1000),
      });
      toast.success("Cache set successfully");
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  const handleGetCache = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/cache/${lookupKey}`
      );
      setValueInCache(response.data.value);
    } catch (error) {
      setValueInCache("");
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  const handleDeleteCacheItem = async (key) => {
    try {
      await axios.delete(`http://localhost:3001/cache/${key}`);
      toast.success("Cache item deleted successfully");
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:3001/ws");
    websocket.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      if (data == null) {
        setCacheItems([]);
        console.log("cache is empty");
      } else {
        setCacheItems(JSON.parse(event.data));
      }
    };
    websocket.onerror = (error) => {
      console.log(error);
      setCacheItems([]);
    };

    fetchCacheSize();

    return () => {
      websocket.close();
    };
  }, []);

  const formatExpiryTime = (epoch) => {
    const date = new Date(Number(epoch) * 1000);
    return date.toLocaleString();
  };

  return (
    <div>
      <h1>LRU Cache Viewer</h1>

      <h2>Current Cache Size: {currCapacity}</h2>

      <h3>Initialize cache</h3>

      <input
        type="number"
        value={cacheSize}
        onChange={(e) => setCacheSize(parseInt(e.target.value, 10))}
        placeholder="Cache Size"
      />
      <button onClick={handleInitializeCache}>Initialize Cache</button>

      <h3>Set cache</h3>
      <div>
        <label>
          Key:
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Key"
          />
        </label>

        <label>
          Value:
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
          />
        </label>

        <label>
          Expiry Time:
          <DateTimePicker label="Expiry" value={date} onChange={setDate} />
        </label>
        <br />
        <button onClick={handleSetCache}>Set Cache</button>
      </div>

      <h3>Get from cache</h3>
      <div>
        <label>
          Key:
          <input
            type="text"
            value={lookupKey}
            onChange={(e) => setLookupKey(e.target.value)}
            placeholder="Key"
          />
        </label>
        {valueInCache && <p>Value: {valueInCache}</p>}
        <br />
        <button onClick={handleGetCache}>Get Cache</button>
      </div>
      <div>
        <h2>Cache Items</h2>
        <ul>
          {cacheItems.map((item) => (
            <li key={item.Key}>
              {item.Key}: {item.Value} (expires at{" "}
              {formatExpiryTime(item.Expiry)} )
              <button onClick={() => handleDeleteCacheItem(item.Key)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
