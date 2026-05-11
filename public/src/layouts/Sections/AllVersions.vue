<script setup lang="ts">
import CarruselVertical from '../../components/elements/CarruselVertical.vue';
const Images = Array.from({ length: 16 }, (_, i) =>
    new URL(`../../../assets/minecraft_banners/${i + 1}.webp`, import.meta.url).href
);
</script>
<template>
    <div class="MinecraftAllVersions">
        <div class="Title">
            <h1>JUEGA TODAS LAS VERSIONES DE MINECRAFT</h1>
            <img src="../../../assets/others/decorations/Grass.png" fetchpriority="high" loading="lazy" decoding="async">
        </div>
        <div class="Content">
            <div class="Text">
                <div class="Hero">
                    <img src="../../../assets/others/decorations/CombatUpdate.webp" fetchpriority="high" loading="lazy" decoding="async">
                </div>
                <p>Explora Minecraft sin límites y sin esperas. Con StepLauncher tienes acceso inmediato a prácticamente cualquier versión del juego, desde las más recientes actualizaciones oficiales hasta snapshots experimentales y versiones clásicas que marcaron la historia del juego.</p>
                <p>Cada nueva versión de Minecraft se integra en el launcher apenas está disponible, permitiéndote saltar directo a la experiencia más actual sin procesos complicados ni instalaciones manuales. Ya sea que quieras probar las últimas mecánicas, volver a una versión nostálgica o experimentar con snapshots inestables, todo está a solo un clic.</p>
                <p>StepLauncher organiza todas las versiones de forma clara y accesible, para que puedas elegir exactamente cómo quieres jugar en cada momento. Cambiar entre versiones es rápido, fluido y optimizado, sin romper tu flujo de juego ni perder tiempo configurando archivos.</p>
                <p>Además, el sistema está pensado para jugadores que usan mods o diferentes loaders, permitiéndote combinar versiones con Forge, Fabric, NeoForge y otros entornos sin complicaciones.</p>
                <p>Desde la versión más reciente hasta los inicios de Minecraft, todo el universo del juego está disponible para ti, listo para ser explorado cuando quieras.</p>
            </div>
            <div class="CarruselContainer">
                <CarruselVertical :images="Images"></CarruselVertical>
            </div>
        </div>
    </div>
</template>
<style scoped>
.MinecraftAllVersions{
    width: 100%;
    height:max-content;
    display:flex;
    flex-direction: column;
}
.Title{
    width:calc(100% - 4rem);
    height: 4rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding: 0 2rem;
    font-family: 'Lexend', system-ui;
    font-variation-settings: "wght" 900;
    img{width: 4rem;}
    h1{mask: linear-gradient(black 40%,transparent 95%);}
}
.Content{
    margin: 0 2rem;
    width:calc(100% - 4rem); 
    padding-top:4rem;
    height: calc(100% - 4rem);
    text-align: start;
    font-family: 'Inter', system-ui;
    font-variation-settings: "wght" 550;
    display:flex;
    justify-content: space-between;
    align-items: center;
    gap:1rem;
    font-size: 0.9rem;
    p{margin:.5rem 0; z-index:1;}
    .Text{width: 50%; flex-shrink:0;}
    .Hero{
        margin-bottom:1rem;
        width:100%;
        height: 10rem;
        display: flex;
        justify-content:center;
        align-items: center;
        background-image: url('../../../assets/background/4.png');
        background-position: center center;
        background-size: cover;
        border-radius:.5rem;
        z-index: -1;
        img{width: 30rem; content-visibility: auto; filter: drop-shadow(0 0 1rem black);}
    }
}
.CarruselContainer{
    position:relative;
    flex: 1 1 auto;
    overflow:hidden;
}
@media (max-width: 900px){
    .MinecraftAllVersions{
        margin-top:4rem;
    }
    .Title{
        text-align:center;
        justify-content: center !important;
        flex-direction: column;
        img{display:none;}
    }
    .Text{
        margin: 0 auto;
        width:100% !important;
    }
    .CarruselContainer{
        display:none;
        content-visibility: hidden;
    }
}
</style>