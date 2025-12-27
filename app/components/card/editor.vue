<script setup lang="ts">
import type { EditorToolbarItem } from "@nuxt/ui"

const items: EditorToolbarItem[][] = [
	// Block types
	[
		{
			icon: "i-lucide-heading",
			tooltip: { text: "Headings" },
			content: {
				align: "start",
			},
			items: [
				{
					kind: "heading",
					level: 1,
					icon: "i-lucide-heading-1",
					label: "Heading 1",
				},
				{
					kind: "heading",
					level: 2,
					icon: "i-lucide-heading-2",
					label: "Heading 2",
				},
				{
					kind: "heading",
					level: 3,
					icon: "i-lucide-heading-3",
					label: "Heading 3",
				},
				{
					kind: "heading",
					level: 4,
					icon: "i-lucide-heading-4",
					label: "Heading 4",
				},
			],
		},
		{
			icon: "i-lucide-list",
			tooltip: { text: "Lists" },
			content: {
				align: "start",
			},
			items: [
				{
					kind: "bulletList",
					icon: "i-lucide-list",
					label: "Bullet List",
				},
				{
					kind: "orderedList",
					icon: "i-lucide-list-ordered",
					label: "Ordered List",
				},
			],
		},
		{
			kind: "blockquote",
			icon: "i-lucide-text-quote",
			tooltip: { text: "Blockquote" },
		},
		{
			kind: "codeBlock",
			icon: "i-lucide-square-code",
			tooltip: { text: "Code Block" },
		},
		{
			kind: "horizontalRule",
			icon: "i-lucide-separator-horizontal",
			tooltip: { text: "Horizontal Rule" },
		},
	],
	// Link and formatting
	[
		{
			icon: "i-lucide-box",
			tooltip: { text: "More" },
			content: {
				align: "start",
			},
			items: [
				{
					kind: "mark",
					mark: "bold",
					icon: "i-lucide-bold",
					tooltip: { text: "Bold" },
				},
				{
					kind: "mark",
					mark: "italic",
					icon: "i-lucide-italic",
					tooltip: { text: "Italic" },
				},
				{
					kind: "mark",
					mark: "underline",
					icon: "i-lucide-underline",
					tooltip: { text: "Underline" },
				},
				{
					kind: "mark",
					mark: "strike",
					icon: "i-lucide-strikethrough",
					tooltip: { text: "Strikethrough" },
				},
				{
					kind: "mark",
					mark: "code",
					icon: "i-lucide-code",
					tooltip: { text: "Code" },
				},
				{
					kind: "link",
					icon: "i-lucide-link",
					tooltip: { text: "Link" },
				},
			],
		},
	],
	// History controls
	[
		{
			kind: "undo",
			icon: "i-lucide-undo",
			tooltip: { text: "Undo" },
		},
		{
			kind: "redo",
			icon: "i-lucide-redo",
			tooltip: { text: "Redo" },
		},
	],
]
</script>

<template>
	<UContainer class="border border-gray-300 rounded-md p-4 mt-4">
		<UEditor
			v-slot="{ editor }"
			content-type="markdown"
			class="w-full min-h-50 flex flex-col gap-4"
		>
			<UEditorToolbar :editor="editor" :items="items" class="sm:px-8 overflow-x-auto" />
		</UEditor>
	</UContainer>
</template>
