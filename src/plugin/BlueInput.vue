<script setup lang="ts">
const props = defineProps<{
  label?: string
}>()
</script>

<template>
    <div v-if="props.label">{{ props.label }}</div>
    <input class="my-blue-input"/>
</template>

<style scoped>
.my-blue-input {
  border: 1px solid #00f;
  border-radius: 5px;
}
</style>