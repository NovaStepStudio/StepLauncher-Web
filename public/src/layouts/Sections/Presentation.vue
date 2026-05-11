<template>
    <div class="MainContent">
        <div class="Images">
            <img width="312px" height="312px" src="../../../assets/others/decorations//Ender_Dragon_1.webp"
                class="EnderDragonImage" loading="lazy" decoding="async" alt="Image Not Load">
            <img width="158px" height="158px" src="../../../assets/icon.png" fetchpriority="high" loading="lazy"
                decoding="async" alt="Image Not Load">
        </div>
        <div class="TextPrimary">
            <h1><strong>El Mejor Launcher</strong> para <strong>Minecraft:Java Edition Premium y No Premium</strong>
            </h1>
        </div>
        <div class="Actions">
            <a href="https://discord.gg/37dYy9apwE" target="_blank">
                <img src="../../../assets/svg/buttons/discord.svg" fetchpriority="low" width="25px" height="25px">
                <p>Discord Oficial</p>
            </a>
            <a href="/Download">
                <img src="../../../assets/svg/buttons/download.svg" fetchpriority="low" width="25px" height="25px">
                <p>Descargar Ya</p>
            </a>
            <a href="https://github.com/NovaStepStudio/StepLauncher" target="_blank">
                <img src="../../../assets/svg/buttons/github.svg" fetchpriority="low" width="25px" height="25px">
                <p>Codigo Fuerte</p>
            </a>
        </div>
    </div>
</template>
<style scoped>
.MainContent {
    width: 100%;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    content-visibility: auto;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at top center, transparent 80%, #0005), url('../../../assets/background/1.png');
        background-position: center center;
        background-attachment: fixed;
        background-size: cover;
        -webkit-mask: linear-gradient(black, transparent);
        mask: linear-gradient(black, transparent);
        z-index: -1;
    }
}

.Images {
    position: relative;
    width: 10rem;
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    user-select: none;
    z-index: 2;

    img {
        object-fit: contain;
        aspect-ratio: 1 / 1;
        image-rendering: optimizeSpeed;
    }

    .EnderDragonImage {
        position: absolute;
        inset: -8rem -3rem;
        filter: drop-shadow(0 0 1rem rgba(128, 0, 128, 0.454));
        z-index: -1;
    }
}

.TextPrimary {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: 'Lexend', system-ui;
    font-size: 0.7rem;

    strong {
        font-weight: bolder;
        color: aqua;
        text-shadow: 0 0 1rem rgb(0, 255, 255, 0.25);
    }
}

.Actions {
    width: max-content;
    height: max-content;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5rem;

    a {
        position: relative;
        display: inherit;
        justify-content: inherit;
        align-items: inherit;
        gap: .5rem;
        border: 1px solid transparent;
        height: 2.35rem;
        border-radius: .5rem;
        color: white;
        padding: .2rem .5rem;
        background-color: #0005;
        backdrop-filter: blur(4px);
        box-shadow: 0 .5rem 1rem #0005;
        text-decoration: none;
        font-family: 'Inter', system-ui;
        font-size: 0.85rem;
        cursor: pointer;
        z-index: 1;
        transition: box-shadow .3s, margin .3s, scale .3s, border .3s;

        * {
            margin: 0;
            pointer-events: none;
        }

        img {
            filter: invert(100%);
        }

        &:nth-child(2) {
            scale: 1.1;
            margin: 0 .5rem;
            height: 2.5rem;
            overflow: hidden;
            padding: .2rem 1rem;

            &::after {
                content: '';
                position: absolute;
                inset: 0;
                background-size: 300% 300%;
                background-position: 0% 50%;
                transition: opacity .3s;
            }
        }

        &:hover {
            scale: 1.2;
            margin: 0 1rem;
            box-shadow: 0 0 1rem #0005;
            border: 1px solid rgb(255, 255, 255, 0.25);

            &:nth-child(2) {
                padding: .2rem 1rem;
                height: 2.6rem;

                &::after {
                    background: linear-gradient(90deg, #0005, #2225, #0005);
                    background-size: 300% 300%;
                    z-index: -1;
                    opacity: .85;
                    transition: transform .5s, filter .5s;
                    animation: GradientMove 3s linear infinite;
                }
            }
        }
    }
}

@keyframes GradientMove {
    0% {
        background-position: 0% 50%;
    }

    100% {
        background-position: 300% 50%;
    }
}

@media (max-width: 900px) {
    .Actions {
        flex-direction: column;
    }

    .TextPrimary {
        width: 90%;
        text-align: center;
    }
}
</style>