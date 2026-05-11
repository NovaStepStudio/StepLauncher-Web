<script setup lang="ts">
import GridBackground from '../../components/ambient/GridBackground.vue';
</script>
<template>
    <div class="ContainerOpenSource">
        <div class="Title">
            <h1>OPEN SOURCE</h1>
            <img src="../../../assets/svg/sections/open-source.svg" fetchpriority="low">
        </div>
        <div class="DescriptionStep">
            <p>
                StepLauncher no es solo un launcher, es un ecosistema abierto construido con la idea de que el software
                debería ser libre, transparente y evolucionar junto a su comunidad. Cada parte del proyecto está
                diseñada para ser entendida, modificada y mejorada sin barreras, permitiendo que desarrolladores de
                todos los niveles puedan contribuir con nuevas ideas, optimizaciones y módulos que expanden sus
                capacidades. <br>
                <br>
                Nuestro enfoque no se basa únicamente en ofrecer una herramienta funcional, sino en crear una base
                sólida, moderna y escalable que pueda adaptarse a cualquier necesidad: desde rendimiento extremo en la
                gestión de instancias hasta interfaces visualmente pulidas y altamente interactivas. StepLauncher busca
                romper la idea de un launcher cerrado, reemplazándola por un entorno vivo donde la innovación es
                constante y compartida. <br>
                <br>
                Aquí, la comunidad no es un extra, es el núcleo del proyecto. Cada contribución cuenta, cada mejora
                suma, y cada línea de código empuja el proyecto hacia una experiencia más rápida, más estable y más
                completa. StepLauncher evoluciona porque muchas mentes lo hacen posible, no una sola.
            </p>
        </div>
        <div class="Action">
            <a href="https://github.com/NovaStepStudio/StepLauncher" target="_blank">Ver Repositorio</a>
            <a href="https://github.com/NovaStepStudio/StepLauncher" target="_blank">Colaborar en el Proyecto</a>
        </div>
        <GridBackground class="GridBackground"></GridBackground>
    </div>
</template>
<style scoped>
.ContainerOpenSource {
    position: relative;
    width: 100%;
    min-height: 80dvh;
    height: max-content;
    padding: 1rem 0;
    color: white;
    z-index: 1;
}

.GridBackground {
    content-visibility: auto;
    mask: linear-gradient(transparent, black, black, transparent);
    z-index: -1;
}

.Title {
    width: 90%;
    height: max-content;
    margin: .5rem auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Lexend', system-ui;
    mask: linear-gradient(black 30%, transparent 90%);
    font-size: 1.5rem;
    letter-spacing: .5rem;
    font-feature-settings: normal;
    font-variation-settings: "wght" 400;

    img {
        width: 5rem;
        filter: invert(100%);
    }
}

.DescriptionStep {
    width: 90%;
    pointer-events: none;
    margin: .5rem auto;
    font-family: 'Inter', system-ui;
}

.Action {
    position: absolute;
    inset: auto auto 2rem 50%;
    transform: translateX(-50%);
    width: max-content;
    height: 3rem;
    border: 1px solid #5555;
    background-color: #000;
    box-shadow: 0 0 1rem #0005;
    border-radius: 1rem;
    padding: 0.2rem 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5rem;
    transition: box-shadow .5s;
    z-index: 1;

    &:hover {
        box-shadow: 0 .5rem 1rem #5555;
    }

    a {
        border: none;
        border-radius: .5rem;
        background: #3335;
        color: white;
        padding: .5rem;
        font-family: 'Lexend', system-ui;
        font-feature-settings: normal;
        font-variation-settings: "wght" 600;
        text-decoration: none;
        font-size: 0.75rem;
        border: 1px solid transparent;
        cursor: pointer;
        transition: background .3s, border .2s, color .5s;

        &:nth-child(1) {
            letter-spacing: .1rem;
            background-color: #FFFF;
            color: black;

            &:hover {
                color: white;
                background-color: rgb(255, 255, 255, 0.25);
                border: 1px solid rgb(255, 255, 255, 0.25);
            }
        }

        &:hover {
            background-color: #5555;
            border: 1px solid #5558;
        }
    }
}

@media (max-width: 900px) {
    .ContainerOpenSource {
        height: calc(100dvh + 20rem) !important
    }
}
</style>
