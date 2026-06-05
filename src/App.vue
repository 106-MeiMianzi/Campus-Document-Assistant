<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="['Chat']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>