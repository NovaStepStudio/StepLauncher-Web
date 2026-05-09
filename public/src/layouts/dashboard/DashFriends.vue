<template>
    <section class="friends">
        <h2 class="friends__title">Amigos</h2>

        <!-- Search -->
        <div class="friends__search">
            <input
                v-model="searchQ"
                @keyup.enter="doSearch"
                class="friends__input"
                placeholder="Buscar usuario por nombre..."
            />
            <button class="btn" @click="doSearch" :disabled="searching">
                <span v-html="Icons.search"></span>
                {{ searching ? '...' : 'Buscar' }}
            </button>
        </div>

        <div v-if="searchResults.length" class="friends__results">
            <h3>Resultados</h3>
            <div v-for="u in searchResults" :key="u.id" class="friends__row">
                <div class="friends__av">
                    <img v-if="u.skin_url" :src="u.skin_url" />
                    <div v-else class="friends__av-init">{{ u.username?.[0]?.toUpperCase() }}</div>
                </div>
                <div class="friends__info">
                    <strong>{{ u.username }}</strong>
                    <span>{{ u.bio ?? 'Sin bio' }}</span>
                </div>
                <button class="btn btn--sm btn--accept" @click="doSendReq(u.id)">
                    <span v-html="Icons.plus"></span> Añadir
                </button>
            </div>
        </div>

        <!-- Online friends -->
        <div v-if="online.length" class="friends__section">
            <h3>
                <span v-html="Icons.online"></span>
                Amigos en línea <span class="badge">{{ online.length }}</span>
            </h3>
            <div v-for="f in online" :key="f.friend_id" class="friends__row">
                <div class="friends__av">
                    <img v-if="f.friend_skin_url" :src="f.friend_skin_url" />
                    <div v-else class="friends__av-init">{{ f.friend_username?.[0]?.toUpperCase() }}</div>
                </div>
                <div class="friends__info">
                    <strong>{{ f.friend_username }}</strong>
                    <span>{{ f.friend_bio ?? '' }}</span>
                </div>
                <span class="friends__dot friends__dot--online"></span>
            </div>
        </div>

        <!-- All friends -->
        <div class="friends__section">
            <h3>Todos los amigos <span class="badge">{{ friends.length }}</span></h3>
            <div v-if="!friends.length" class="friends__empty">Sin amigos todavía. ¡Busca a alguien!</div>
            <div v-for="f in offline" :key="f.friend_id" class="friends__row">
                <div class="friends__av">
                    <img v-if="f.friend_skin_url" :src="f.friend_skin_url" />
                    <div v-else class="friends__av-init">{{ f.friend_username?.[0]?.toUpperCase() }}</div>
                </div>
                <div class="friends__info">
                    <strong>{{ f.friend_username }}</strong>
                    <span>{{ f.friend_bio ?? '' }}</span>
                </div>
                <span class="friends__dot friends__dot--offline"></span>
            </div>
        </div>

        <!-- Requests received -->
        <div v-if="reqReceived.length" class="friends__section">
            <h3>📬 Solicitudes recibidas <span class="badge">{{ reqReceived.length }}</span></h3>
            <div v-for="r in reqReceived" :key="r.request_id" class="friends__row">
                <div class="friends__info"><strong>{{ r.from_username }}</strong></div>
                <button class="btn btn--sm btn--accept" @click="emit('accept', r.request_id)">
                    <span v-html="Icons.check"></span> Aceptar
                </button>
                <button class="btn btn--sm btn--danger" @click="emit('reject', r.request_id)">
                    <span v-html="Icons.cross"></span>
                </button>
            </div>
        </div>

        <!-- Requests sent -->
        <div v-if="reqSent.length" class="friends__section">
            <h3>📤 Enviadas <span class="badge">{{ reqSent.length }}</span></h3>
            <div v-for="r in reqSent" :key="r.request_id" class="friends__row">
                <div class="friends__info">
                    <strong>{{ r.to_username ?? '—' }}</strong>
                    <span class="friends__pending">Pendiente</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icons } from '../../icons.ts';
import { searchUsers as apiSearch, sendFriendRequest } from '../../authService.ts';
import type { Friend, FriendRequest, SearchUser } from './types.ts';

const props = defineProps<{
    friends:     Friend[];
    reqReceived: FriendRequest[];
    reqSent:     FriendRequest[];
    loading:     boolean;
}>();
const emit = defineEmits<{
    accept: [id: number];
    reject: [id: number];
}>();

const searchQ       = ref('');
const searching     = ref(false);
const searchResults = ref<SearchUser[]>([]);

const online  = computed(() => props.friends.filter(f => f.is_online));
const offline = computed(() => props.friends.filter(f => !f.is_online));

async function doSearch() {
    if (searchQ.value.length < 2) return;
    searching.value = true;
    const r = await apiSearch(searchQ.value);
    searchResults.value = (r.data ?? []) as SearchUser[];
    searching.value = false;
}

async function doSendReq(id: number) {
    const r = await sendFriendRequest(id);
    if (r.success) searchResults.value = searchResults.value.filter(u => u.id !== id);
}
</script>

<style lang="scss" scoped>
@use '../../styles/dashboard' as *;

.friends {
    @include flex-col(1.4rem);
    &__title { font-family: 'Lexend', sans-serif; font-size: 1.45rem; margin: 0; font-weight: 600; }

    &__search { display: flex; gap: 0.6rem; }
    &__input  { @extend %input-base; }

    &__results, &__section { @include flex-col(0.5rem); }
    &__section h3 {
        font-size: 0.95rem; font-family: 'Lexend', sans-serif; margin: 0;
        display: flex; align-items: center; gap: 0.4rem;
    }

    &__row {
        @include card(0.7rem 1rem);
        display: flex; align-items: center; gap: 0.8rem;
    }

    &__av {
        width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; overflow: hidden;
        img { width: 100%; height: 100%; object-fit: cover; image-rendering: pixelated; }
    }
    &__av-init {
        width: 40px; height: 40px; border-radius: 50%;
        background: linear-gradient(135deg, $accent, $accent-light);
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 1rem;
    }
    &__info {
        flex: 1; @include flex-col;
        strong { color: #eee; }
        span   { font-size: 0.8rem; color: $text-muted; }
    }
    &__dot {
        width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
        &--online  { background: $success; box-shadow: 0 0 5px $success; }
        &--offline { background: #636e72; }
    }
    &__pending {
        font-size: 0.75rem; color: #fdcb6e;
        background: rgba(253,203,110,.1); padding: 0.2rem 0.5rem; border-radius: 6px;
    }
    &__empty { color: #555; font-style: italic; }
}

.badge { background: rgba($accent,.2); color: $accent-light; padding: .1rem .45rem; border-radius: 20px; font-size: .72rem; font-weight: 700; }

.btn {
    padding: 0.55rem 1rem; border-radius: 9px;
    border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.06); color: #ccc;
    cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.85rem;
    display: flex; align-items: center; gap: 0.3rem;
    transition: all 0.2s;
    &:hover    { background: rgba(255,255,255,.12); color: #fff; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
    &--sm     { padding: 0.3rem 0.65rem; font-size: 0.78rem; }
    &--accept { color: $success; border-color: rgba($success,.3); background: rgba($success,.08); }
    &--danger { color: $danger;  border-color: rgba($danger,.25);  background: rgba($danger,.06);  }
}
</style>
