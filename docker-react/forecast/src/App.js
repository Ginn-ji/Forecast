import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

// ------------------------------
// CREATE MODEL ONCE (OUTSIDE COMPONENT)
// ------------------------------
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [3], units: 8, activation: "relu" }));
model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
model.compile({
  optimizer: "adam",
  loss: "binaryCrossentropy",
  metrics: ["accuracy"],
});

// TRAINING DATA (static)
const trainingData = tf.tensor2d([
  [20, 50, 3],
  [5, 30, 5],
  [15, 40, 4],
  [8, 60, 2],
]);

const outputData = tf.tensor2d([[0], [1], [0], [1]]);

export default function InventoryPredictor() {
  const [products, setProducts] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [canPredict, setCanPredict] = useState(true);

  // ------------------------------
  // TRAIN MODEL ONCE WHEN PAGE LOADS
  // ------------------------------
useEffect(() => {
  async function trainOnce() {
    await model.fit(trainingData, outputData, { epochs: 200 });
  }

  trainOnce();
}, []);

  // ------------------------------
  // GENERATE 100 NEW PRODUCTS
  // ------------------------------
const generateProducts = async () => {

    const API_URL = 'http://127.0.0.1:8000/api/products';
    
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const list = await response.json();

      setProducts(list);
      setPredictions({});
      setCanPredict(true); // allow new prediction round
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Could not fetch products from API. Check the console for details.");
    }
  };
  
  // ------------------------------
  // PREDICT ALL (ONLY ONCE PER LOAD)
  // ------------------------------
  const predictAll = () => {
    if (!canPredict || products.length === 0) return;

    const results = {};

    products.forEach((p) => {
      const input = tf.tensor2d([[p.inventory, p.avgSales, p.leadTime]]);
      const pred = model.predict(input).dataSync()[0];
      results[p.id] = pred > 0.5 ? "Reorder" : "No Reorder";
    });

    setPredictions(results);
    setCanPredict(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory Reorder Predictor Dashboard</h2>

      {/* Load Products */}
      <button onClick={generateProducts} style={{ marginRight: 10 }}>
        Load Products
      </button>

      {/* Predict All */}
      <button onClick={predictAll} disabled={!canPredict || products.length === 0}>
        Predict All
      </button>

      {/* Refresh (same as Load Products) */}
      {!canPredict && (
        <button
          onClick={generateProducts}
          style={{
            marginLeft: 10,
            background: "#ff7070",
            color: "white",
            padding: "6px 12px",
          }}
        >
          Refresh
        </button>
      )}

      {products.length > 0 && (
        <table
          border="1"
          cellPadding="10"
          style={{ marginTop: 20, borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Inventory</th>
              <th>Avg Sales</th>
              <th>Lead Time</th>
              <th>Prediction</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.inventory}</td>
                <td>{p.avgSales}</td>
                <td>{p.leadTime}</td>
                <td>{predictions[p.id] || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
