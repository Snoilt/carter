<template>
	<MaxContainer>
		<UCard class="m-auto w-full max-w-md p-6" variant="subtle">
			<div class="grid mx-auto space-y-6">
				<div>
					<h1 class="text-3xl font-bold text-center">Welcome to Carter</h1>
					<p class="text-center">Your Ultimate Flashcard experience</p>
				</div>
				<div class="flex justify-center items-center space-x-4">
					<NuxtLink to="/login">
						<UButton class="flex-none">Let me Play!</UButton>
					</NuxtLink>
					<UButton variant="outline" class="flex-none">What is Carter?</UButton>
				</div>
			</div>
		</UCard>
	</MaxContainer>
</template>
