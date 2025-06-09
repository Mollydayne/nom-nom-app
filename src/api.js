// src/api.js

// On récupère l'URL de l'API depuis les variables d'environnement.
// Cela permet d'utiliser automatiquement localhost en local et l'URL en production.
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fonction utilitaire pour faire des requêtes vers l'API de manière centralisée.
 * Elle ajoute automatiquement le token d'authentification si disponible,
 * gère le format JSON et centralise la gestion des erreurs.
 *
 * @param {string} path - Le chemin de l'endpoint API (ex : '/api/users/login')
 * @param {object} options - Les options de la requête (méthode, body, headers, etc.)
 * @returns {Promise<any>} - Les données de réponse JSON ou une erreur
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token'); // On récupère le token s'il existe

  // Définition des headers par défaut (JSON)
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Ajout du token dans les headers si présent
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Si un body est présent, on le transforme en JSON
  const body = options.body ? JSON.stringify(options.body) : undefined;

  // Requête vers l'API avec les options complètes
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body,
  });

  // Gestion des erreurs de réponse
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erreur lors de la requête API');
  }

  // Résultat en JSON si tout s'est bien passé
  return res.json();
}
