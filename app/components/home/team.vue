<script setup lang="ts">

const items = [
  {
    image: 'https://i.pravatar.cc/300?img=8',
    title: 'Emilio Dagn',
    subtitle: 'UI/UX Designer/ Founder',
    handle: '@74emilio',
    borderColor: '#4F46E5',
    gradient: 'linear-gradient(145deg,#4F46E5,#000)',
    url: 'https://github.com/'
  },
  {
    image: 'https://i.pravatar.cc/300?img=11',
    title: 'Paul Oellers',
    subtitle: 'Full Stack Developer / Founder',
    handle: '@pauloellers',
    borderColor: '#10B981',
    gradient: 'linear-gradient(210deg,#10B981,#000)',
    url: 'https://linkedin.com/in/'
  },
  {
    image: 'https://i.pravatar.cc/300?img=16',
    title: 'Nadine Evin',
    subtitle: 'Projektmanagerin / Marketing / Founder',
    handle: '@nadineevin',
    borderColor: '#F59E0B',
    gradient: 'linear-gradient(165deg,#F59E0B,#000)',
    url: 'https://dribbble.com/'
  },
  {
    image: 'https://i.pravatar.cc/300?img=3',
    title: 'Robert Hegerath',
    subtitle: 'Full Stack Developer / Founder',
    handle: '@roberthegerath',
    borderColor: '#EF4444',
    gradient: 'linear-gradient(195deg,#EF4444,#000)',
    url: 'https://kaggle.com/'
  }
]
</script>


<!-- TEAM SECTION -->
<template>
  <section id="team" class="relative pt-20">
    <div class="relative z-10">
      <h2 class="text-2xl font-bold tracking-tight md:text-3xl">Unser Team</h2>
      <div class="relative min-h-[300px] mt-8">
        <utilsChromaGrid
          :items="items"
          :radius="200"
          :damping="0.45"
          :fadeOut="0.6"
          ease="power3.out"
        />
      </div>
    </div>
  </section>
</template>