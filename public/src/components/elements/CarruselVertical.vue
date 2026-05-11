<template>
    <div class="vertical-carousel" :style="carouselStyle">
        <div v-for="(row, index) in rowsData" :key="index" class="carousel-row">
            <div class="carousel-track" :class="index % 2 === 0 ? 'scroll-down' : 'scroll-up'">
                <div v-for="(item, i) in row.items" :key="i" class="carousel-item">
                    <img v-if="item.url" :src="item.url" :alt="item.label" :loading="i < 3 ? 'eager' : 'lazy'" decoding="async" class="carousel-img"/>
                    <div v-else class="placeholder" :style="{ backgroundColor: item.color }">
                        {{ item.label }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
    images: {
        type: Array,
        default: () => []
    },
    rows: {
        type: Number,
        default: 3
    },
    gap: {
        type: Number,
        default: 12
    },
    speed: {
        type: Number,
        default: 20
    }
});

const carouselStyle = computed(() => ({
    '--speed': props.speed + 's',
    '--gap': props.gap + 'px'
}));

onMounted(() => {
    if (props.images.length > 0) {
        const perRow = Math.ceil(props.images.length / props.rows);
        const toPreload = [];
        for (let i = 0; i < props.rows; i++) {
            const startIdx = i * perRow;
            if (props.images[startIdx]) toPreload.push(props.images[startIdx]);
        }
        toPreload.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
});

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function generatePlaceholders(count) {
    return Array.from({ length: count }, (_, i) => ({
        label: i + 1,
        color: `hsl(${(i * 360) / count}, 70%, 65%)`
    }));
}

const rowsData = computed(() => {
    let source;
    if (props.images.length > 0) {
        source = props.images.map((url, i) => ({
            url,
            label: `Imagen ${i + 1}`
        }));
    } else {
        source = generatePlaceholders(props.rows * 4);
    }
    
    const shuffled = shuffleArray(source);
    const perRow = Math.ceil(shuffled.length / props.rows);
    const result = [];
    
    for (let i = 0; i < props.rows; i++) {
        let chunk = shuffled.slice(i * perRow, (i + 1) * perRow);
        while (chunk.length < perRow && shuffled.length > 0) {
            const randomItem = shuffled[Math.floor(Math.random() * shuffled.length)];
            chunk.push(randomItem);
        }
        result.push({ items: [...chunk, ...chunk] });
    }
    return result;
});
</script>

<style scoped>
.vertical-carousel {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 30rem;
    max-width: 1000px;
    -webkit-mask: linear-gradient(transparent,black,black,transparent);
    mask:linear-gradient(transparent,black,black,transparent);
    overflow:hidden;
    margin: 0 auto;
    gap: 8px;
}

.carousel-row {
    flex: 1;
    overflow: hidden;
    position: relative;
}

.carousel-track {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    will-change: transform;
}

.carousel-item {
    width: 100%;
    flex-shrink: 0;
}

.carousel-img {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
    border-radius: 12px;
    image-rendering: optimizeSpeed;
    image-resolution: 100dpi;
    background: #e0e0e0;
}

.placeholder {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 2rem;
}

.scroll-down {
    animation: scrollDown var(--speed) linear infinite;
}
.scroll-up {
    animation: scrollUp var(--speed) linear infinite;
}

@keyframes scrollDown {
    0% {
        transform: translateY(-50%);
    }
    100% {
        transform: translateY(0);
    }
}
@keyframes scrollUp {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-50%);
    }
}
</style>