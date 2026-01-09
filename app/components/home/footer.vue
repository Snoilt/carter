<!-- FOOTER -->
<template>
<footer class="mt-16 border-t border-gray-200 dark:border-slate-700 py-10 text-sm text-gray-700 dark:text-slate-400">
    <div class="flex flex-col justify-between gap-3 md:flex-row">
      <span>© {{ new Date().getFullYear() }} Kardr</span>
      <div class="flex gap-4">
        <NuxtLink 
          to="/impressum" 
          class="hover:text-gray-900 dark:hover:text-slate-200"
        >
          Impressum
        </NuxtLink>
        <NuxtLink 
          to="/datenschutz" 
          class="hover:text-gray-900 dark:hover:text-slate-200"
        >
          Datenschutz
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>