<script setup>
    import Presentation from './Sections/Presentation.vue';
    import Where from './Sections/Where.vue';
    import OpenSource from './Sections/OpenSource.vue';
</script>
<template>
    <div class="ContainerSections">
        <Presentation></Presentation>
        <Where></Where>
        <OpenSource></OpenSource>
    </div>
</template>
<style scoped>
    .ContainerSections{
        width: 100%;
        height: max-content;
        min-height: 100dvh;
    }
</style>