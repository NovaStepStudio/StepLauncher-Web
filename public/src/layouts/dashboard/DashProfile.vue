<template>
    <section class="profile">
        <h2 class="profile__title">Perfil</h2>

        <div class="profile__grid">
            <div class="profile__card" v-for="f in profileFields" :key="f.label">
                <small>{{ f.label }}</small>
                <strong :class="f.cls">{{ f.value }}</strong>
            </div>
        </div>

        <div class="profile__card profile__card--wide">
            <small>UUID</small>
            <code>{{ profile?.uuid }}</code>
        </div>

        <!-- 3D character preview (active skin + cape) -->
        <div class="profile__card profile__card--wide profile__viewer-wrap">
            <small>Tu personaje</small>
            <div class="profile__viewer-body">
                <canvas ref="canvas" class="profile__canvas"></canvas>
                <div class="profile__viewer-controls">
                    <p>Arrastra para rotar · Scroll para zoom</p>
                    <p v-if="activeSkinName">Skin: <strong>{{ activeSkinName }}</strong></p>
                    <p v-if="activeCapeNme">Capa: <strong>{{ activeCapeNme }}</strong></p>
                </div>
            </div>
        </div>

        <!-- Privacy settings -->
        <div class="profile__card profile__card--wide">
            <small>Configuración de privacidad</small>
            <div class="profile__privacy">
                <div class="profile__prv" v-for="p in privacyFields" :key="p.key">
                    <span>{{ p.label }}</span>
                    <button
                        class="profile__toggle"
                        :class="{ on: p.val }"
                        @click="togglePrivacy(p.key, !p.val)"
                    >
                        <span v-html="p.val ? Icons.check : Icons.cross"></span>
                        {{ p.val ? 'Activo' : 'Inactivo' }}
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as skinview3d from 'skinview3d';
import { Icons } from '../../icons.ts';
import { updateSettings } from '../../authService.ts';
import type { UserFull } from '../../authService.ts';
import type { Skin, Cape } from './types.ts';
import { PRIVACY_LABELS, DEFAULT_SKIN, fmtDate, TIERS } from './types.ts';

const props = defineProps<{
    profile:  UserFull | null;
    skins:    Skin[];
    capes:    Cape[];
    tierKey:  string;
}>();
const emit = defineEmits<{ profileUpdated: [UserFull] }>();

const canvas = ref<HTMLCanvasElement | null>(null);
let viewer: skinview3d.SkinViewer | null = null;

// ── computed ──────────────────────────────────────────────────────────────────
const activeSkin    = computed(() => props.skins.find(s => s.is_active));
const activeCape    = computed(() => props.capes.find(c => c.is_active));
const activeSkinName = computed(() => activeSkin.value?.name);
const activeCapeNme  = computed(() => activeCape.value?.name);

const profileFields = computed(() => {
    const p = props.profile;
    if (!p) return [];
    return [
        { label: 'Usuario',     value: p.username,                                cls: '' },
        { label: 'Email',       value: p.email ?? '—',                            cls: '' },
        { label: 'Plan',        value: TIERS[props.tierKey]?.label ?? props.tierKey, cls: `clr-${props.tierKey}` },
        { label: 'Estado',      value: p.is_online ? 'En línea' : 'Desconectado', cls: p.is_online ? 'clr-online' : '' },
        { label: 'Administrador', value: p.is_admin ? 'Sí ✓' : 'No',             cls: p.is_admin ? 'clr-gold' : '' },
        { label: 'Creado',      value: fmtDate(p.created_at),                     cls: '' },
        { label: 'Último login', value: p.last_login ? fmtDate(p.last_login) : '—', cls: '' },
        { label: 'Última vez',  value: p.last_seen  ? fmtDate(p.last_seen)  : '—', cls: '' },
    ];
});

const privacyFields = computed(() => {
    const prv = ((props.profile?.settings as any)?.privacy) ?? {};
    return Object.entries(PRIVACY_LABELS).map(([key, label]) => ({ key, label, val: !!prv[key] }));
});

// ── 3D viewer ─────────────────────────────────────────────────────────────────
function initViewer() {
    if (!canvas.value) return;
    viewer?.dispose();
    const skinUrl = activeSkin.value?.skin_url ?? props.profile?.skin_url ?? DEFAULT_SKIN;
    const capeUrl = activeCape.value?.cape_url  ?? props.profile?.cape_url ?? undefined;
    viewer = new skinview3d.SkinViewer({
        canvas:  canvas.value,
        width:   220,
        height:  360,
        skin:    skinUrl,
        ...(capeUrl ? { cape: capeUrl } : {}),
    });
    viewer.autoRotate      = true;
    viewer.autoRotateSpeed = 0.5;
}

onMounted(() => nextTick(initViewer));
onUnmounted(() => viewer?.dispose());
watch(() => [props.skins, props.capes, props.profile?.skin_url], () => nextTick(initViewer));

// ── Privacy ───────────────────────────────────────────────────────────────────
async function togglePrivacy(key: string, val: boolean) {
    if (!props.profile?.settings) return;
    const s = JSON.parse(JSON.stringify(props.profile.settings)) as any;
    if (!s.privacy) s.privacy = {};
    s.privacy[key] = val;
    const r = await updateSettings(s);
    if (r.success) emit('profileUpdated', { ...props.profile, settings: s });
}
</script>

<style lang="scss" scoped>
@use '../../styles/dashboard' as *;

.profile {
    @include flex-col(1.2rem);
    animation: fadeUp 0.28s ease-out;

    &__title { font-family: 'Lexend', sans-serif; font-size: 1.45rem; margin: 0; font-weight: 600; }

    &__grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(390px, 1fr)); gap: 0.9rem; }

    &__card {
        @include card;
        @include flex-col(0.25rem);
        small  { font-size: 0.72rem; color: $text-muted; text-transform: uppercase; font-weight: 600; }
        strong { font-size: 1rem; color: #eee; }
        code   { font-size: 0.8rem; color: $accent-light; word-break: break-all; font-family: 'Courier New', monospace; }
        &--wide { grid-column: 1 / -1; }
    }

    // 3D viewer
    &__viewer-wrap { align-items: flex-start; }
    &__viewer-body {
        display:     flex;
        gap:         1.5rem;
        align-items: flex-start;
        margin-top:  0.5rem;
        flex-wrap:   wrap;
    }
    &__canvas {
        border-radius: 12px;
        background:    radial-gradient(ellipse at center, rgba($accent, 0.12) 0%, transparent 70%);
        cursor:        grab;
        &:active { cursor: grabbing; }
    }
    &__viewer-controls {
        @include flex-col(0.4rem);
        padding-top: 0.5rem;
        p      { margin: 0; font-size: 0.85rem; color: #aaa; }
        strong { color: #eee; }
    }

    // Privacy
    &__privacy {
        display:               grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap:                   0.5rem;
        margin-top:            0.5rem;
    }
    &__prv {
        display:         flex;
        justify-content: space-between;
        align-items:     center;
        padding:         0.45rem 0.8rem;
        background:      rgba(0, 0, 0, 0.15);
        border-radius:   8px;
        span { font-size: 0.84rem; color: #bbb; }
    }
    &__toggle {
        padding:       0.25rem 0.7rem;
        border-radius: 6px;
        border:        none;
        cursor:        pointer;
        font-size:     0.75rem;
        font-weight:   700;
        display:       flex;
        align-items:   center;
        gap:           0.3rem;
        transition:    all 0.2s;
        background:    rgba($danger, 0.12);
        color:         $danger;
        &.on { background: rgba($success, 0.12); color: $success; }
    }
}

// global helpers from shared SCSS
:global(.clr-online) { color: #55efc4 !important; }
:global(.clr-gold)   { color: #f1c40f !important; }
:global(.clr-free)   { color: #aaa    !important; }
:global(.clr-basic)  { color: #74b9ff !important; }
:global(.clr-pro)    { color: #fd79a8 !important; }
:global(.clr-legend) { color: #f1c40f !important; }
</style>
