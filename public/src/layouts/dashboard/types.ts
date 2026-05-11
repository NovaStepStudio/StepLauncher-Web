export type Tab = 'profile' | 'cosmetics' | 'friends' | 'presence' | 'session';

export interface Skin {
    id: number;
    name: string;
    skin_url: string;
    is_active: boolean;
}

export interface Cape {
    id: number;
    name: string;
    cape_url: string;
    is_active: boolean;
    is_default: boolean;
}

export interface Kit {
    id: number;
    title: string;
    description: string | null;
    skin_id: number | null;
    cape_id: number | null;
    is_active: boolean;
}

export interface Friend {
    friend_id: number;
    friend_username: string;
    friend_bio: string | null;
    friend_skin_url: string | null;
    friend_avatar_url: string | null;
    is_online: boolean;
}

export interface FriendRequest {
    request_id: number;
    from_username?: string;
    from_avatar?: string | null;
    to_username?: string;
}

export interface SearchUser {
    id: number;
    username: string;
    tier: string;
    online: boolean;
    bio: string | null;
    cape_url: string | null;
    skin_url: string | null;
    avatar: string;
}

export const TIERS: Record<string, { label: string; skins: number; capes: number; kits: number }> = {
    free: { label: 'Free', skins: 3, capes: 4, kits: 5 },
    basic: { label: 'Basic', skins: 15, capes: 15, kits: 20 },
    pro: { label: 'Pro', skins: 60, capes: 50, kits: 40 },
    legend: { label: 'Legend', skins: -1, capes: -1, kits: -1 },
};

export const PRIVACY_LABELS: Record<string, string> = {
    showStats: 'Mostrar estadísticas',
    publicSkin: 'Skin pública',
    allowSearch: 'Permitir búsqueda',
    publicProfile: 'Perfil público',
    allowFindByEmail: 'Buscar por email',
    showOnlineStatus: 'Mostrar estado en línea',
    allowFriendRequests: 'Permitir solicitudes de amistad',
};

export const PRESENCE_OPTS = ['Conectado', 'No Molestar', 'Desconectado'] as const;

export const DEFAULT_SKIN = 'https://harmtxhbtxhlgcrrzqod.supabase.co/storage/v1/object/public/skins/Default/steve.png';

export function fmtDate(iso: string): string {
    return new Date(iso).toLocaleString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}
