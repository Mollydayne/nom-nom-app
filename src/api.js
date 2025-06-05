// src/api.js

// On récupère l'URL de l'API depuis les variables d'environnement.
// Cela permet d'utiliser automatiquement localhost en local et l'URL en production.
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fonction utilitaire pour faire des requêtes vers l'API de manière centralisée.
 * Elle gère automatiquement le format JSON, les erreurs, et prépare les headers.
 *
 * @param {string} path - Le chemin de l'endpoint API (ex : '/api/users/login')
 * @param {object} options - Les options de la requête (méthode, body, headers, etc.)
 * @returns {Promise<any>} - Les données de réponse JSON ou une erreur
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  // Si la réponse n'est pas "ok" (statut HTTP non 200–299), on lève une erreur
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erreur lors de la requête API');
  }

  // On retourne la réponse parsée en JSON
  return res.json();
}
