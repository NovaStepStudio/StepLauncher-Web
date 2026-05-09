<template>
    <div class="db">
        <DashSidebar
            :profile="profile"
            :skin-count="skins.length"
            :cape-count="capes.length"
            :kit-count="kits.length"
            :friend-count="friends.length"
            :presence-class="presenceClass"
            @logout="handleLogout"
            @profile-updated="p => profile = p"
        />

        <div class="db__main">
            <!-- Tabs -->
            <nav class="db__tabs">
                <button
                    v-for="t in TABS" :key="t.id"
                    class="db__tab"
                    :class="{ active: tab === t.id }"
                    @click="tab = t.id"
                >
                    <span v-html="t.icon"></span>{{ t.label }}
                </button>
            </nav>

            <!-- Tab panels -->
            <DashProfile
                v-if="tab === 'profile'"
                :profile="profile"
                :skins="skins"
                :capes="capes"
                :tier-key="tierKey"
                @profile-updated="p => profile = p"
            />

            <DashCosmetics
                v-if="tab === 'cosmetics'"
                :skins="skins"
                :capes="capes"
                :kits="kits"
                :loading="loadingCosm"
                :tier-key="tierKey"
                @activate-skin="doActivateSkin"
                @activate-cape="doActivateCape"
                @activate-kit="doActivateKit"
                @open-upload-skin="showUploadSkin = true"
                @open-upload-cape="showUploadCape = true"
                @open-create-kit="showCreateKit = true"
            />

            <DashFriends
                v-if="tab === 'friends'"
                :friends="friends"
                :req-received="reqReceived"
                :req-sent="reqSent"
                :loading="loadingFriends"
                @accept="doAccept"
                @reject="doReject"
            />

            <DashPresence
                v-if="tab === 'presence'"
                :uuid="currentUser?.uuid ?? ''"
                :current-presence="currPres"
            />

            <DashSession
                v-if="tab === 'session'"
                :profile="profile"
                :tier-label="tierLabel"
            />
        </div>

        <!-- Modals -->
        <DashModals
            :show-skin="showUploadSkin"
            :show-cape="showUploadCape"
            :show-kit="showCreateKit"
            :skins="skins"
            :capes="capes"
            @close-skin="showUploadSkin = false"
            @close-cape="showUploadCape = false"
            @close-kit="showCreateKit = false"
            @skin-uploaded="loadCosm"
            @cape-uploaded="loadCosm"
            @kit-created="loadCosm"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icons } from '../icons.ts';
import {
    currentUser, logout,
    getMe, getSkins, getCapes, getKits,
    getFriends, getFriendRequests, getPresence,
    activateSkin as apiActivateSkin,
    activateCape as apiActivateCape,
    activateKit  as apiActivateKit,
    acceptFriendRequest, rejectFriendRequest,
} from '../authService.ts';
import type { UserFull, Presence } from '../authService.ts';
import type { Skin, Cape, Kit, Friend, FriendRequest, Tab } from './dashboard/types.ts';
import { TIERS } from './dashboard/types.ts';

import DashSidebar  from './dashboard/DashSidebar.vue';
import DashProfile  from './dashboard/DashProfile.vue';
import DashCosmetics from './dashboard/DashCosmetics.vue';
import DashFriends  from './dashboard/DashFriends.vue';
import DashPresence from './dashboard/DashPresence.vue';
import DashSession  from './dashboard/DashSession.vue';
import DashModals   from './dashboard/DashModals.vue';

// ── State ─────────────────────────────────────────────────────────────────────
const tab          = ref<Tab>('profile');
const profile      = ref<UserFull | null>(null);
const skins        = ref<Skin[]>([]);
const capes        = ref<Cape[]>([]);
const kits         = ref<Kit[]>([]);
const friends      = ref<Friend[]>([]);
const reqReceived  = ref<FriendRequest[]>([]);
const reqSent      = ref<FriendRequest[]>([]);
const currPres     = ref<Partial<Presence>>({});
const loadingCosm   = ref(false);
const loadingFriends = ref(false);

// Modal flags
const showUploadSkin = ref(false);
const showUploadCape = ref(false);
const showCreateKit  = ref(false);

// ── Computed ──────────────────────────────────────────────────────────────────
const tierKey   = computed(() => profile.value?.premium ?? currentUser.value?.tier ?? 'free');
const tierLabel = computed(() => TIERS[tierKey.value]?.label ?? tierKey.value);

const presenceClass = computed(() => {
    const p = currPres.value.presence ?? 'Desconectado';
    if (p === 'Conectado')   return 'pres-online';
    if (p === 'No Molestar') return 'pres-dnd';
    return 'pres-offline';
});

const TABS = [
    { id: 'profile'   as Tab, label: 'Perfil',     icon: Icons.profile   },
    { id: 'cosmetics' as Tab, label: 'Cosméticos', icon: Icons.cosmetics },
    { id: 'friends'   as Tab, label: 'Amigos',     icon: Icons.friends   },
    { id: 'presence'  as Tab, label: 'Presencia',  icon: Icons.presence  },
    { id: 'session'   as Tab, label: 'Sesión',      icon: Icons.session   },
];

// ── Mount ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
    if (!currentUser.value) { window.location.hash = '#/Login'; return; }
    await Promise.all([loadProfile(), loadCosm(), loadFriends(), loadPres()]);
});

// ── Loaders ───────────────────────────────────────────────────────────────────
async function loadProfile() {
    const r = await getMe();
    if (r.success && r.data) profile.value = r.data;
}
async function loadCosm() {
    loadingCosm.value = true;
    const [s, c, k]   = await Promise.all([getSkins(), getCapes(), getKits()]);
    skins.value        = (s.data ?? []) as Skin[];
    capes.value        = (c.data ?? []) as Cape[];
    kits.value         = (k.data ?? []) as Kit[];
    loadingCosm.value  = false;
}
async function loadFriends() {
    loadingFriends.value = true;
    const [f, r]          = await Promise.all([getFriends(), getFriendRequests()]);
    friends.value         = (f.data ?? []) as Friend[];
    reqReceived.value     = (r.data?.received ?? []) as FriendRequest[];
    reqSent.value         = (r.data?.sent     ?? []) as FriendRequest[];
    loadingFriends.value  = false;
}
async function loadPres() {
    if (!currentUser.value?.uuid) return;
    const r = await getPresence(currentUser.value.uuid);
    if (r.success && r.data) currPres.value = r.data;
}

// ── Actions ───────────────────────────────────────────────────────────────────
function handleLogout() { logout(); window.location.hash = '#/'; }

async function doActivateSkin(id: number) {
    const r = await apiActivateSkin(id);
    if (r.success) {
        skins.value.forEach(s => s.is_active = s.id === id);
        if (profile.value) profile.value.skin_url = skins.value.find(s => s.id === id)?.skin_url ?? null;
    }
}
async function doActivateCape(id: number) {
    const r = await apiActivateCape(id);
    if (r.success) {
        capes.value.forEach(c => c.is_active = c.id === id && !c.is_default);
        if (profile.value) profile.value.cape_url = capes.value.find(c => c.id === id)?.cape_url ?? null;
    }
}
async function doActivateKit(id: number) {
    const r = await apiActivateKit(id);
    if (r.success) { kits.value.forEach(k => k.is_active = k.id === id); await Promise.all([loadProfile(), loadCosm()]); }
}

async function doAccept(id: number) {
    const r = await acceptFriendRequest(id);
    if (r.success) { reqReceived.value = reqReceived.value.filter(x => x.request_id !== id); await loadFriends(); }
}
async function doReject(id: number) {
    const r = await rejectFriendRequest(id);
    if (r.success) reqReceived.value = reqReceived.value.filter(x => x.request_id !== id);
}
</script>

<style lang="scss" scoped>
@use '../styles/dashboard' as *;

.db {
    display:     flex;
    min-height:  calc(100vh - $header-h);
    padding:     calc($header-h + 1.5rem) 1.5rem 1.5rem;
    max-width:   1400px;
    margin:      0 auto;
    gap:         1.5rem;
    font-family: 'Inter', sans-serif;
    box-sizing:  border-box;
    &__main {
        flex:     1;
        display:  flex;
        flex-direction: column;
        gap:      1.2rem;
        min-width: 0;
    }

    &__tabs {
        display:       flex;
        gap:           0.35rem;
        flex-wrap:     wrap;
        background:    rgba(255,255,255,.04);
        padding:       0.35rem;
        border-radius: 14px;
        border:        1px solid $border;
    }

    &__tab {
        flex:        1;
        min-width:   90px;
        background:  none;
        border:      none;
        color:       #888;
        cursor:      pointer;
        padding:     0.55rem 0.8rem;
        border-radius: 10px;
        font-family: 'Inter', sans-serif;
        font-size:   0.87rem;
        font-weight: 500;
        display:     flex;
        align-items: center;
        gap:         0.35rem;
        justify-content: center;
        transition:  all 0.2s;

        &:hover { background: rgba(255,255,255,.06); color: #ddd; }
        &.active {
            background: rgba($accent, .2);
            color:      $accent-light;
            border:     1px solid rgba($accent, .3);
        }
    }
}

@media (max-width: 860px) {
    .db {
        flex-direction: column;
        padding-top:    calc($header-h + 1rem);
        &__tabs { overflow-x: auto; flex-wrap: nowrap; }
        &__tab  { min-width: 80px; flex: 0 0 auto; }
    }
}
</style>
