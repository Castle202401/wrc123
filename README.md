> 打开此页面 <https://cooldev123.github.io/minecraft_magic_mod/>

## 作为扩展使用

此仓库可在 MakeCode 中作为 **魔法扩展包** 添加，为课堂带来 6 种自定义法术与 12 个新粒子效果。

1. 访问 <https://minecraft.makecode.com/>
2. 点击 **新建项目**
3. 打开齿轮按钮菜单，选择 **扩展**
4. 搜索并导入 **https://github.com/cooldev123/minecraft_magic_mod**

## 编辑此项目

若需自定义法术伤害值、冷却时间或粒子颜色，可在 MakeCode 里直接修改源码：

1. 依旧访问 <https://minecraft.makecode.com/>
2. 点击 **导入** → **从 URL 导入…**
3. 粘贴 **https://github.com/cooldev123/minecraft_magic_mod** 并点击 **导入**
4. 打开 `magic.ts`，调整 `damage`、`cooldown` 等参数，保存即生效

> ⚠️ **提示**  
> 保存后浏览器会生成一个新的 fork，如果你想把改动提交回 GitHub，请在“项目设置”里重新绑定仓库地址或使用 `pxt github push`。

#### 元数据（供搜索与渲染使用）

* for PXT/minecraft  
  `<script src="https://makecode.com/gh-pages-embed.js"></script>`  
  `<script>makeCodeRender("{{ site.makecode.home_url }}", "cooldev123/minecraft_magic_mod");</script>`
