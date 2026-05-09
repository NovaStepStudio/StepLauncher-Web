<template>
    <!-- Upload Skin -->
    <Teleport to="body">
        <div v-if="showSkin" class="modal-bg" @click.self="emit('closeSkin')">
            <div class="modal">
                <h3>Subir Skin</h3>
                <input class="modal__input" v-model="skinName" placeholder="Nombre (ej: Mi Skin)" />
                <label class="modal__file-label">
                    <span v-html="Icons.upload"></span>
                    {{ skinFile ? skinFile.name : 'Seleccionar archivo PNG' }}
                    <input type="file" accept="image/png" @change="onSkinFile" hidden />
                </label>
                <p class="modal__hint">PNG · Máx 1 MB · 64×64 o 128×128 px</p>
                <p v-if="err" class="modal__error">{{ err }}</p>
                <div class="modal__row">
                    <button class="modal__btn modal__btn--primary" @click="doUploadSkin" :disabled="uploading">
                        {{ uploading ? 'Subiendo...' : 'Subir Skin' }}
                    </button>
                    <button class="modal__btn modal__btn--ghost" @click="emit('closeSkin')">Cancelar</button>
                </div>
            </div>
        </div>

        <!-- Upload Cape -->
        <div v-if="showCape" class="modal-bg" @click.self="emit('closeCape')">
            <div class="modal">
                <h3>Subir Capa</h3>
                <input class="modal__input" v-model="capeName" placeholder="Nombre" />
                <label class="modal__file-label">
                    <span v-html="Icons.upload"></span>
                    {{ capeFile ? capeFile.name : 'Seleccionar archivo PNG' }}
                    <input type="file" accept="image/png" @change="onCapeFile" hidden />
                </label>
                <p class="modal__hint">PNG · Máx 512 KB</p>
                <p v-if="err" class="modal__error">{{ err }}</p>
                <div class="modal__row">
                    <button class="modal__btn modal__btn--primary" @click="doUploadCape" :disabled="uploading">
                        {{ uploading ? 'Subiendo...' : 'Subir Capa' }}
                    </button>
                    <button class="modal__btn modal__btn--ghost" @click="emit('closeCape')">Cancelar</button>
                </div>
            </div>
        </div>

        <!-- Create Kit -->
        <div v-if="showKit" class="modal-bg" @click.self="emit('closeKit')">
            <div class="modal">
                <h3>Crear Kit</h3>
                <input class="modal__input" v-model="kitTitle" placeholder="Título del kit" />
                <input class="modal__input" v-model="kitDesc"  placeholder="Descripción (opcional)" />
                <select class="modal__select" v-model="kitSkinId">
                    <option :value="null">Sin skin</option>
                    <option v-for="s in skins" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>
                <select class="modal__select" v-model="kitCapeId">
                    <option :value="null">Sin capa</option>
                    <option v-for="c in capes" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <p v-if="kitErr" class="modal__error">{{ kitErr }}</p>
                <div class="modal__row">
                    <button class="modal__btn modal__btn--primary" @click="doCreateKit" :disabled="creatingKit">
                        {{ creatingKit ? 'Creando...' : 'Crear Kit' }}
                    </button>
                    <button class="modal__btn modal__btn--ghost" @click="emit('closeKit')">Cancelar</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icons } from '../../icons.ts';
import { uploadSkin, uploadCape, createKit } from '../../authService.ts';
import type { Skin, Cape } from './types.ts';

const props = defineProps<{
    showSkin: boolean;
    showCape: boolean;
    showKit:  boolean;
    skins:    Skin[];
    capes:    Cape[];
}>();
const emit = defineEmits<{
    closeSkin:  [];
    closeCape:  [];
    closeKit:   [];
    skinUploaded: [];
    capeUploaded: [];
    kitCreated:   [];
}>();

// Skin upload
const skinName = ref('');
const skinFile = ref<File | null>(null);
const uploading = ref(false);
const err       = ref('');

function onSkinFile(e: Event) {
    skinFile.value = (e.target as HTMLInputElement).files?.[0] ?? null;
}

async function doUploadSkin() {
    if (!skinFile.value || !skinName.value) { err.value = 'Completa todos los campos.'; return; }
    uploading.value = true; err.value = '';
    const r = await uploadSkin(skinFile.value, skinName.value);
    if (r.success) {
        skinName.value = ''; skinFile.value = null;
        emit('closeSkin'); emit('skinUploaded');
    } else { err.value = r.error ?? 'Error'; }
    uploading.value = false;
}

// Cape upload
const capeName = ref('');
const capeFile = ref<File | null>(null);

function onCapeFile(e: Event) {
    capeFile.value = (e.target as HTMLInputElement).files?.[0] ?? null;
}

async function doUploadCape() {
    if (!capeFile.value || !capeName.value) { err.value = 'Completa todos los campos.'; return; }
    uploading.value = true; err.value = '';
    const r = await uploadCape(capeFile.value, capeName.value);
    if (r.success) {
        capeName.value = ''; capeFile.value = null;
        emit('closeCape'); emit('capeUploaded');
    } else { err.value = r.error ?? 'Error'; }
    uploading.value = false;
}

// Kit creation
const kitTitle    = ref('');
const kitDesc     = ref('');
const kitSkinId   = ref<number | null>(null);
const kitCapeId   = ref<number | null>(null);
const creatingKit = ref(false);
const kitErr      = ref('');

async function doCreateKit() {
    if (!kitTitle.value) { kitErr.value = 'Título requerido.'; return; }
    creatingKit.value = true; kitErr.value = '';
    const r = await createKit(kitTitle.value, kitDesc.value || null, kitSkinId.value, kitCapeId.value);
    if (r.success) {
        kitTitle.value = ''; kitDesc.value = ''; kitSkinId.value = null; kitCapeId.value = null;
        emit('closeKit'); emit('kitCreated');
    } else { kitErr.value = r.error ?? 'Error'; }
    creatingKit.value = false;
}
</script>

<style lang="scss" scoped>
@use '../../styles/dashboard' as *;

.modal-bg {
    position:        fixed;
    inset:           0;
    background:      rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(6px);
    z-index:         200;
    display:         flex;
    align-items:     center;
    justify-content: center;
}
.modal {
    background:    #111118;
    border:        1px solid rgba(255,255,255,.1);
    border-radius: 18px;
    padding:       2rem;
    width:         min(440px, 90vw);
    @include flex-col(1rem);
    animation: fadeUp 0.22s ease;

    h3 { font-family: 'Lexend', sans-serif; margin: 0; color: #fff; font-size: 1.2rem; }

    &__input  { @extend %input-base; }
    &__select {
        @extend %input-base;
        appearance: none;
        cursor:     pointer;
        option     { background: #111; }
    }
    &__file-label {
        @extend %input-base;
        cursor:      pointer;
        display:     flex;
        align-items: center;
        gap:         0.5rem;
        color:       $text-muted;
        transition:  border-color 0.2s, color 0.2s;
        &:hover { border-color: $accent; color: #fff; }
    }
    &__hint  { margin: 0; font-size: 0.8rem; color: $text-muted; }
    &__error { margin: 0; font-size: 0.85rem; color: $danger; }
    &__row   { display: flex; gap: 0.6rem; }
    &__btn {
        flex:        1;
        padding:     0.65rem 1rem;
        border-radius: 10px;
        cursor:      pointer;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size:   0.9rem;
        transition:  all 0.2s;
        &--primary {
            background: linear-gradient(135deg, $accent, $accent-light);
            color:      white;
            border:     none;
            &:hover    { transform: translateY(-1px); }
            &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        }
        &--ghost {
            background: rgba(255,255,255,.06);
            border:     1px solid rgba(255,255,255,.1);
            color:      #999;
            &:hover    { color: #fff; background: rgba(255,255,255,.12); }
        }
    }
}
</style>
