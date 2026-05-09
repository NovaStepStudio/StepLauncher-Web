import { ref } from 'vue';

export const API_BASE = 'https://auth.stepnicka012.workers.dev';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserBasic {
    uuid: string;
    username: string;
    tier: string;
    avatar: string | null;
}

export interface UserFull {
    uuid: string;
    username: string;
    email: string | null;
    bio: string | null;
    premium: string;
    is_admin: boolean;
    is_online: boolean;
    last_seen: string | null;
    last_login: string | null;
    created_at: string;
    skin_url: string | null;
    cape_url: string | null;
    avatar: string | null;
    settings: Record<string, unknown> | null;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    expires_at: number;
    expires_in: number;
    user: UserBasic;
}

export interface ApiResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface Presence {
    uuid: string;
    presence: string;
    message: string | null;
    image_b64: string | null;
    updated_at: string | null;
}

// ─── Reactive State ───────────────────────────────────────────────────────────

export const currentUser = ref<UserBasic | null>(null);
export const token       = ref<string | null>(localStorage.getItem('token'));

const stored = localStorage.getItem('user');
if (stored) {
    try { currentUser.value = JSON.parse(stored) as UserBasic; }
    catch { localStorage.removeItem('user'); }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(username: string, password: string): Promise<ApiResult<LoginResponse>> {
    try {
        const res  = await fetch(`${API_BASE}/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ username, password, source: 'web' }),
        });
        const data = await res.json() as LoginResponse & { error?: string; detail?: string };
        if (res.ok && data.success) {
            currentUser.value = data.user;
            token.value       = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user',  JSON.stringify(data.user));
            return { success: true, data };
        }
        return { success: false, error: data.error ?? data.detail ?? 'Error al iniciar sesión' };
    } catch {
        return { success: false, error: 'No se pudo conectar con el servidor' };
    }
}

export async function register(username: string, email: string, password: string): Promise<ApiResult> {
    try {
        const res  = await fetch(`${API_BASE}/register`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ username, email, password }),
        });
        const data = await res.json() as { success?: boolean; user?: unknown; error?: string; detail?: string };
        if (res.ok && (data.success || data.user)) return { success: true };
        return { success: false, error: data.error ?? data.detail ?? 'Error al crear la cuenta' };
    } catch {
        return { success: false, error: 'No se pudo conectar con el servidor' };
    }
}

export function logout(): void {
    currentUser.value = null;
    token.value       = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getMe(): Promise<ApiResult<UserFull>> {
    const t = token.value;
    if (!t) return { success: false, error: 'No estás autenticado' };
    try {
        const res  = await fetch(`${API_BASE}/me`, {
            headers: { Authorization: `Bearer ${t}` },
        });
        const data = await res.json() as UserFull & { error?: string };
        if (res.ok) return { success: true, data };
        return { success: false, error: data.error ?? 'Error al obtener perfil' };
    } catch {
        return { success: false, error: 'Error de red' };
    }
}

export async function updateProfile(updates: Partial<Pick<UserFull, 'bio' | 'avatar'>>): Promise<ApiResult> {
    const t = token.value;
    if (!t) return { success: false, error: 'No estás autenticado' };
    try {
        const res = await fetch(`${API_BASE}/me`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
            body:    JSON.stringify(updates),
        });
        if (res.ok) return { success: true };
        const data = await res.json() as { error?: string };
        return { success: false, error: data.error ?? 'Error al actualizar' };
    } catch {
        return { success: false, error: 'Error de red' };
    }
}

export async function updateSettings(settings: Record<string, unknown>): Promise<ApiResult> {
    const t = token.value;
    if (!t) return { success: false, error: 'No estás autenticado' };
    try {
        const res = await fetch(`${API_BASE}/me/settings`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
            body:    JSON.stringify({ settings }),
        });
        if (res.ok) return { success: true };
        const data = await res.json() as { error?: string };
        return { success: false, error: data.error ?? 'Error al guardar config' };
    } catch {
        return { success: false, error: 'Error de red' };
    }
}

// ─── Cosmetics ────────────────────────────────────────────────────────────────

export async function getSkins(): Promise<ApiResult<unknown[]>> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res  = await fetch(`${API_BASE}/me/skins`, { headers: { Authorization: `Bearer ${t}` } });
        const data = await res.json() as unknown[] | { error?: string };
        if (res.ok) return { success: true, data: data as unknown[] };
        return { success: false, error: (data as {error?:string}).error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

export async function getCapes(): Promise<ApiResult<unknown[]>> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res  = await fetch(`${API_BASE}/me/capes`, { headers: { Authorization: `Bearer ${t}` } });
        const data = await res.json() as unknown[] | { error?: string };
        if (res.ok) return { success: true, data: data as unknown[] };
        return { success: false, error: (data as {error?:string}).error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

export async function getKits(): Promise<ApiResult<unknown[]>> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res  = await fetch(`${API_BASE}/me/kits`, { headers: { Authorization: `Bearer ${t}` } });
        const data = await res.json() as unknown[] | { error?: string };
        if (res.ok) return { success: true, data: data as unknown[] };
        return { success: false, error: (data as {error?:string}).error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

// ─── Social ───────────────────────────────────────────────────────────────────

export async function getFriends(): Promise<ApiResult<unknown[]>> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res  = await fetch(`${API_BASE}/me/friends`, { headers: { Authorization: `Bearer ${t}` } });
        const data = await res.json() as unknown[] | { error?: string };
        if (res.ok) return { success: true, data: data as unknown[] };
        return { success: false, error: (data as {error?:string}).error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

export async function getFriendRequests(): Promise<ApiResult<{ received: unknown[]; sent: unknown[] }>> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const [recRes, sentRes] = await Promise.all([
            fetch(`${API_BASE}/me/friends/requests/received`, { headers: { Authorization: `Bearer ${t}` } }),
            fetch(`${API_BASE}/me/friends/requests/sent`,     { headers: { Authorization: `Bearer ${t}` } }),
        ]);
        const received = (await recRes.json()) as unknown[];
        const sent     = (await sentRes.json()) as unknown[];
        return { success: true, data: { received, sent } };
    } catch { return { success: false, error: 'Error de red' }; }
}

// ─── Presence ─────────────────────────────────────────────────────────────────

export async function getPresence(uuid: string): Promise<ApiResult<Presence>> {
    try {
        const res  = await fetch(`${API_BASE}/presence/${uuid}`);
        const data = await res.json() as Presence & { error?: string };
        if (res.ok) return { success: true, data };
        return { success: false, error: data.error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

export async function setPresence(uuid: string, presence: string, message?: string): Promise<ApiResult> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res = await fetch(`${API_BASE}/presence`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ uuid, accessToken: t, presence, message }),
        });
        if (res.ok) return { success: true };
        const data = await res.json() as { error?: string };
        return { success: false, error: data.error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function getHealth(): Promise<ApiResult<unknown>> {
    try {
        const res  = await fetch(`${API_BASE}/health`);
        const data = await res.json() as unknown;
        if (res.ok) return { success: true, data };
        return { success: false, error: 'Error al obtener estado' };
    } catch { return { success: false, error: 'Error de red' }; }
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function uploadSkin(file: File, name: string): Promise<ApiResult<unknown>> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    const form = new FormData();
    form.append('file', file);
    form.append('name', name);
    try {
        const res  = await fetch(`${API_BASE}/me/skins/upload`, {
            method: 'POST', headers: { Authorization: `Bearer ${t}` }, body: form,
        });
        const data = await res.json() as { success?: boolean; skin?: unknown; error?: string };
        if (res.ok) return { success: true, data: data.skin };
        return { success: false, error: data.error ?? 'Error al subir skin' };
    } catch { return { success: false, error: 'Error de red' }; }
}

export async function uploadCape(file: File, name: string): Promise<ApiResult<unknown>> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    const form = new FormData();
    form.append('file', file);
    form.append('name', name);
    try {
        const res  = await fetch(`${API_BASE}/me/capes/upload`, {
            method: 'POST', headers: { Authorization: `Bearer ${t}` }, body: form,
        });
        const data = await res.json() as { success?: boolean; cape?: unknown; error?: string };
        if (res.ok) return { success: true, data: data.cape };
        return { success: false, error: data.error ?? 'Error al subir capa' };
    } catch { return { success: false, error: 'Error de red' }; }
}

// ─── Activate ─────────────────────────────────────────────────────────────────

export async function activateSkin(skinId: number): Promise<ApiResult> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res = await fetch(`${API_BASE}/me/skins/${skinId}/activate`, {
            method: 'POST', headers: { Authorization: `Bearer ${t}` },
        });
        if (res.ok) return { success: true };
        const data = await res.json() as { error?: string };
        return { success: false, error: data.error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

export async function activateCape(capeId: number): Promise<ApiResult> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res = await fetch(`${API_BASE}/me/capes/${capeId}/activate`, {
            method: 'POST', headers: { Authorization: `Bearer ${t}` },
        });
        if (res.ok) return { success: true };
        const data = await res.json() as { error?: string };
        return { success: false, error: data.error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

// ─── Kits ─────────────────────────────────────────────────────────────────────

export async function createKit(title: string, description: string | null, skinId: number | null, capeId: number | null): Promise<ApiResult<unknown>> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res  = await fetch(`${API_BASE}/me/kits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
            body:    JSON.stringify({ title, description, skin_id: skinId, cape_id: capeId }),
        });
        const data = await res.json() as { success?: boolean; kit?: unknown; error?: string };
        if (res.ok) return { success: true, data: data.kit };
        return { success: false, error: data.error ?? 'Error al crear kit' };
    } catch { return { success: false, error: 'Error de red' }; }
}

export async function activateKit(kitId: number): Promise<ApiResult> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res = await fetch(`${API_BASE}/me/kits/${kitId}/activate`, {
            method: 'POST', headers: { Authorization: `Bearer ${t}` },
        });
        if (res.ok) return { success: true };
        const data = await res.json() as { error?: string };
        return { success: false, error: data.error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

// ─── Social ───────────────────────────────────────────────────────────────────

export async function searchUsers(q: string): Promise<ApiResult<unknown[]>> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res  = await fetch(`${API_BASE}/users/search?q=${encodeURIComponent(q)}`, {
            headers: { Authorization: `Bearer ${t}` },
        });
        const data = await res.json() as unknown[] | { error?: string };
        if (res.ok) return { success: true, data: data as unknown[] };
        return { success: false, error: (data as {error?:string}).error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

export async function sendFriendRequest(toUserId: number): Promise<ApiResult> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res = await fetch(`${API_BASE}/me/friends/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
            body:    JSON.stringify({ to_user_id: toUserId }),
        });
        if (res.ok) return { success: true };
        const data = await res.json() as { error?: string };
        return { success: false, error: data.error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

export async function acceptFriendRequest(requestId: number): Promise<ApiResult> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res = await fetch(`${API_BASE}/me/friends/requests/${requestId}/accept`, {
            method: 'POST', headers: { Authorization: `Bearer ${t}` },
        });
        if (res.ok) return { success: true };
        const data = await res.json() as { error?: string };
        return { success: false, error: data.error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

export async function rejectFriendRequest(requestId: number): Promise<ApiResult> {
    const t = token.value;
    if (!t) return { success: false, error: 'No autenticado' };
    try {
        const res = await fetch(`${API_BASE}/me/friends/requests/${requestId}/reject`, {
            method: 'POST', headers: { Authorization: `Bearer ${t}` },
        });
        if (res.ok) return { success: true };
        const data = await res.json() as { error?: string };
        return { success: false, error: data.error ?? 'Error' };
    } catch { return { success: false, error: 'Error de red' }; }
}

