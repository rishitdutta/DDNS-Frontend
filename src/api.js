const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Resolve domain from backend
 * @param {string} domain
 * @returns {Promise<Object>}
 */
export async function resolveDomain(domain) {
  const response = await fetch(`${API_BASE_URL}/resolve/${domain}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Domain not found");
    }
    throw new Error("Failed to resolve domain");
  }

  return await response.json();
}

/**
 * Get specific record type
 * @param {string} domain
 * @param {string} type - 'a', 'cname', or 'txt'
 * @returns {Promise<Object>}
 */
export async function getRecord(domain, type) {
  const response = await fetch(
    `${API_BASE_URL}/resolve/${domain}/${type.toLowerCase()}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`${type.toUpperCase()} record not found`);
    }
    throw new Error("Failed to fetch record");
  }

  return await response.json();
}

/**
 * Check if domain exists
 * @param {string} domain
 * @returns {Promise<boolean>}
 */
export async function domainExists(domain) {
  const response = await fetch(`${API_BASE_URL}/exists/${domain}`);
  const data = await response.json();
  return data.exists;
}

/**
 * Get cache stats (for debugging)
 * @returns {Promise<Object>}
 */
export async function getCacheStats() {
  const response = await fetch(`${API_BASE_URL}/cache/stats`);
  return await response.json();
}
