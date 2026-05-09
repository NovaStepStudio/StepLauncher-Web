<script setup lang="ts">
    import { onMounted, onBeforeUnmount, ref, shallowRef } from 'vue'

    interface Point {
        x: number
        y: number
        currentX: number
        currentY: number
        targetX: number
        targetY: number
        opacity: number
        targetOpacity: number
        element: HTMLDivElement
    }

    const GRID_SIZE = 75
    const FORCE_RADIUS = 250
    const FORCE_POWER = 100
    const SMOOTH = 0.1
    const MIN_OPACITY = 0.15
    const MAX_OPACITY = 2
    const GHOST_SMOOTH = 0.06

    const containerRef = ref<HTMLElement | null>(null)
    const points = shallowRef<Point[]>([])

    let pointGrid: Point[][] = []
    const mouse = { x: 0, y: 0, active: false }
    const ghost = { x: 0, y: 0 }
    const activePoints = new Set<Point>()

    let animationFrame = 0
    let isAnimating = false

    let containerBounds = { left: 0, top: 0, width: 0, height: 0 }
    let resizeObserver: ResizeObserver | null = null

    function buildPointGrid(pointsArr: Point[]) {
        pointGrid = []
        for (const p of pointsArr) {
            const row = Math.round(p.y / GRID_SIZE)
            const col = Math.round(p.x / GRID_SIZE)
            if (!pointGrid[row]) pointGrid[row] = []
            pointGrid[row][col] = p
        }
    }

    function createGrid() {
        const container = containerRef.value
        if (!container) return

        const rect = container.getBoundingClientRect()
        containerBounds = {
            left: rect.left,
            top: rect.top,
            width: container.offsetWidth,
            height: container.offsetHeight,
        }

        const cols = Math.floor(containerBounds.width / GRID_SIZE) + 1
        const rows = Math.floor(containerBounds.height / GRID_SIZE) + 1
        const newPoints: Point[] = []
        const fragment = document.createDocumentFragment()

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * GRID_SIZE
                const y = row * GRID_SIZE
                const el = document.createElement('div')
                el.className = 'Point'
                el.style.left = `${x}px`
                el.style.top = `${y}px`
                fragment.appendChild(el)

                newPoints.push({
                    x,
                    y,
                    currentX: 0,
                    currentY: 0,
                    targetX: 0,
                    targetY: 0,
                    opacity: MIN_OPACITY,
                    targetOpacity: MIN_OPACITY,
                    element: el,
                })
            }
        }

        container.innerHTML = ''
        container.appendChild(fragment)
        points.value = newPoints
        buildPointGrid(newPoints)
    }

    function updateGridOnResize() {
        const container = containerRef.value
        if (!container) return

        const width = container.offsetWidth
        const height = container.offsetHeight
        if (width === containerBounds.width && height === containerBounds.height) return

        containerBounds.width = width
        containerBounds.height = height

        const oldPoints = points.value
        const oldMap = new Map<string, Point>()
        for (const p of oldPoints) {
            const col = Math.round(p.x / GRID_SIZE)
            const row = Math.round(p.y / GRID_SIZE)
            oldMap.set(`${col},${row}`, p)
        }

        const newCols = Math.floor(width / GRID_SIZE) + 1
        const newRows = Math.floor(height / GRID_SIZE) + 1
        const newPoints: Point[] = []
        const fragment = document.createDocumentFragment()

        for (let row = 0; row < newRows; row++) {
            for (let col = 0; col < newCols; col++) {
                const x = col * GRID_SIZE
                const y = row * GRID_SIZE
                const key = `${col},${row}`
                let point = oldMap.get(key)

                if (point) {
                    point.x = x
                    point.y = y
                    point.element.style.left = `${x}px`
                    point.element.style.top = `${y}px`
                    oldMap.delete(key)
                } else {
                    const el = document.createElement('div')
                    el.className = 'Point'
                    el.style.left = `${x}px`
                    el.style.top = `${y}px`
                    fragment.appendChild(el)
                    point = {
                        x,
                        y,
                        currentX: 0,
                        currentY: 0,
                        targetX: 0,
                        targetY: 0,
                        opacity: MIN_OPACITY,
                        targetOpacity: MIN_OPACITY,
                        element: el,
                    }
                }
                newPoints.push(point)
            }
        }

        for (const p of oldMap.values()) {
            activePoints.delete(p)
            p.element.remove()
        }
        if (fragment.children.length > 0) {
            container.appendChild(fragment)
        }

        points.value = newPoints
        buildPointGrid(newPoints)

        if ((mouse.active || activePoints.size > 0) && !isAnimating) {
            startAnimation()
        }
    }

    function animate() {
        const radiusSq = FORCE_RADIUS * FORCE_RADIUS
        if (mouse.active) {
            const distToMouse = Math.hypot(mouse.x - ghost.x, mouse.y - ghost.y)
            if (distToMouse < 1.5) {
                ghost.x = mouse.x
                ghost.y = mouse.y
            } else {
                ghost.x += (mouse.x - ghost.x) * GHOST_SMOOTH
                ghost.y += (mouse.y - ghost.y) * GHOST_SMOOTH
            }
        }

        const totalRows = pointGrid.length
        const totalCols = pointGrid[0]?.length ?? 0

        if (mouse.active) {
            const minCol = Math.max(0, Math.floor((ghost.x - FORCE_RADIUS) / GRID_SIZE))
            const maxCol = Math.min(totalCols - 1, Math.ceil((ghost.x + FORCE_RADIUS) / GRID_SIZE))
            const minRow = Math.max(0, Math.floor((ghost.y - FORCE_RADIUS) / GRID_SIZE))
            const maxRow = Math.min(totalRows - 1, Math.ceil((ghost.y + FORCE_RADIUS) / GRID_SIZE))

            for (let row = minRow; row <= maxRow; row++) {
                const rowPoints = pointGrid[row]
                if (!rowPoints) continue
                for (let col = minCol; col <= maxCol; col++) {
                    const p = rowPoints[col]
                    if (!p) continue

                    activePoints.add(p)

                    const dx = p.x - ghost.x
                    const dy = p.y - ghost.y
                    const distSq = dx * dx + dy * dy

                    if (distSq < radiusSq) {
                        const dist = Math.sqrt(distSq) || 1
                        const force = 1 - dist / FORCE_RADIUS
                        p.targetX = (dx / dist) * force * FORCE_POWER
                        p.targetY = (dy / dist) * force * FORCE_POWER
                        p.targetOpacity = MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * force
                    } else {
                        p.targetX = 0
                        p.targetY = 0
                        p.targetOpacity = MIN_OPACITY
                    }
                }
            }
        }

        const toRemove: Point[] = []

        for (const p of activePoints) {
            if (!mouse.active) {
                p.targetX = 0
                p.targetY = 0
                p.targetOpacity = MIN_OPACITY
            } else {
                const col = Math.round(p.x / GRID_SIZE)
                const row = Math.round(p.y / GRID_SIZE)
                const inWindow = ghost.x !== undefined &&
                    col >= Math.floor((ghost.x - FORCE_RADIUS) / GRID_SIZE) &&
                    col <= Math.ceil((ghost.x + FORCE_RADIUS) / GRID_SIZE) &&
                    row >= Math.floor((ghost.y - FORCE_RADIUS) / GRID_SIZE) &&
                    row <= Math.ceil((ghost.y + FORCE_RADIUS) / GRID_SIZE)

                if (!inWindow) {
                    p.targetX = 0
                    p.targetY = 0
                    p.targetOpacity = MIN_OPACITY
                }
            }

            p.currentX += (p.targetX - p.currentX) * SMOOTH
            p.currentY += (p.targetY - p.currentY) * SMOOTH
            p.opacity += (p.targetOpacity - p.opacity) * 0.08

            p.element.style.transform = `translate(${p.currentX}px, ${p.currentY}px)`
            p.element.style.opacity = p.opacity.toString()

            if (
                Math.abs(p.currentX) < 0.001 &&
                Math.abs(p.currentY) < 0.001 &&
                Math.abs(p.opacity - MIN_OPACITY) < 0.001 &&
                p.targetX === 0 &&
                p.targetY === 0 &&
                p.targetOpacity === MIN_OPACITY
            ) {
                toRemove.push(p)
            }
        }

        for (const p of toRemove) {
            activePoints.delete(p)
        }

        if (!mouse.active && activePoints.size === 0) {
            stopAnimation()
        } else {
            animationFrame = requestAnimationFrame(animate)
        }
    }

    function startAnimation() {
        if (isAnimating) return
        isAnimating = true
        animationFrame = requestAnimationFrame(animate)
    }

    function stopAnimation() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame)
            animationFrame = 0
        }
        isAnimating = false
    }

    function handleMouseMove(event: MouseEvent) {
        const container = containerRef.value
        if (!container) return

        const rect = container.getBoundingClientRect()
        containerBounds.left = rect.left
        containerBounds.top = rect.top

        const relX = event.clientX - rect.left
        const relY = event.clientY - rect.top

        const inside = relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height
        if (!inside) {
            if (mouse.active) {
                mouse.active = false
            }
            return
        }

        mouse.x = relX
        mouse.y = relY

        if (!mouse.active) {
            mouse.active = true
            ghost.x = mouse.x
            ghost.y = mouse.y
            startAnimation()
        }
    }

    function handleMouseLeave() {
        mouse.active = false
    }

    onMounted(() => {
        createGrid()
        const container = containerRef.value!

        containerBounds.left = container.getBoundingClientRect().left
        containerBounds.top = container.getBoundingClientRect().top

        container.addEventListener('mousemove', handleMouseMove)
        container.addEventListener('mouseleave', handleMouseLeave)

        resizeObserver = new ResizeObserver(() => {
            const rect = container.getBoundingClientRect()
            containerBounds.left = rect.left
            containerBounds.top = rect.top
            updateGridOnResize()
        })
        resizeObserver.observe(container)
    })

    onBeforeUnmount(() => {
        stopAnimation()
        const container = containerRef.value
        if (container) {
            container.removeEventListener('mousemove', handleMouseMove)
            container.removeEventListener('mouseleave', handleMouseLeave)
            container.innerHTML = ''
        }
        resizeObserver?.disconnect()
        points.value = []
    })
</script>
<template>
    <div ref="containerRef" class="GridBackground" />
</template>
<style scoped>
    .GridBackground {
        position: absolute;
        inset: 0;
        overflow: hidden;
        contain: layout paint size;
    }

    :deep(.Point) {
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 999px;
        background: white;
        opacity: 0.15;
        transform: translate3d(0, 0, 0);
        pointer-events: none;
        will-change: transform, opacity;
    }
</style>