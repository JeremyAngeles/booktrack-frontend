import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- AUTENTICACIÓN ---
export const loginUser = async (credentials) => {
  // credentials: { username, password }
  const response = await api.post("/users/login", credentials);
  return response.data; 
};

export const registerUser = async (userData) => {
  // userData: { username, email, password }
  const response = await api.post("/users/register", userData);
  return response.data;
};

export const updateUserPassword = async (userId, passwordData) => {
  const response = await api.put(`/users/user/${userId}/update-password`, passwordData);
  return response.data;
};

export const updateUserName = async (userId, usernameData) => {
  const response = await api.put(`/users/user/${userId}/update-username`, usernameData);
  return response.data;
};

// --- LIBROS (Google Books & Base de Datos) ---
export const exploreGoogle = async (query, page = 0, lang = "es") => {
  const response = await api.get(`/books/explore?filter=${query}&page=${page}&lang=${lang}`);
  return response.data;
};

// --- HISTORIAL DE LECTURA (Reading Logs) ---

// 1. OBTENER MIS LIBROS
export const getMyReadingLog = async (userId) => {
  // Coincide con: @GetMapping("/user/{idUser}") en ReadingLogController
  const response = await api.get(`/reading-logs/user/${userId}`);
  return response.data;
};

// 2. GUARDAR LIBRO (Desde Google)
export const saveBookToLog = async (userId, bookData) => {
  // Coincide con: @PostMapping("/save-google/{userId}")
  const response = await api.post(`/reading-logs/save-google/${userId}`, bookData);
  return response.data;
};

// 3. ACTUALIZAR ESTADO/RESEÑA
export const updateReadingLog = async (idReading, updateDTO) => {
  // Coincide con: @PutMapping("/{idReading}")
  // IMPORTANTE: updateDTO debe tener { status, rating, review, favoriteParts }
  const response = await api.put(`/reading-logs/${idReading}`, updateDTO);
  return response.data;
};

// 4. ELIMINAR LIBRO DE MI LISTA
export const deleteLogEntry = async (idReading) => {
  // Coincide con: @DeleteMapping("/{idReading}")
  await api.delete(`/reading-logs/${idReading}`);
};

// --- PRECIOS (Price Tracker) ---
export const getBookPrices = async (userId, bookId) => {
  // Coincide con: @GetMapping("/user/{idUser}/book/{idBook}")
  const response = await api.get(`/prices/user/${userId}/book/${bookId}`);
  return response.data;
};

export const addPrice = async (userId, priceData) => {
  // Coincide con: @PostMapping("/{idUser}")
  const response = await api.post(`/prices/${userId}`, priceData);
  return response.data;
};

export const deletePrice = async (idPrice) => {
  // Coincide con: @DeleteMapping("/{idPrice}")
  await api.delete(`/prices/${idPrice}`);
};

// Buscar en MIS LIBROS por Título
export const searchMyBooksByTitle = async (userId, title) => {
  const response = await api.get(`/reading-logs/user/${userId}/search-title?title=${title}`);
  return response.data;
};

// Buscar en MIS LIBROS por Autor
export const searchMyBooksByAuthor = async (userId, author) => {
  const response = await api.get(`/reading-logs/user/${userId}/search-author?author=${author}`);
  return response.data;
};

export const updatePrice = async (idPrice, priceData) => {
    try {
        // Usamos PUT porque es una actualización completa del recurso
        const response = await api.put(`/prices/${idPrice}`, priceData);
        return response.data;
    } catch (error) {
        console.error("Error en updatePrice service:", error);
        throw error;
    }
};

export const requestPasswordRecovery = async (email) => {
  // Coincide con: @PostMapping("/users/forgot-password")
  const response = await api.post("/users/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  // Coincide con: @PostMapping("/users/reset-password")
  const response = await api.post("/users/reset-password", { token, newPassword });
  return response.data;
};