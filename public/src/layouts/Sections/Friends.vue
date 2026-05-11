<template>
    <div class="FriendSection">
        <div class="Title">
            <h1>AMIGOS</h1>
            <img src="../../../assets/svg/sections/users-group.svg" fetchpriority="low">
        </div>
        <div class="Description">

        </div>
    </div>
</template>
<style scoped>
.FriendSection {
    width: 90%;
    margin:0 auto;
    height: max-content;
    min-height: 100dvh;
    background:red;
}
.Title{
    width:100%;
    display:flex;
    height:4rem;
    justify-content:space-between;
    align-items:center;
    font-family: 'Lexend',system-ui;
    font-size: 1.25rem;
    font-variation-settings: "wght" 400;
    mask:linear-gradient(black 50%,transparent);
    img{ filter: invert(100%); width: 3rem;}
}
.Description{
    width:100%;
    height: 100%;
    background:blue;
}
</style>