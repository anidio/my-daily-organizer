import axios from 'axios';

// Create React App usa 'process.env' para acessar as variáveis de ambiente.
const API_URL = process.env.REACT_APP_API_URL;

// Se a URL não for encontrada, lançamos um erro para ficar claro o problema.
if (!API_URL) {
  throw new Error("REACT_APP_API_URL não foi definida. Verifique seu arquivo .env");
}

const api = axios.create({
  baseURL: API_URL,
});

export default api;