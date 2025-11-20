const BASE_URL = "http://127.0.0.1:5000";

export async function apiFetch(path, { method = "GET", body, token } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401 && token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/session-expired";
        return;
    }

    let data = null;
    try {
        data = await res.json();
    } catch {
    }

    if (!res.ok) {
        const msg =
            (data && (data.error || data.mensaje)) ||
            `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
}
