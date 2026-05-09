<template>
    <section class="cosmetics">
        <h2 class="cosmetics__title">Cosméticos</h2>

        <!-- ── Skins ── -->
        <div class="cosmetics__group">
            <div class="cosmetics__header">
                <h3>Skins <span class="badge">{{ skins.length }}</span></h3>
                <button class="btn btn--sm" @click="emit('openUploadSkin')">
                    <span v-html="Icons.upload"></span> Subir
                </button>
            </div>
            <div v-if="loading" class="cosmetics__loading">Cargando...</div>
            <div v-else-if="!skins.length" class="cosmetics__empty">Sin skins. Sube la primera.</div>
            <div v-else class="cosmetics__grid">
                <SkinCard
                    v-for="s in skins"
                    :key="s.id"
                    :name="s.name"
                    :skin-url="s.skin_url"
                    :active="s.is_active"
                    @click="emit('activateSkin', s.id)"
                >
                    <button v-if="!s.is_active" class="btn btn--sm btn--primary" @click.stop="emit('activateSkin', s.id)">Activar</button>
                </SkinCard>
            </div>
        </div>

        <!-- ── Capas ── -->
        <div class="cosmetics__group">
            <div class="cosmetics__header">
                <h3>Capas <span class="badge">{{ capes.length }}</span></h3>
                <button class="btn btn--sm" @click="emit('openUploadCape')">
                    <span v-html="Icons.upload"></span> Subir
                </button>
            </div>
            <div v-if="!capes.length && !loading" class="cosmetics__empty">Sin capas.</div>
            <div v-else class="cosmetics__grid">
                <!-- Show skin+cape combined on the 3D viewer -->
                <SkinCard
                    v-for="c in capes"
                    :key="c.id"
                    :name="c.name"
                    :skin-url="activeSkinUrl"
                    :cape-url="c.cape_url"
                    :active="c.is_active"
                    @click="!c.is_default && emit('activateCape', c.id)"
                >
                    <button v-if="!c.is_active && !c.is_default" class="btn btn--sm btn--primary" @click.stop="emit('activateCape', c.id)">Activar</button>
                    <span v-else-if="c.is_default" class="tag tag--default">Default</span>
                </SkinCard>
            </div>
        </div>

        <!-- ── Kits ── -->
        <div class="cosmetics__group">
            <div class="cosmetics__header">
                <h3>
                    <span v-html="Icons.kit"></span>
                    Kits <span class="badge">{{ kits.length }}</span>
                </h3>
                <button class="btn btn--sm" @click="emit('openCreateKit')">
                    <span v-html="Icons.plus"></span> Crear Kit
                </button>
            </div>
            <div v-if="!kits.length && !loading" class="cosmetics__empty">Sin kits. Crea uno combinando skin y capa.</div>
            <div v-else class="cosmetics__kits">
                <div
                    v-for="k in kits"
                    :key="k.id"
                    class="cosmetics__kit"
                    :class="{ 'cosmetics__kit--active': k.is_active }"
                >
                    <!-- 3D preview of kit -->
                    <SkinCard
                        :name="k.title"
                        :skin-url="kitSkinUrl(k)"
                        :cape-url="kitCapeUrl(k)"
                        :active="k.is_active"
                        :width="90"
                        :height="130"
                    />
                    <div class="cosmetics__kit-info">
                        <strong>{{ k.title }}</strong>
                        <p v-if="k.description">{{ k.description }}</p>
                        <small>
                            Skin: {{ skinName(k.skin_id) }} ·
                            Capa: {{ capeName(k.cape_id) }}
                        </small>
                        <button
                            v-if="!k.is_active"
                            class="btn btn--sm btn--primary"
                            @click="emit('activateKit', k.id)"
                        >Activar kit</button>
                        <span v-else class="tag">Activo</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Límites -->
        <div class="cosmetics__limits-card">
            <small>Límites del plan {{ tierLabel }}</small>
            <div class="cosmetics__limits">
                <div v-for="l in limits" :key="l.label">
                    <span>{{ l.label }}</span>
                    <strong>{{ l.value === -1 ? '∞' : l.value }}</strong>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SkinCard from './SkinCard.vue';
import { Icons } from '../../icons.ts';
import type { Skin, Cape, Kit } from './types.ts';
import { TIERS, DEFAULT_SKIN } from './types.ts';

const props = defineProps<{
    skins:    Skin[];
    capes:    Cape[];
    kits:     Kit[];
    loading:  boolean;
    tierKey:  string;
}>();

const emit = defineEmits<{
    activateSkin: [id: number];
    activateCape: [id: number];
    activateKit:  [id: number];
    openUploadSkin: [];
    openUploadCape: [];
    openCreateKit:  [];
}>();

const tierLabel    = computed(() => TIERS[props.tierKey]?.label ?? props.tierKey);
const activeSkinUrl = computed(() => props.skins.find(s => s.is_active)?.skin_url ?? DEFAULT_SKIN);
const limits        = computed(() => {
    const t = TIERS[props.tierKey] ?? TIERS.free;
    return [
        { label: 'Skins', value: t?.skins || 0 },
        { label: 'Capas', value: t?.capes || 0 },
        { label: 'Kits',  value: t?.kits  || 0 },
    ];
});

function skinName(id: number | null): string {
    if (!id) return '—';
    return props.skins.find(s => s.id === id)?.name ?? `#${id}`;
}
function capeName(id: number | null): string {
    if (!id) return '—';
    return props.capes.find(c => c.id === id)?.name ?? `#${id}`;
}
function kitSkinUrl(k: Kit): string {
    return props.skins.find(s => s.id === k.skin_id)?.skin_url ?? activeSkinUrl.value;
}
function kitCapeUrl(k: Kit): string | undefined {
    return props.capes.find(c => c.id === k.cape_id)?.cape_url;
}
</script>

<style lang="scss" scoped>
@use '../../styles/dashboard' as *;

.cosmetics {
    @include flex-col(1.4rem);

    &__title { font-family: 'Lexend', sans-serif; font-size: 1.45rem; margin: 0; font-weight: 600; }

    &__group { @include flex-col(0.8rem); }

    &__header {
        display:         flex;
        align-items:     center;
        justify-content: space-between;
        h3 {
            font-size:   0.98rem;
            font-family: 'Lexend', sans-serif;
            margin:      0;
            display:     flex;
            align-items: center;
            gap:         0.4rem;
        }
    }

    &__grid { display: flex; flex-wrap: wrap; gap: 0.7rem; }

    &__kits { @include flex-col(0.6rem); }
    &__kit {
        @include card;
        display:     flex;
        align-items: flex-start;
        gap:         1rem;
        padding:     0.8rem 1rem;
        transition:  border-color 0.2s;
        &--active { border-color: rgba($accent, 0.5); background: rgba($accent, 0.08); }
    }
    &__kit-info {
        @include flex-col(0.35rem);
        flex: 1;
        strong { color: #eee; font-size: 1rem; }
        p      { color: #999; font-size: 0.83rem; margin: 0; }
        small  { font-size: 0.72rem; color: $text-muted; }
    }

    &__limits-card {
        @include card;
        @include flex-col(0.5rem);
        small { font-size: 0.72rem; color: $text-muted; text-transform: uppercase; font-weight: 600; }
    }
    &__limits {
        display:    flex;
        gap:        2rem;
        flex-wrap:  wrap;
        margin-top: 0.3rem;
        div { @include flex-col(0.15rem); }
        span   { font-size: 0.72rem; color: $text-muted; text-transform: uppercase; }
        strong { font-size: 1.3rem; color: $accent-light; font-family: 'Lexend', sans-serif; }
    }

    &__loading { color: $text-muted; font-style: italic; }
    &__empty   { color: #555; font-style: italic; }
}

.badge {
    background:    rgba($accent, 0.2);
    color:         $accent-light;
    padding:       0.1rem 0.45rem;
    border-radius: 20px;
    font-size:     0.72rem;
    font-weight:   700;
}
.tag {
    font-size:      0.65rem;
    padding:        0.15rem 0.45rem;
    border-radius:  4px;
    background:     rgba($accent, 0.25);
    color:          $accent-light;
    font-weight:    700;
    width:          fit-content;
    &--default { background: rgba($success, 0.18); color: $success; }
}
.btn {
    padding:      0.55rem 1rem;
    border-radius: 9px;
    border:       1px solid rgba(255,255,255,.1);
    background:   rgba(255,255,255,.06);
    color:        #ccc;
    cursor:       pointer;
    font-family:  'Inter', sans-serif;
    font-weight:  600;
    font-size:    0.85rem;
    display:      flex;
    align-items:  center;
    gap:          0.3rem;
    transition:   all 0.2s;
    &:hover { background: rgba(255,255,255,.12); color: #fff; }
    &--sm      { padding: 0.3rem 0.65rem; font-size: 0.78rem; }
    &--primary { background: linear-gradient(135deg, $accent, $accent-light); color: #fff; border: none; }
}
</style>
