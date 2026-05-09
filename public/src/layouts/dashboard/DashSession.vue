<template>
    <section class="session">
        <h2 class="session__title">Sesión</h2>

        <div class="session__grid">
            <div class="session__card" v-for="f in fields" :key="f.label">
                <small>{{ f.label }}</small>
                <strong>{{ f.value }}</strong>
            </div>
        </div>

        <!-- Token reveal -->
        <div class="session__card session__card--wide">
            <small>Token de sesión</small>
            <code
                class="session__token"
                :class="{ revealed: reveal }"
                @click="reveal = !reveal"
            >{{ reveal ? token ?? '—' : '••••••••••••••••••••••••••••••••••••' }}</code>
            <div class="session__hint">
                <span v-html="Icons.eye"></span>
                Clic para {{ reveal ? 'ocultar' : 'mostrar' }}
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { token, currentUser } from '../../authService.ts';
import { Icons } from '../../icons.ts';
import type { UserFull } from '../../authService.ts';

const props = defineProps<{
    profile:    UserFull | null;
    tierLabel:  string;
}>();

const reveal = ref(false);

const fields = computed(() => [
    { label: 'UUID',          value: currentUser.value?.uuid     ?? '—' },
    { label: 'Usuario',       value: currentUser.value?.username ?? '—' },
    { label: 'Plan',          value: props.tierLabel },
    { label: 'Email',         value: props.profile?.email        ?? '—' },
    { label: 'Última sesion hecha',  value: props.profile?.last_login ? new Date(props.profile.last_login).toLocaleString('es-ES') : '—' },
    { label: 'Cuenta creada', value: props.profile?.created_at  ? new Date(props.profile.created_at).toLocaleDateString('es-ES') : '—' },
]);
</script>

<style lang="scss" scoped>
@use '../../styles/dashboard' as *;

.session {
    @include flex-col(1.2rem);
    animation: fadeUp 0.28s ease-out;

    &__title { font-family: 'Lexend', sans-serif; font-size: 1.45rem; margin: 0; font-weight: 600; }

    &__grid {
        display:               grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap:                   0.9rem;
    }

    &__card {
        @include card;
        @include flex-col(0.25rem);
        small  { font-size: 0.72rem; color: $text-muted; text-transform: uppercase; font-weight: 600; }
        strong { font-size: 1rem; color: #eee; }
        &--wide { grid-column: 1 / -1; }
    }

    &__token {
        font-family: 'Courier New', monospace;
        font-size:   0.82rem;
        color:       $accent-light;
        filter:      blur(5px);
        cursor:      pointer;
        transition:  filter 0.3s;
        display:     block;
        word-break:  break-all;
        margin-top:  0.25rem;
        &.revealed { filter: none; }
    }

    &__hint {
        display:     flex;
        align-items: center;
        gap:         0.3rem;
        font-size:   0.75rem;
        color:       $text-muted;
        margin-top:  0.25rem;
        cursor:      pointer;
    }
}
</style>
