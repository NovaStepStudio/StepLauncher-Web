<template>
    <section class="presence">
        <h2 class="presence__title">Presencia</h2>

        <!-- Current status card -->
        <div class="presence__current">
            <small>Estado actual</small>
            <div class="presence__status-row">
                <span class="presence__dot" :class="dotClass"></span>
                <strong :class="textClass">{{ currentPresence.presence ?? 'Desconectado' }}</strong>
            </div>
            <p v-if="currentPresence.message" class="presence__msg">"{{ currentPresence.message }}"</p>
            <small v-if="currentPresence.updated_at" class="presence__time">
                Actualizado: {{ fmtDate(currentPresence.updated_at) }}
            </small>
        </div>

        <!-- Editor -->
        <div class="presence__editor">
            <small>Cambiar estado</small>
            <div class="presence__opts">
                <button
                    v-for="opt in PRESENCE_OPTS"
                    :key="opt"
                    class="presence__opt"
                    :class="{ sel: newStatus === opt }"
                    @click="newStatus = opt"
                >
                    {{ opt }}
                </button>
            </div>
            <input
                v-model="msg"
                class="presence__input"
                placeholder="Mensaje personalizado (opcional)"
                maxlength="256"
            />
            <button class="presence__save" @click="doSave" :disabled="saving">
                {{ saving ? 'Guardando...' : 'Actualizar presencia' }}
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { setPresence } from '../../authService.ts';
import type { Presence } from '../../authService.ts';
import { PRESENCE_OPTS, fmtDate } from './types.ts';

const props = defineProps<{
    uuid:            string;
    currentPresence: Partial<Presence>;
}>();
const emit = defineEmits<{ presenceUpdated: [Partial<Presence>] }>();

const newStatus = ref<string>('Conectado');
const msg       = ref('');
const saving    = ref(false);

const dotClass  = computed(() => {
    const p = props.currentPresence.presence ?? 'Desconectado';
    if (p === 'Conectado')   return 'dot-online';
    if (p === 'No Molestar') return 'dot-dnd';
    return 'dot-offline';
});
const textClass = computed(() => {
    const p = props.currentPresence.presence ?? 'Desconectado';
    if (p === 'Conectado')   return 'clr-online';
    if (p === 'No Molestar') return 'clr-dnd';
    return 'clr-offline';
});

async function doSave() {
    if (!props.uuid) return;
    saving.value = true;
    const r = await setPresence(props.uuid, newStatus.value, msg.value || undefined);
    if (r.success) {
        emit('presenceUpdated', {
            uuid:       props.uuid,
            presence:   newStatus.value,
            message:    msg.value || null,
            updated_at: new Date().toISOString(),
            image_b64:  null,
        });
    }
    saving.value = false;
}
</script>

<style lang="scss" scoped>
@use '../../styles/dashboard' as *;

.presence {
    @include flex-col(1.2rem);
    animation: fadeUp 0.28s ease-out;

    &__title { font-family: 'Lexend', sans-serif; font-size: 1.45rem; margin: 0; font-weight: 600; }

    &__current {
        @include card;
        @include flex-col(0.5rem);
        small { font-size: 0.72rem; color: $text-muted; text-transform: uppercase; font-weight: 600; }
    }
    &__status-row { @include flex-row(0.6rem); }
    &__dot {
        width: 12px; height: 12px; border-radius: 50%;
        &.dot-online  { background: $success; box-shadow: 0 0 6px $success; }
        &.dot-dnd     { background: $danger;  box-shadow: 0 0 6px $danger;  }
        &.dot-offline { background: #636e72; }
    }
    &__msg  { color: #aaa; font-style: italic; margin: 0; }
    &__time { color: $text-muted; }

    &__editor {
        @include card;
        @include flex-col(0.9rem);
        small { font-size: 0.72rem; color: $text-muted; text-transform: uppercase; font-weight: 600; }
    }
    &__opts { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    &__opt {
        padding:       0.45rem 0.9rem;
        border-radius: 8px;
        border:        1px solid $border;
        background:    rgba(255,255,255,.03);
        color:         #aaa;
        cursor:        pointer;
        font-family:   'Inter', sans-serif;
        font-weight:   500;
        transition:    all 0.2s;
        &:hover { border-color: rgba($accent,.4); color: #ddd; }
        &.sel   { background: rgba($accent,.2); border-color: rgba($accent,.5); color: $accent-light; }
    }
    &__input { @extend %input-base; }
    &__save {
        background:    linear-gradient(135deg, $accent, $accent-light);
        color:         black;
        border:        none;
        border-radius: 10px;
        padding:       0.8rem 1.5rem;
        font-family:   'Lexend', sans-serif;
        font-size:     1rem;
        font-weight:   600;
        cursor:        pointer;
        transition:    transform 0.2s, box-shadow 0.2s;
        width:         fit-content;
        &:hover    { transform: translateY(-2px); box-shadow: 0 6px 20px rgba($accent,.4); }
        &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    }
}

.clr-online  { color: $success; }
.clr-dnd     { color: $danger; }
.clr-offline { color: #636e72; }
</style>
