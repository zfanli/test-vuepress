import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'zh-CN',
  title: 'Test VuePress 文档项目配置尝试',
  description: 'VuePress 文档项目配置尝试',

  plugins: [
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: 'Search',
          },
        },
        // 允许搜索 Frontmatter 中的 `tags`
        // getExtraFields: (page) => {
        //   console.log(page)
        //   // return [...(page.frontmatter.tags ?? []), page.content, page.headers]
        //   return page.content.split('\n')
        // },
      },
    ],
    [
      '@vuepress/container',
      {
        type: 'ref',
        before: (): string => `<div class="custom-container ref">\n`,
      },
    ],
  ],

  themeConfig: {
    navbar: [
      // 嵌套 Group - 最大深度为 2
      {
        text: 'Group',
        children: [
          {
            text: 'SubGroup',
            children: ['/vuepress.md', '/markdown.md'],
          },
        ],
      },
      // 控制元素何时被激活
      {
        text: 'Group 2',
        children: [
          {
            text: 'Always active',
            link: '/',
            // 该元素将一直处于激活状态
            activeMatch: '/',
          },
          {
            text: 'Active on /foo/',
            link: '/not-foo/',
            // 该元素在当前路由路径是 /foo/ 开头时激活
            // 支持正则表达式
            activeMatch: '^/foo/',
          },
        ],
      },
    ],

    // 侧边栏对象
    // 不同子路径下的页面会使用不同的侧边栏
    sidebar: {
      '/': [
        {
          text: 'Guide',
          children: [
            '/nexus-repository-manager-3.x.md',
            '/verdaccio.md',
            '/vuepress.md',
            '/markdown.md',
            '/test.md',
          ],
        },
      ],
    },
  },
})
