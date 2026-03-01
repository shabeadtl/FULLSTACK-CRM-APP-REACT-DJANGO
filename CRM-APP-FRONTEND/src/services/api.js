const BASE_URL = "http://localhost:8000/api";
const getToken = () => localStorage.getItem("access_token");
const request = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    const isAuthEndpoint = endpoint.startsWith("/auth/login") || endpoint.startsWith("/auth/register") || endpoint.startsWith("/auth/forgot-password") || endpoint.startsWith("/auth/reset-password");
    if (res.status === 401 && !isAuthEndpoint) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        window.location.href = "/";
        return null;
    }

    return res;
};
export const apiGet = (endpoint) => request(endpoint);

export const apiPost = (endpoint, body) =>
    request(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
    });

export const apiPut = (endpoint, body) =>
    request(endpoint, {
        method: "PUT",
        body: JSON.stringify(body),
    });

export const apiPatch = (endpoint, body) =>
    request(endpoint, {
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined,
    });

export const apiDelete = (endpoint) =>
    request(endpoint, { method: "DELETE" });

export default { apiGet, apiPost, apiPut, apiPatch, apiDelete };
