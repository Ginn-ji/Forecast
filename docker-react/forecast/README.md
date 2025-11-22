# Inventory Forecast Web App (React + TensorFlow.js)

This project is a React web application that predicts which products need to be reordered based on:
- Current inventory level  
- Average weekly sales  
- Lead time (days to restock)  

The app uses **TensorFlow.js** to train a simple machine learning model directly in the browser.

---

### ✔ 1. Load 100 Random Products
- Each product contains:
  - Product name  
  - Inventory quantity  
  - Average sales per week  
  - Lead time  

### ✔ 2. Machine Learning Model (TensorFlow.js)
- Trains once when the page loads  
- Predicts whether each product should be **Reordered** or **Not Reordered**

### ✔ 3. Dashboard Table
- Displays all 100 products  
- Shows predictions for each  
- Includes:
  - **Load Products** button  
  - **Predict All** button  
  - **Refresh** button (resets products & predictions)

---

## 🛠 Installation & Setup

### 1. Install dependencies
```bash
npm install
