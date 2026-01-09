<template>
  <div class="space-y-4">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="border border-white/10 rounded-xl bg-white/5"
    >
      <button
        @click="toggle(index)"
        class="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-purpleish-100 hover:bg-white/10"
      >
        <span>{{ item.label }}</span>
        <span class="text-xl" v-if="openIndex === index">−</span>
        <span class="text-xl" v-else>+</span>
      </button>

      <transition
        enter-active-class="transition ease-out duration-300"
        leave-active-class="transition ease-in duration-200"
      >
        <p
          v-if="openIndex === index"
          class="px-4 pb-4 text-sm text-purpleish-100/80"
        >
          {{ item.content }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const _props = defineProps({ items: Array });
const openIndex = ref(undefined);

function toggle(index) {
  openIndex.value = openIndex.value === index ? undefined : index;
}
</script>
