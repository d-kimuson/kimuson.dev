declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"internal-article": {
"Django/django_migrate_custom_user.md": {
	id: "Django/django_migrate_custom_user.md";
  slug: "django/django_migrate_custom_user";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Django/django_token_auth.md": {
	id: "Django/django_token_auth.md";
  slug: "django/django_token_auth";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Django/docker_pipenv_django_dev.md": {
	id: "Django/docker_pipenv_django_dev.md";
  slug: "django/docker_pipenv_django_dev";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Django/drf_foreign_key_serializer.md": {
	id: "Django/drf_foreign_key_serializer.md";
  slug: "django/drf_foreign_key_serializer";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Django/drf_permission.md": {
	id: "Django/drf_permission.md";
  slug: "django/drf_permission";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Django/drf_serializer_auto_type/index.mdx": {
	id: "Django/drf_serializer_auto_type/index.mdx";
  slug: "django/drf_serializer_auto_type";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".mdx"] };
"Django/drf_session_auth.md": {
	id: "Django/drf_session_auth.md";
  slug: "django/drf_session_auth";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Django/slack_django_app.md": {
	id: "Django/slack_django_app.md";
  slug: "django/slack_django_app";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"GAS/gas_webpack/index.md": {
	id: "GAS/gas_webpack/index.md";
  slug: "gas/gas_webpack";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Gatsby/gatsby-blog.md": {
	id: "Gatsby/gatsby-blog.md";
  slug: "gatsby/gatsby-blog";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Gatsby/gatsby_markdown_template.md": {
	id: "Gatsby/gatsby_markdown_template.md";
  slug: "gatsby/gatsby_markdown_template";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Gatsby/gatsby_v3/index.md": {
	id: "Gatsby/gatsby_v3/index.md";
  slug: "gatsby/gatsby_v3";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Gatsby/replace_gatsby_blog_mdx/index.md": {
	id: "Gatsby/replace_gatsby_blog_mdx/index.md";
  slug: "gatsby/replace_gatsby_blog_mdx";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Next/ssg_nextjs_image_optimization/index.md": {
	id: "Next/ssg_nextjs_image_optimization/index.md";
  slug: "next/ssg_nextjs_image_optimization";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Python/matplotlib_with_heroku.md": {
	id: "Python/matplotlib_with_heroku.md";
  slug: "python/matplotlib_with_heroku";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Python/mypy_pylance/index.mdx": {
	id: "Python/mypy_pylance/index.mdx";
  slug: "python/mypy_pylance";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".mdx"] };
"Python/pyqt1/index.md": {
	id: "Python/pyqt1/index.md";
  slug: "python/pyqt1";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Python/pyqt2.md": {
	id: "Python/pyqt2.md";
  slug: "python/pyqt2";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Python/pyqt3.md": {
	id: "Python/pyqt3.md";
  slug: "python/pyqt3";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Python/python_datetime.md": {
	id: "Python/python_datetime.md";
  slug: "python/python_datetime";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Python/python_with_npm_scripts/index.md": {
	id: "Python/python_with_npm_scripts/index.md";
  slug: "python/python_with_npm_scripts";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"Python/venv_jupyter.md": {
	id: "Python/venv_jupyter.md";
  slug: "python/venv_jupyter";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"TypeScript/prisma_method/index.md": {
	id: "TypeScript/prisma_method/index.md";
  slug: "typescript/prisma_method";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"TypeScript/react_router_typing/index.mdx": {
	id: "TypeScript/react_router_typing/index.mdx";
  slug: "typescript/react_router_typing";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".mdx"] };
"TypeScript/ts_conditional_type_infer/index.md": {
	id: "TypeScript/ts_conditional_type_infer/index.md";
  slug: "typescript/ts_conditional_type_infer";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"TypeScript/ts_node_esm_paths/index.md": {
	id: "TypeScript/ts_node_esm_paths/index.md";
  slug: "typescript/ts_node_esm_paths";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"VSCode/eslint_stylelint_prettier_vscode_onsave/index.md": {
	id: "VSCode/eslint_stylelint_prettier_vscode_onsave/index.md";
  slug: "vscode/eslint_stylelint_prettier_vscode_onsave";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"VSCode/vscode_textlint_md/index.md": {
	id: "VSCode/vscode_textlint_md/index.md";
  slug: "vscode/vscode_textlint_md";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"shell/color_diff.md": {
	id: "shell/color_diff.md";
  slug: "shell/color_diff";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"インフラ/heroku_docker_image/index.md": {
	id: "インフラ/heroku_docker_image/index.md";
  slug: "インフラ/heroku_docker_image";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"インフラ/ubuntu_node.md": {
	id: "インフラ/ubuntu_node.md";
  slug: "インフラ/ubuntu_node";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"バックエンド/fastapi_openapi_generator_file_with_nested_object/index.md": {
	id: "バックエンド/fastapi_openapi_generator_file_with_nested_object/index.md";
  slug: "バックエンド/fastapi_openapi_generator_file_with_nested_object";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"フロントエンド/auth0_token_django_next_imple/index.mdx": {
	id: "フロントエンド/auth0_token_django_next_imple/index.mdx";
  slug: "フロントエンド/auth0_token_django_next_imple";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".mdx"] };
"フロントエンド/csrf_spa/index.md": {
	id: "フロントエンド/csrf_spa/index.md";
  slug: "フロントエンド/csrf_spa";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"フロントエンド/css_sep_selector_in_out/index.md": {
	id: "フロントエンド/css_sep_selector_in_out/index.md";
  slug: "フロントエンド/css_sep_selector_in_out";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"フロントエンド/focus_display_none/index.md": {
	id: "フロントエンド/focus_display_none/index.md";
  slug: "フロントエンド/focus_display_none";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"フロントエンド/prerender_spa_vue.md": {
	id: "フロントエンド/prerender_spa_vue.md";
  slug: "フロントエンド/prerender_spa_vue";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"フロントエンド/z_index_react_portal/index.md": {
	id: "フロントエンド/z_index_react_portal/index.md";
  slug: "フロントエンド/z_index_react_portal";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"雑記/2020_look_back/index.md": {
	id: "雑記/2020_look_back/index.md";
  slug: "雑記/2020_look_back";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"雑記/2021_look_back/index.md": {
	id: "雑記/2021_look_back/index.md";
  slug: "雑記/2021_look_back";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
"雑記/book_memo_seven_habits/index.md": {
	id: "雑記/book_memo_seven_habits/index.md";
  slug: "雑記/book_memo_seven_habits";
  body: string;
  collection: "internal-article";
  data: InferEntrySchema<"internal-article">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
