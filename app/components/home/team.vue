<script setup lang="ts">
const items = [
	{
		image: "https://i.pravatar.cc/300?img=8",
		title: "Emilio Dagn",
		subtitle: "UI/UX Designer & Founder",
		handle: "@74emilio",
		borderColor: "#4F46E5",
		url: "https://github.com/",
	},
	{
		image: "https://i.pravatar.cc/300?img=11",
		title: "Paul Oellers",
		subtitle: "Full Stack Developer & Founder",
		handle: "@pauloellers",
		borderColor: "#10B981",
		url: "https://linkedin.com/in/",
	},
	{
		image: "https://i.pravatar.cc/300?img=16",
		title: "Nadine Evin",
		subtitle: "Projektmanagerin & Marketing & Founder",
		handle: "@nadineevin",
		borderColor: "#F59E0B",
		url: "https://dribbble.com/",
	},
	{
		image: "https://i.pravatar.cc/300?img=3",
		title: "Robert Hegerath",
		subtitle: "Full Stack Developer & Founder",
		handle: "@roberthegerath",
		borderColor: "#EF4444",
		url: "https://kaggle.com/",
	},
]
</script>

<!-- TEAM SECTION -->
<template>
	<section id="team" class="relative pt-20">
		<div class="relative z-10">
			<h2
				class="text-2xl font-bold tracking-tight md:text-3xl text-black dark:text-purpleish-50 mb-2"
			>
				Unser Team
			</h2>
			<p class="text-gray-700 dark:text-purpleish-100/80 mb-8">
				Die Gründer hinter Kardr — passionate Learner & Builders
			</p>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<NuxtLink v-for="(member, i) in items" :key="i" :to="member.url" target="_blank">
					<UCard
						class="bg-white/20 dark:bg-white/5 ring-1 ring-gray-200/50 dark:ring-white/10 hover:ring-2 transition-all duration-300 rounded-3xl h-full"
						:ui="{ body: { padding: 'p-4' } }"
						variant="subtle"
					>
						<!-- Avatar -->
						<div class="flex justify-center mb-3">
							<div
								class="w-20 h-20 rounded-2xl overflow-hidden ring-4 shrink-0"
								:style="{ borderColor: member.borderColor }"
							>
								<img
									:src="member.image"
									:alt="member.title"
									class="w-full h-full object-cover"
								/>
							</div>
						</div>

						<!-- Content -->
						<div class="text-center">
							<h3 class="text-base font-bold text-black dark:text-purpleish-50">
								{{ member.title }}
							</h3>
							<p class="text-xs text-gray-600 dark:text-purpleish-100/70 mt-1">
								{{ member.subtitle }}
							</p>
							<p class="text-xs text-gray-500 dark:text-purpleish-100/60 mt-2">
								{{ member.handle }}
							</p>
						</div>
					</UCard>
				</NuxtLink>
			</div>
		</div>
	</section>
</template>
