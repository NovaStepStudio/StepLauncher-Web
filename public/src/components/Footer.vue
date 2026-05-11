<template>
    <footer>
        <div class="LogoApp">
            <img src="../../assets/icon.png" loading="lazy" fetchpriority="high" decoding="async">
            <h1>StepLauncher</h1>
            <p>Hecho por NovaStepStudios</p>
        </div>
        <div class="Links">
            <section>
                <div class="Header">
                    <h1>Terminos del Producto</h1>
                </div>
                <div class="Body">
                    <ul>
                        <li><a href="/Eula">EULA (Codigo Abierto)</a></li>
                        <li><a href="/TermsAndConditions">Terminos y condiciones</a></li>
                        <li><a href="/TermsAndPrivacity">Terminos de Privacidad</a></li>
                    </ul>
                </div>
            </section>
            <section>
                <div class="Header">
                    <h1>Herramientas para la Comunidad</h1>
                </div>
                <div class="Body">
                    <ul>
                        <li><a href="https://github.com/NovaStepStudio/StepLauncher">StepLauncher</a></li>
                        <li><a href="https://github.com/NovaStepStudio/NovaCore-Engine">NovaCore-Engine</a></li>
                        <li><a href="https://github.com/NovaStepStudio/Minecraft-Core-Master">Minecraft-Core-Master</a>
                        </li>
                        <li><a href="https://github.com/NovaStepStudio/PyOptifine">PyOptifine</a></li>
                        <li><a href="https://github.com/NovaStepStudio/COptifine">COptifine</a></li>
                    </ul>
                </div>
            </section>
            <section>
                <div class="Header">
                    <h1>Redes Sociales</h1>
                </div>
                <div class="Body">
                    <ul>
                        <li><a href="https://discord.gg/37dYy9apwE" target="_blank">Discord</a></li>
                        <li><a href="https://github.com/Stepnicka012" target="_blank">Github</a></li>
                        <li><a href="https://www.instagram.com/stepnickast" target="_blank">Instagram</a></li>
                        <li><a href="https://www.youtube.com/@Stepnicka012" target="_blank">Youtube</a></li>
                        <!-- <li><a href="" target="_blank">Reddit</a></li> -->
                        <!-- <li><a href="" target="_blank">X (Twitter)</a></li> -->
                    </ul>
                </div>
            </section>

        </div>
    </footer>
</template>
<style scoped>
footer {
    width: calc(100% - 2rem);
    padding: 0 1rem;
    height: 15rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(transparent, black);

    .LogoApp {
        display: inherit;
        justify-content: center;
        align-items: inherit;
        flex-direction: column;

        * {
            margin: 0;
        }

        img {
            width: 5rem;
        }

        h1 {
            font-family: 'Lexend', system-ui;
            font-size: 1.2rem;
        }

        p {
            font-family: 'Inter', system-ui;
            font-size: 0.7rem;
            opacity: 0.8
        }
    }

    .Links {
        width: max-content;
        height: max-content;
        display: flex;
        gap: .5rem;

        section {
            min-width: 12rem;
            width: fit-content;
            height: max-content;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            flex-shrink: 0;

            .Header {
                width: 100%;
                padding: 0 1rem;
                margin: 0;
                height: 2rem;
                display: inherit;
                justify-content: center;
                align-items: inherit;
                font-size: 0.45rem;
                font-family: 'Lexend', system-ui;

                * {
                    margin: 0;
                }
            }

            .Body {
                margin-top: .5rem;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Inter', system-ui;
                font-size: 0.85rem;

                ul {
                    padding: 0 1rem;
                    width: calc(100% - 2rem);
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    list-style: none;
                    margin: 0;
                }

                li {
                    opacity: 0.8;
                    user-select: none;
                    transition: margin .2s;

                    a {
                        color: white;
                        text-decoration: none;
                    }

                    &:hover {
                        opacity: 1;
                        margin-left: .5rem;
                    }
                }
            }
        }
    }
}

@media (max-width: 900px) {
    footer {
        height: max-content;
        padding: 2rem 1rem;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .Links {
        width: 100%;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    section {
        width: 100%;
        flex-direction: column;

        .Body,
        ul,
        li {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>