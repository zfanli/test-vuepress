# Markdown

## 语法扩展

VuePress 使用 markdown-it 解析 Markdown 内容，并借助于 markdown-it 插件来实现语法扩展。

> 可以通过配置项 `markdown` 和插件 API `extendsMarkdown` 来配置内置扩展和加载更多的 markdown-it 插件。

Markdown-it 内置支持 GitHub 风格的表格和删除线语法。

- [GFM 表格](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables)
- [GFM 删除线](https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#styling-text)

VuePress 对 Markdown 添加了以下扩展。

- 标题锚点：点击锚点（#）可以跳转到对应章节位置（通过 hash 实现）
  > 由 markdown-it-anchor 支持
- 内部连接：在 Markdown 尽量使用相对路径，VuePress 会自动将其转换为对应的路由地址
  > 由 Vuepress 内置插件支持
- Emoji :tada:：使用 `:EMOJICODE:` 添加 Emoji 标签
  > 由 markdown-it-emoji 支持
- 目录：使用 `[[toc]]` 生成当前页面的目录
  > 由 Vuepress 内置插件支持
- 代码块行高亮：代码块声明中使用 ` ```ts{1,6-8} ` 格式指定对应的行进行高亮
  > 由 Vuepress 内置插件支持
- 代码块行号：默认是开启的，可以通过配置禁用
  > 由 Vuepress 内置插件支持
- 代码块添加 `v-pre`：模版语法可以在 Markdown 中使用，默认 VuePress 会给代码块添加 `v-pre` 指令让其避免被当作 Vue 模版编译，你可以使用 ` ```md:no-v-pre ` 来允许模版编译
  > 由 Vuepress 内置插件支持 <br>
  > 你可以使用模版编译来进行这样的运算：`1 + 2 + 3 = {{ 1 + 2 + 3 }}` 将编译为 `1 + 2 + 3 = 6`
- 导入代码块：从文件中导入代码块
  > ```md
  > <!-- 最简单的语法 -->
  >
  > @[code](../foo.js)
  >
  > <!-- 仅导入第 1 行至第 10 行 -->
  >
  > @[code{1-10}](../foo.js)
  >
  > <!-- 指定代码语言 -->
  >
  > @[code js](../foo.js)
  >
  > <!-- 行高亮 -->
  >
  > @[code js{2,4-5}](../foo.js)
  > ```
  >
  > 由 Vuepress 内置插件支持

## 在 Markdown 中使用 Vue

VuePress 会将 Markdown 转换为 HTML 后，作为 Vue 但文件组件的 `<template>` 渲染，这表示在 Markdown 中可以直接使用 Vue 模版语法。

**输入**

```md
一加一等于： {{ 1 + 1 }}

<span v-for="i in 3"> span: {{ i }} </span>

这是默认主题内置的 `<Badge />` 组件 <Badge text="演示" />
```

::: tip 输出
一加一等于： {{ 1 + 1 }}

<span v-for="i in 3"> span: {{ i }} </span>

这是默认主题内置的 `<Badge />` 组件 <Badge text="演示" />
:::
