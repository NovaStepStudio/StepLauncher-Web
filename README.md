<div align="center">
    <h1>StepLauncher Web</h1>
    <p>The official web portal for StepLauncher, built with Vue 3.</p>
</div>

## Descripción General

Este repositorio contiene el código fuente de la página web oficial de StepLauncher. Desarrollado utilizando Vue 3 y Vite, actúa como la puerta de entrada principal para que los usuarios descubran, descarguen e interactúen con el ecosistema del launcher.

## Stack Tecnológico

* **Framework:** Vue 3
* **Herramienta de Construcción:** Vite
* **Lenguaje:** TypeScript
* **Estilos:** Sass
* **Renderizado 3D:** skinview3d (para previsualización de skins)
* **Gestor de Paquetes:** Bun

## Configuración del Entorno de Desarrollo

### Requisitos Previos

Asegúrate de tener instalados en tu sistema:

* [Bun](https://bun.sh/)
* Node.js (versión `^20.19.0` o `>=22.12.0` requerida por los motores del proyecto)

### Instalación

```sh
bun install

```

### Servidor Local

```sh
bun run dev

```

### Construcción para Producción

```sh
bun run build

```

### Previsualización de Producción

```sh
bun run preview

```

## Entorno Recomendado

Para una experiencia de desarrollo óptima, se recomiendan las siguientes herramientas:

* **IDE:** [VS Code](https://code.visualstudio.com/)
* **Extensión:** [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Asegúrate de deshabilitar Vetur)
* **Herramientas de Navegador:** [Vue.js devtools](https://devtools.vuejs.org/) para Chromium o Firefox.

## Soporte de Tipado

Por defecto, TypeScript no puede manejar la información de tipos para las importaciones `.vue`. Este proyecto reemplaza la CLI estándar `tsc` por `vue-tsc` para una verificación de tipos robusta. Se requiere la extensión Volar para que el servicio de lenguaje TypeScript reconozca los tipos `.vue` en tu editor.