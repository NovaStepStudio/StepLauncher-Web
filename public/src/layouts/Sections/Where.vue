<script setup lang="ts">
	import { onMounted, ref } from "vue";

	import StaticLight from "../../components/ambient/StaticLight.vue";

	import StepLauncherMenu from "../../../assets/application/MainMenu.png";
	import StepLauncherOptimization from "../../../assets/application/MainMenu.png";
	import StepLauncherMods from "../../../assets/background/1.png";
	import StepLauncherInstances from "../../../assets/background/2.png";
	import StepLauncherDashboard from "../../../assets/background/3.png";

	type GallerySource = string | HTMLImageElement;

	const images = [
		StepLauncherMenu,
		StepLauncherOptimization,
		StepLauncherMods,
		StepLauncherInstances,
		StepLauncherDashboard
	];

	const src = ref<GallerySource>(StepLauncherMenu);
	const displaySrc = ref<GallerySource>(src.value);

	const opacity = ref(1);
	const containerRef = ref<HTMLElement | null>(null);

	const cache = new Map<string, HTMLImageElement>();

	let token = 0;

	async function preload(imageSrc: string) {
		if (cache.has(imageSrc)) return;

		const img = new Image();

		img.decoding = "async";
		img.src = imageSrc;

		if (img.complete && img.naturalWidth > 0) {
			cache.set(imageSrc, img);
			return;
		}

		await new Promise<void>((resolve) => {
			img.onload = () => resolve();
			img.onerror = () => resolve();
		});

		if (img.naturalWidth > 0) {
			cache.set(imageSrc, img);
		}
	}

	async function changeImage(imageSrc: string) {
		const currentToken = ++token;
		const nextSource = cache.get(imageSrc) ?? imageSrc;
		if (nextSource === displaySrc.value) return;

		const transitionTime = 400;
		const startTime = Date.now();
		opacity.value = 0;

		const img = new Image();
		img.src = typeof nextSource === "string" ? nextSource : nextSource.src;

		const executeSwap = () => {
			if (currentToken !== token) return;
			const remaining = Math.max( 0, transitionTime - (Date.now() - startTime) );

			setTimeout(() => {
				if (currentToken !== token) return;
				displaySrc.value = nextSource;
				src.value = nextSource;
				opacity.value = 1;
			}, remaining);
		};

		if (img.complete) {
			executeSwap();
			return;
		}

		img.onload = executeSwap;
		img.onerror = executeSwap;
	}

	function preloadOnHover(imageSrc: string) {
		if (cache.has(imageSrc)) return;
		const img = new Image();
		img.decoding = "async";
		img.src = imageSrc;
		cache.set(imageSrc, img);
	}

	onMounted(() => {
		Promise.all(images.map(preload));
	});
</script>

<template>
	<div class="WhereStep">
        <div class="Title">
            <h1>¿Por qué StepLauncher?</h1>
        </div>
        <div class="Where_Buttons">
			<button
				class="Button_Where"
				@mouseenter="preloadOnHover(StepLauncherOptimization)"
				@focus="preloadOnHover(StepLauncherOptimization)"
				@click="changeImage(StepLauncherOptimization)"
			>
				<div class="Description">
					<p>
						Impulsado por <a href="https://github.com/Stepnicka012/NovaCore-Engine" target="_blank" >NovaCoreEngine</a>,
						StepLauncher alcanza velocidades extremas gracias a su sistema multihilo en Java.
						Descargá y prepará Minecraft en minutos: ~5 (aprox.) min para 1.12.2 y ~6.5 min (aprox.) para versiones recientes.
					</p>
				</div>

				<div class="TextMain"> <img src="../../../assets/svg/cards/bolt.svg" fetchpriority="low" loading="lazy"> Rapidez </div>
			</button>

			<button
				class="Button_Where"
				@mouseenter="preloadOnHover(StepLauncherInstances)"
				@focus="preloadOnHover(StepLauncherInstances)"
				@click="changeImage(StepLauncherInstances)"
			>
				<div class="Description">
					<p>
						Gestioná múltiples instancias independientes sin conflictos.
						Cada perfil puede tener su propia versión, mods y configuraciones,
						permitiéndote cambiar entre estilos de juego en segundos.
					</p>
				</div>

				<div class="TextMain"> <img src="../../../assets/svg/cards/instance.svg" fetchpriority="low" loading="lazy"> Instancias</div>
			</button>

			<button
				class="Button_Where"
				@mouseenter="preloadOnHover(StepLauncherMods)"
				@focus="preloadOnHover(StepLauncherMods)"
				@click="changeImage(StepLauncherMods)"
			>
				<div class="Description">
					<p>
						Explorá, descargá e instalá mods y modpacks fácilmente desde múltiples fuentes.
						Integración directa para ampliar tu experiencia sin procesos complicados ni configuraciones manuales.
					</p>
				</div>

				<div class="TextMain"> <img src="../../../assets/svg/cards/mod.svg" fetchpriority="low" loading="lazy"> Modpacks y Mods </div>
			</button>

			<button
				class="Button_Where Security"
				@mouseenter="preloadOnHover(StepLauncherDashboard)"
				@focus="preloadOnHover(StepLauncherDashboard)"
				@click="changeImage(StepLauncherDashboard)"
			>
				<div class="Description">
					<p>
						Gestión avanzada de cuentas integrada en StepLauncher.
						Iniciá sesión con múltiples perfiles (premium y no premium),
						cambiá entre ellos al instante y mantené tus datos organizados y sincronizados sin complicaciones.
						El sistema optimiza la autenticación y reduce tiempos de acceso para que entres a jugar sin esperas.
					</p>
				</div>

				<div class="TextMain"> <img src="../../../assets/svg/cards/shield.svg" fetchpriority="low" loading="lazy"> Cuentas </div>
			</button>
		</div>

		<div ref="containerRef" class="Images">
			<img
				:src="typeof displaySrc === 'string' ? displaySrc : displaySrc.src"
				decoding="async"
				loading="eager"
				fetchpriority="high"
			>

			<StaticLight
				:container-ref="containerRef"
				:source="src"

				:options="{
					blur: 80,
					canvasBlur: 15,
					brightness: 1.2,
					saturation: 1.3,
					opacity: 0.6,
					scale: 0.15,
					zIndex: -1,
					fadeInDuration: 400
				}"
			/>
		</div>
	</div>
</template>
<style scoped>
    .WhereStep{
        margin: 1rem 0;
        width: 100%;
        min-height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1rem;
        .Title{
            display:inherit;
            justify-content: inherit;
            align-items: inherit;
            flex-direction: inherit;
            width: 70%;
            font-family: 'Lexend',system-ui;
            font-weight: bolder;
            height: max-content;
            filter: drop-shadow(0 0 1rem rgb(255,255,255,0.25));
            *{margin:.2rem 0;}
        }
        .Where_Buttons{
            width: 60%;
            height: max-content;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            column-gap: .5rem;
            row-gap: 1rem;
            .Button_Where{
                position: relative;
                width: 100%;
                height: 10rem;
                margin: 0 auto;
                overflow: hidden;
                cursor: pointer;
                border: none;
                border-radius: .5rem;
                background-color: #0005;
                border: 1px solid #5555;
                box-shadow: 0 .5rem 1rem #0005;
                transition: box-shadow .3s, border .4s;
                &:hover{
                    box-shadow: 0 0 1rem #0005;
                    border: 1px solid #5555;
                    .Description{
                        inset: 0 0;
                        pointer-events: all;
                        opacity: 1;
                    }
                    .TextMain{
                        opacity: 0;
                        pointer-events: none;
                        inset: -1rem 0;
                    }
                }
                &.Security{
                    width: 100%;
                    grid-column: 1 / 4;
                }
                * { user-select: text; -webkit-user-select: text;}
                .Description{
                    position: absolute;
                    inset: 1rem 0;
                    width: calc(100% - 2rem);
                    height: 100%;
                    pointer-events: none;
                    opacity: 0;
                    overflow-y: auto;
                    overflow-x: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Lexend';
                    text-align: center;
                    padding: 0 1rem;
                    color:white;
                    transition: opacity 250ms, inset .3s;
                    a{ color:#aaa; }
                }
                .TextMain{
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    pointer-events: all;
                    gap: .5rem;
                    font-family: 'Lexend', system-ui;
                    font-size: 1.25rem;
                    color:white;
                    transition: opacity 250ms, inset .3s;
                    img{ filter: invert(100%); }
                }
            }
        }
        .Images{
            position: relative;
            max-width: 60%;
            border-radius: .5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            aspect-ratio: 16 / 9;
            img{
                image-rendering: optimizeSpeed;
                image-resolution: 50dpi;
                content-visibility: auto;
                max-width: 100%;
                flex-shrink: 0;
                object-fit: contain;
                border-radius: .5rem;
            }
            canvas{
                content-visibility: auto;
            }
        }
    }
    @media (max-width: 900px){
        .WhereStep{
            .Where_Buttons{
                width: 90%;
                display: flex;
                flex-direction: column;
            }
        }
        .Images{
            width: 90%;
            max-width: 100% !important;
        }
    }
</style>