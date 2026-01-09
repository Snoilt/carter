<script setup lang="ts">
import { onMounted, computed, ref, shallowRef, reactive } from 'vue';
import gsap from 'gsap';

interface CardItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  location?: string;
}

interface GridMotionProps {
  items?: CardItem[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

const props = withDefaults(defineProps<GridMotionProps>(), {
  items: () => [],
  className: '',
  radius: 300,
  damping: 0.45,
  fadeOut: 0.6,
  ease: 'power3.out'
});

const rootRef = ref<HTMLElement | null>(null);
const fadeRef = ref<HTMLElement | null>(null);
const setX = shallowRef<(value: number | string) => void>();
const setY = shallowRef<(value: number | string) => void>();
const pos = reactive({ x: 0, y: 0 });

const demo: CardItem[] = [
  {
    image: 'https://i.pravatar.cc/300?img=8',
    title: 'Alex Rivera',
    subtitle: 'Full Stack Developer',
    handle: '@alexrivera',
    borderColor: '#4F46E5',
    gradient: 'linear-gradient(145deg,#4F46E5,#000)',
    url: 'https://github.com/'
  },
  {
    image: 'https://i.pravatar.cc/300?img=11',
    title: 'Jordan Chen',
    subtitle: 'DevOps Engineer',
    handle: '@jordanchen',
    borderColor: '#10B981',
    gradient: 'linear-gradient(210deg,#10B981,#000)',
    url: 'https://linkedin.com/in/'
  },
  {
    image: 'https://i.pravatar.cc/300?img=3',
    title: 'Morgan Blake',
    subtitle: 'UI/UX Designer',
    handle: '@morganblake',
    borderColor: '#F59E0B',
    gradient: 'linear-gradient(165deg,#F59E0B,#000)',
    url: 'https://dribbble.com/'
  },
  {
    image: 'https://i.pravatar.cc/300?img=16',
    title: 'Casey Park',
    subtitle: 'Data Scientist',
    handle: '@caseypark',
    borderColor: '#EF4444',
    gradient: 'linear-gradient(195deg,#EF4444,#000)',
    url: 'https://kaggle.com/'
  },
  {
    image: 'https://i.pravatar.cc/300?img=25',
    title: 'Sam Kim',
    subtitle: 'Mobile Developer',
    handle: '@thesamkim',
    borderColor: '#8B5CF6',
    gradient: 'linear-gradient(225deg,#8B5CF6,#000)',
    url: 'https://github.com/'
  },
  {
    image: 'https://i.pravatar.cc/300?img=60',
    title: 'Tyler Rodriguez',
    subtitle: 'Cloud Architect',
    handle: '@tylerrod',
    borderColor: '#06B6D4',
    gradient: 'linear-gradient(135deg,#06B6D4,#000)',
    url: 'https://aws.amazon.com/'
  }
];

const data = computed(() => (props.items && props.items.length > 0 ? props.items : demo));

onMounted(() => {
  const element = rootRef.value;
  if (!element) return;

  setX.value = gsap.quickSetter(element, '--x', 'px') as (value: number | string) => void;
  setY.value = gsap.quickSetter(element, '--y', 'px') as (value: number | string) => void;
  const { width, height } = element.getBoundingClientRect();
  pos.x = width / 2;
  pos.y = height / 2;
  setX.value?.(pos.x);
  setY.value?.(pos.y);
});

const moveTo = (x: number, y: number) => {
  gsap.to(pos, {
    x,
    y,
    duration: props.damping,
    ease: props.ease,
    onUpdate: () => {
      setX.value?.(pos.x);
      setY.value?.(pos.y);
    },
    overwrite: true
  });
};

const handleMove = (event_: PointerEvent) => {
  const r = rootRef.value?.getBoundingClientRect();
  if (!r) return;
  moveTo(event_.clientX - r.left, event_.clientY - r.top);
  if (fadeRef.value) {
    gsap.to(fadeRef.value, { opacity: 0, duration: 0.25, overwrite: true });
  }
};

const handleLeave = () => {
  if (fadeRef.value) {
    gsap.to(fadeRef.value, {
      opacity: 1,
      duration: props.fadeOut,
      overwrite: true
    });
  }
};

const handleCardClick = (url?: string) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
};

const handleCardMove = (event_: MouseEvent) => {
  const c = event_.currentTarget as HTMLElement;
  const rect = c.getBoundingClientRect();
  const x = event_.clientX - rect.left;
  const y = event_.clientY - rect.top;
  c.style.setProperty('--mouse-x', `${x}px`);
  c.style.setProperty('--mouse-y', `${y}px`);
};

const spotlightStyle = {
  backdropFilter: 'grayscale(1) brightness(0.78)',
  WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
  background: 'rgba(0,0,0,0.001)',
  maskImage:
    'radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 15%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.50) 75%, rgba(0,0,0,0.68) 88%, white 100%)',
  WebkitMaskImage:
    'radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 15%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.50) 75%, rgba(0,0,0,0.68) 88%, white 100%)'
};

const fadeStyle = {
  ...spotlightStyle,
  maskImage:
    'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255,255,255,0.90) 30%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.65) 60%, rgba(255,255,255,0.50) 75%, rgba(255,255,255,0.32) 88%, transparent 100%)',
  WebkitMaskImage:
    'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255,255,255,0.90) 30%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.65) 60%, rgba(255,255,255,0.50) 75%, rgba(255,255,255,0.32) 88%, transparent 100%)',
  opacity: 1
};
</script>

<template>
  <div
    ref="rootRef"
    class="relative w-full grid grid-cols-3 gap-5"
    :style="{
      '--r': `${props.radius}px`,
      '--x': '50%',
      '--y': '50%'
    }"
    @pointermove="handleMove"
    @pointerleave="handleLeave"
  >
    <article
      v-for="(c, i) in data"
      :key="i"
      class="group relative flex flex-col h-[280px] rounded-xl overflow-hidden border border-white/10 hover:border-[var(--card-border)] transition-all duration-300 shadow-md bg-black/40"
      :style="{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--card-border': c.borderColor || 'transparent',
        '--spotlight-color': 'rgba(255,255,255,0.3)',
        cursor: c.url ? 'pointer' : 'default'
      }"
      @mousemove="handleCardMove"
      @click="handleCardClick(c.url)"
    >
      <div
        class="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
        :style="{
          background:
            'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)'
        }"
      />

      <div class="relative z-10 w-full h-[200px] p-3 box-border bg-transparent transition-colors duration-300">
        <img :src="c.image" :alt="c.title" loading="lazy" class="w-full h-full object-cover rounded-lg block" />
      </div>

      <footer class="relative z-10 flex-1 px-3 py-2 text-white font-sans grid grid-cols-[1fr_auto] gap-x-2 gap-y-0.5">
        <h3 class="m-0 text-[0.9rem] font-semibold leading-tight">{{ c.title }}</h3>
        <span v-if="c.handle" class="text-[0.75rem] text-white/60 text-right">{{ c.handle }}</span>
        <p class="m-0 text-[0.75rem] text-white/70 leading-tight">{{ c.subtitle }}</p>
        <span v-if="c.location" class="text-[0.75rem] text-white/60 text-right">{{ c.location }}</span>
      </footer>

      <div
        class="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-30 opacity-100 group-hover:opacity-0"
        :style="{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)'
        }"
      />
    </article>
  </div>
</template>
