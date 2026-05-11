<template>
    <aside class="sidebar">
        <!-- Avatar -->
        <label class="sidebar__avatar-wrap" :title="'Cambiar avatar'">
            <img v-if="profile?.avatar" :src="profile.avatar" class="sidebar__avatar-img" />
            <div v-else class="sidebar__avatar-init">{{ initials }}</div>
            <div class="sidebar__avatar-overlay">
                <span v-html="Icons.camera"></span>
            </div>
            <input type="file" accept="image/png,image/jpeg,image/webp" class="sidebar__avatar-file"
                @change="onAvatarFile" />
        </label>
        <p v-if="avatarErr" class="sidebar__avatar-err">{{ avatarErr }}</p>
        <div v-if="uploadingAvatar" class="sidebar__avatar-uploading">Subiendo...</div>

        <!-- Identity -->
        <h2 class="sidebar__name">{{ profile?.username ?? currentUser?.username }}</h2>
        <span class="sidebar__tier" :class="tierKey">{{ tierLabel }}</span>
        <div class="sidebar__onlinedot" :class="presenceClass"></div>

        <!-- Mini stats -->
        <div class="sidebar__stats">
            <div class="sidebar__stat" v-for="s in stats" :key="s.label">
                <span>{{ s.value }}</span>
                <small>{{ s.label }}</small>
            </div>
        </div>

        <!-- Bio -->
        <div class="sidebar__bio" @click="editingBio = true" v-if="!editingBio">
            {{ profile?.bio || 'Sin bio — clic para añadir' }}
        </div>
        <div v-else class="sidebar__bio-edit">
            <textarea v-model="bioInput" class="sidebar__textarea" rows="3" maxlength="256"></textarea>
            <div class="sidebar__row">
                <button class="sidebar__btn" @click="saveBio" :disabled="savingBio">Guardar</button>
                <button class="sidebar__btn sidebar__btn--danger" @click="editingBio = false">Cancelar</button>
            </div>
        </div>

        <!-- Logout -->
        <button class="sidebar__logout" @click="emit('logout')">
            <span v-html="Icons.logout"></span>
            Cerrar Sesión
        </button>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icons } from '../../icons.ts';
import { currentUser } from '../../authService.ts';
import { updateProfile } from '../../authService.ts';
import { API_BASE, token } from '../../authService.ts';
import type { UserFull } from '../../authService.ts';
import { TIERS } from './types.ts';

const props = defineProps<{
    profile: UserFull | null;
    skinCount: number;
    capeCount: number;
    kitCount: number;
    friendCount: number;
    presenceClass: string;
}>();

const emit = defineEmits<{
    logout: [];
    profileUpdated: [UserFull];
}>();

// Bio
const editingBio = ref(false);
const bioInput = ref(props.profile?.bio ?? '');
const savingBio = ref(false);

// Avatar upload
const uploadingAvatar = ref(false);
const avatarErr = ref('');

const tierKey = computed(() => props.profile?.premium ?? currentUser.value?.tier ?? 'free');
const tierLabel = computed(() => TIERS[tierKey.value]?.label ?? tierKey.value);
const initials = computed(() => (props.profile?.username ?? currentUser.value?.username ?? '?').slice(0, 2).toUpperCase());
const stats = computed(() => [
    { label: 'Skins', value: props.skinCount },
    { label: 'Capas', value: props.capeCount },
    { label: 'Kits', value: props.kitCount },
    { label: 'Amigos', value: props.friendCount },
]);

async function saveBio() {
    savingBio.value = true;
    const r = await updateProfile({ bio: bioInput.value });
    if (r.success && props.profile) {
        emit('profileUpdated', { ...props.profile, bio: bioInput.value });
        editingBio.value = false;
    }
    savingBio.value = false;
}

async function onAvatarFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const ALLOWED = ['image/png', 'image/jpeg', 'image/webp'];
    if (!ALLOWED.includes(file.type)) { avatarErr.value = 'Solo PNG, JPEG o WEBP.'; return; }
    if (file.size > 10 * 1024 * 1024) { avatarErr.value = 'Máx 10 MB.'; return; }

    avatarErr.value = '';
    uploadingAvatar.value = true;

    const form = new FormData();
    form.append('file', file);

    try {
        const res = await fetch(`${API_BASE}/me/avatar/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token.value}` },
            body: form,
        });
        const data = await res.json() as { success?: boolean; avatar_url?: string; error?: string };
        if (res.ok && data.avatar_url) {
            if (currentUser.value) {
                currentUser.value.avatar = data.avatar_url;
                localStorage.setItem('user', JSON.stringify(currentUser.value));
            }
            emit('profileUpdated', { ...props.profile!, avatar: data.avatar_url });
        } else {
            avatarErr.value = data.error ?? 'Error al subir';
        }
    } catch {
        avatarErr.value = 'Error de red';
    }
    uploadingAvatar.value = false;
}
</script>

<style lang="scss" scoped>
@use '../../styles/dashboard' as *;

.sidebar {
    width: 260px;
    flex-shrink: 0;
    @include card;
    @include flex-col;
    align-items: center;
    gap: 1rem;
    height: fit-content;
    position: sticky;
    top: calc($header-h + 1rem);

    // Avatar
    &__avatar-wrap {
        position: relative;
        width: 8rem;
        height: 8rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__avatar-img,
    &__avatar-init {
        width: 8rem;
        height: 8rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__avatar-img {
        object-fit: cover;
    }

    &__avatar-init {
        background: linear-gradient(135deg, $accent, $accent-light);
        font-size: 1.8rem;
        font-family: 'Lexend', sans-serif;
        font-weight: 700;
    }

    &__avatar-overlay {
        position: absolute;
        inset: 50% 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
        color: white;
    }

    &__avatar-wrap:hover &__avatar-overlay {
        opacity: 1;
    }

    &__avatar-file {
        display: none;
    }

    &__avatar-err {
        color: $danger;
        font-size: 0.75rem;
        margin: -0.5rem 0 0;
        text-align: center;
    }

    &__avatar-uploading {
        font-size: 0.8rem;
        color: $text-muted;
    }

    // Identity
    &__name {
        font-family: 'Lexend', sans-serif;
        font-size: 1.15rem;
        margin: 0;
        font-weight: 600;
    }

    &__tier {
        font-size: 0.72rem;
        padding: 0.2rem 0.7rem;
        border-radius: 20px;
        font-weight: 700;
        text-transform: uppercase;

        &.free {
            background: rgba(255, 255, 255, .08);
            color: #aaa;
        }

        &.basic {
            background: rgba(116, 185, 255, .15);
            color: #74b9ff;
        }

        &.pro {
            background: rgba(253, 121, 168, .15);
            color: #fd79a8;
        }

        &.legend {
            background: linear-gradient(90deg, #f1c40f, #f39c12);
            color: #000;
        }
    }

    &__onlinedot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-top: -0.5rem;

        &.pres-online {
            background: $success;
            box-shadow: 0 0 6px $success;
            animation: pulse-glow 2s infinite;
        }

        &.pres-dnd {
            background: $danger;
            box-shadow: 0 0 6px $danger;
        }

        &.pres-offline {
            background: #636e72;
        }
    }

    // Stats
    &__stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        width: 100%;
    }

    &__stat {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        padding: 0.6rem;
        @include flex-col;
        align-items: center;

        span {
            font-size: 1.3rem;
            font-weight: 700;
            color: $accent-light;
            font-family: 'Lexend', sans-serif;
        }

        small {
            font-size: 0.68rem;
            color: $text-muted;
            text-transform: uppercase;
        }
    }

    // Bio
    &__bio {
        width: 100%;
        color: #999;
        font-size: 0.84rem;
        cursor: pointer;
        line-height: 1.5;
        min-height: 36px;
        border-top: 1px solid $border;
        padding-top: 0.8rem;

        &:hover {
            color: #ccc;
        }
    }

    &__bio-edit {
        width: 100%;
        @include flex-col(0.4rem);
    }

    &__textarea {
        @extend %input-base;
        resize: none;
    }

    &__row {
        display: flex;
        gap: 0.5rem;
    }

    &__btn {
        flex: 1;
        padding: 0.45rem 0.8rem;
        border: 1px solid rgba(255, 255, 255, .1);
        border-radius: 8px;
        background: rgba(255, 255, 255, .06);
        color: #ccc;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.82rem;
        transition: all 0.2s;

        &:hover {
            background: rgba(255, 255, 255, .12);
            color: #fff;
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        &--danger {
            color: $danger;
            border-color: rgba($danger, .25);
            background: rgba($danger, .06);
        }
    }

    // Logout
    &__logout {
        width: 100%;
        margin-top: auto;
        background: rgba($danger, 0.08);
        color: $danger;
        border: 1px solid rgba($danger, 0.25);
        border-radius: 10px;
        padding: 0.7rem;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.2s;

        &:hover {
            background: $danger;
            color: white;
        }
    }
}
</style>
