<script setup lang="ts">
    import { ref } from "vue";

    type LinkTypes = {
        path: string
        text: string
        icon?: string
    }

    defineProps<{
        links: LinkTypes[]
    }>()

    const MenuOpen = ref(false)
</script>

<template>
    <header>
        <a class="TitleApp" href="./">
            <img src="../../assets/icon.png" loading="lazy" fetchpriority="high" width="32px" height="32px">
            <h1>StepLauncher</h1>
        </a>

        <div>
            <ul class="Navegation">
                <li v-for="link in links">
                    <a :href="link.path">
                        <img :src="link.icon" alt="IconSVG" fetchpriority="low">
                        {{ link.text }}
                    </a>
                </li>
            </ul>

            <button class="MenuButton" @click="MenuOpen = !MenuOpen"><img src="../../assets/svg/header/menu.svg" fetchpriority="low" style="width: 1rem; filter: invert(100%);"></button>
        </div>
    </header>

    <div class="Overlay" :class="{ Active: MenuOpen }" @click="MenuOpen = false"></div>

    <aside class="MobileMenu" :class="{ Active: MenuOpen }">
        <div class="TitleApp" href="#/">
            <img src="../../assets/icon.png" loading="lazy" fetchpriority="high" width="32px" height="32px">
            <h1>StepLauncher</h1>
        </div>
        <ul>
            <li v-for="link in links">
                <a :href="link.path" @click="MenuOpen = false">
                    <img :src="link.icon" alt="IconSVG" fetchpriority="low">
                    {{ link.text }}
                </a>
            </li>
        </ul>
    </aside>
</template>

<style scoped>
    header{
        position: fixed;
        top:0;
        left:0;
        width: calc(100% - 2rem);
        padding: .5rem 1rem;
        height: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 50;
        isolation: isolate;

        div{
            display: flex;
            justify-content: center;
            align-items: center;
        }

        &::after{
            content:'';
            position: absolute;
            inset:0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(10px);
            background: linear-gradient(#0005,transparent);
            mask:linear-gradient(black 20%,transparent);
            z-index: -1;
        }

        .TitleApp{
            display: inherit;
            justify-content: center;
            align-items: inherit;
            color:white;
            text-decoration:none;
            gap: .5rem;
            font-family: 'Lexend', system-ui;
            font-size: 0.5rem;

            *{margin:0;}
        }

        .Navegation{
            display: flex;
            justify-content: center;
            align-items: center;
            gap: .5rem;
            list-style: none;
            color:white;
            font-family: 'Inter', system-ui;
            font-size: 0.85rem;

            a{
                text-decoration: none;
                padding: 0.35rem 0.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: .25rem;
                color:white;
                border-radius: .5rem;
                background: #0005;
                backdrop-filter: blur(4px);
                border: 1px solid #1115;
                transition: background-color .2s, border .3s, transform .2s;

                *{margin:0;}

                img{
                    width: 1rem;
                    object-fit: cover;
                    filter: invert(100%);
                }

                &:hover{
                    background-color: #5555;
                    border: 1px solid #5555;
                    transform: translateY(-.1rem);
                }
            }
        }

        .MenuButton{
            width: 2.5rem;
            height: 2.5rem;
            display: none;
            justify-content: center;
            align-items: center;
            border:none;
            outline:none;
            color:white;
            font-size: 1.2rem;
            border-radius: .75rem;
            background: #0005;
            border: 1px solid #1115;
            backdrop-filter: blur(10px);
            transition:
                background-color .2s,
                border .3s,
                transform .2s;

            &:hover{
                background-color: #5555;
                border: 1px solid #5555;
                transform: scale(1.05);
            }
        }
    }

    .Overlay{
        position: fixed;
        inset:0;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
        background: #0005;
        backdrop-filter: blur(5px);
        transition: opacity .25s;
        z-index: 90;

        &.Active{
            opacity: 1;
            pointer-events: auto;
        }
    }

    .MobileMenu{
        position: fixed;
        inset: 0 -25rem auto auto;
        width: 20rem;
        height: 100dvh;
        padding: 0 1rem 1rem 1rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        background: #050505cc;
        backdrop-filter: blur(20px);
        border-left: 1px solid #ffffff10;
        transition: inset .3s ease;
        z-index: 100;

        &.Active{
            inset:0 0 auto auto;
        }
        .TitleApp{
            width: 100%;
            font-family: 0.5rem;
            font-family: 'Lexend',system-ui;
            display: inherit;
            justify-content: center;
            align-items: center;
            gap:.5rem;
            img{ filter: none; width: 2rem;}
        }
        ul{
            width: 100%;
            height: max-content;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            gap: .5rem;
            padding:0;
            margin:0;
            list-style: none;
            li{ width: 100%; }
            a{
                width: calc(100% - 1rem);
                padding: .75rem .5rem;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: .5rem;
                text-decoration: none;
                color:white;
                font-family: 'Inter', system-ui;
                font-size: 0.95rem;
                border-radius: .75rem;
                background: #0005;
                border: 1px solid #1115;
                transition: background-color .2s, border .3s, transform .2s;
                img{
                    width: 1rem;
                    object-fit: cover;
                    filter: invert(100%);
                }

                &:hover{
                    background-color: #5555;
                    border: 1px solid #5555;
                    transform: translateX(.25rem);
                }
            }
        }
    }

    @media (max-width: 900px){
        header{
            .Navegation{
                display: none;
            }

            .MenuButton{
                display: flex;
            }
        }
    }
</style>