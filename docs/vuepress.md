# VuePress

## 介绍

VuePress 是一个静态站点生成工具，主要功能是将 Markdown 内容渲染成静态站点以方便查阅和公开。这个工具被设计用来制作 Vue.js 的官方文档，不过工具只是生成静态站点，我们可以用它来创建文档站点、博客，甚至是其他静态网站。

根据 VuePress 官网的介绍，这个工具具有以下功能定位：

- 由 Vue 和 Vue Router 驱动的单页应用
- 将 Markdown 内容通过 markdown-it 编译为 HTML 并渲染为 Vue 组件
  > 你可以在文档中直接使用 Vue 的能力
- 相较于 Nuxt 其更注重轻量化并以内容为中心的静态网站
- 对 SEO 友好
  > 文档将被编译成静态页面
- 灵活性和可配置性，插件系统
  > 除了生成文档，你可以通过配置将其变成一个博客生成工具

## 配置一个 VuePress 项目

按照以下步骤可以配置一个 VuePress 项目。

```shell
# 准备目录
mkdir vuepress-starter
cd vuepress-starter

# 初始化项目
git init
yarn init

# 安装本地依赖
yarn add -D vuepress@next
```

在 `package.json` 文件添加以下脚本。

```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

将 VuePress 生成的临时目录和缓存文件添加到 `.gitignore` 文件中。

```shell
echo 'node_modules' >> .gitignore
echo '.temp' >> .gitignore
echo '.cache' >> .gitignore
```

创建文档目录，并添加第一篇文档。

```shell
mkdir docs
echo '# Hello VuePress' > docs/README.md
```

启动本地服务。

```shell
yarn docs:dev
```

VuePress 会在 [http://localhost:8080](http://localhost:8080) 启动一个热重载的开发服务器。

## 路由

默认情况下，页面的路由路径是根据 Markdown 文件的相对路径来决定的。目录下的 `README.md` 文件绑定到目录名称的路径上，而目录内的其他文件则根据文件名绑定到对应名称加 `.html` 后缀的路径上。

## Frontmatter

在每篇 Markdown 文档的头部可以插入 Frontmatter 来针对这篇文档配置一些定制化选项。

```markdown
---
lang: zh-CN
title: 页面标题
description: 页面描述
---
```

## 内容

页面内容使用 Markdown 书写，VuePress 会将其转换为 HTML，并作为 Vue 组件的 `<template>` 的内容进行渲染。这表示你可以在 Markdown 中使用 Vue.js 的模版语法能力。

## 参考

- [VuePress 官方文档](https://v2.vuepress.vuejs.org/zh/)
