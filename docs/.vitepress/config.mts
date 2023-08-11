import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Alioth',
  description: 'Building kit with React & Vue & Monorepo',
  themeConfig: {
    nav: [
      { text: '指引', link: '/guide/' },
      { text: '组件', link: '/component/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指引',
          items: [
            { text: '什么是 Alioth', link: '/guide/' },
            { text: '起步', link: '/guide/started' },
            { text: 'Git 提交规范', link: '/guide/git-standard' },
            { text: 'TypeScript 集成', link: '/guide/typescript' },
            { text: '代码检查与代码规范', link: '/guide/code-norm' },
            { text: 'VitePress 搭建项目文档', link: '/guide/docs' },
          ],
        },
      ],
      '/component/': [
        {
          text: '组件',
          items: [{ text: '总览', link: '/component/' }],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/fitgrace/alioth' }],
  }
})
