<template>
    <!-- Reusable 3D skin card using SkinView3D -->
    <div class="skin-card" :class="{ 'skin-card--active': active }">
        <div class="skin-card__viewer">
            <canvas ref="canvas" class="skin-card__canvas"></canvas>
            <div v-if="active" class="skin-card__badge">Activa</div>
        </div>
        <span class="skin-card__name">{{ name }}</span>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as skinview3d from 'skinview3d';

const props = defineProps<{
    name:      string;
    skinUrl:   string;
    capeUrl?:  string;
    active?:   boolean;
    width?:    number;
    height?:   number;
}>();

const canvas  = ref<HTMLCanvasElement | null>(null);
let   viewer: skinview3d.SkinViewer | null = null;

function init() {
    if (!canvas.value) return;
    viewer?.dispose();
    viewer = new skinview3d.SkinViewer({
        canvas:  canvas.value,
        width:   props.width  ?? 110,
        height:  props.height ?? 160,
        skin:    props.skinUrl,
        ...(props.capeUrl ? { cape: props.capeUrl } : {}),
    });
    viewer.autoRotate      = true;
    viewer.autoRotateSpeed = 1.2;
    viewer.zoom            = 0.9;
}

onMounted(init);
onUnmounted(() => viewer?.dispose());
watch(() => [props.skinUrl, props.capeUrl], init);
</script>

<style lang="scss" scoped>
@use '../../styles/dashboard' as *;

.skin-card {
    @include card(0.6rem);
    display:        flex;
    flex-direction: column;
    align-items:    center;
    gap:            0.4rem;
    width:          126px;
    cursor:         pointer;
    transition:     border-color 0.2s, background 0.2s, transform 0.15s;

    &:hover          { transform: translateY(-3px); border-color: rgba($accent, 0.4); }
    &--active        { border-color: rgba($accent, 0.6); background: rgba($accent, 0.12); }

    &__viewer {
        position: relative;
        width:    110px;
        height:   160px;
    }

    &__canvas {
        display:       block;
        border-radius: 8px;
        background:    radial-gradient(ellipse at center, rgba($accent, 0.12) 0%, transparent 70%);
    }

    &__badge {
        position:      absolute;
        top:           4px;
        right:         4px;
        background:    rgba($accent, 0.85);
        color:         white;
        font-size:     0.6rem;
        font-weight:   700;
        padding:       0.1rem 0.35rem;
        border-radius: 4px;
        text-transform: uppercase;
    }

    &__name {
        font-size:   0.72rem;
        color:       #ccc;
        font-weight: 600;
        text-align:  center;
        max-width:   100%;
        overflow:    hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
