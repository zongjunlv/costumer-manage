# 🌐 域名管理指南

本指南将教您如何管理 Vercel 应用的域名和别名。

## 📋 目录

- [快速开始](#快速开始)
- [配置文件方法](#配置文件方法)
- [命令行方法](#命令行方法)
- [脚本工具](#脚本工具)
- [常见问题](#常见问题)

## 🚀 快速开始

### 查看当前域名
```bash
npm run domain:list
```

### 设置新域名
```bash
npm run domain:set production your-new-domain.vercel.app
```

### 部署到生产环境
```bash
npm run deploy
```

## ⚙️ 配置文件方法

### 1. 编辑 `vercel.json`

```json
{
  "alias": [
    "my-customer-manage.vercel.app",
    "crm.yourcompany.com"
  ]
}
```

### 2. 重新部署
```bash
npm run deploy
```

## 💻 命令行方法

### 基础命令

```bash
# 查看所有别名
vercel alias list

# 设置别名
vercel alias set [源域名] [目标域名]

# 删除别名
vercel alias remove [别名]
```

### 实际示例

```bash
# 设置新别名
vercel alias set costumer-manage-31bm0tym7-jungles-projects-885c72ea.vercel.app my-crm.vercel.app

# 为最新部署设置别名
vercel alias set production my-crm.vercel.app

# 删除旧别名
vercel alias remove old-domain.vercel.app
```

## 🛠️ 脚本工具

我们提供了一个便捷的域名管理脚本：

### 查看帮助
```bash
node scripts/domain-manager.js
```

### 常用操作

```bash
# 列出所有域名
npm run domain:list

# 设置域名（需要两个参数）
node scripts/domain-manager.js set production my-new-domain.vercel.app

# 删除域名
node scripts/domain-manager.js remove old-domain.vercel.app

# 查看快速设置选项
npm run domain:quick
```

## 📝 域名类型

### 1. Vercel 免费域名
- 格式：`your-app-name.vercel.app`
- 免费使用
- 自动 HTTPS

### 2. 自定义域名
- 格式：`your-domain.com`
- 需要拥有域名
- 需要配置 DNS

## 🌍 自定义域名配置

### 1. 在域名注册商添加 DNS 记录

**A 记录：**
```
@ → 76.76.19.61
```

**CNAME 记录：**
```
www → cname.vercel-dns.com
```

### 2. 在 Vercel 中添加域名

```bash
vercel alias set production your-domain.com
```

或在 `vercel.json` 中：
```json
{
  "alias": ["your-domain.com"]
}
```

## 📦 npm 脚本说明

| 脚本 | 功能 |
|------|------|
| `npm run domain:list` | 查看所有域名别名 |
| `npm run domain:set` | 设置域名别名 |
| `npm run domain:remove` | 删除域名别名 |
| `npm run domain:quick` | 查看快速设置选项 |
| `npm run deploy` | 部署到生产环境 |
| `npm run deploy:preview` | 部署预览版本 |

## 🔧 高级配置

### 分环境域名

```json
{
  "alias": [
    "my-app-prod.vercel.app"
  ],
  "github": {
    "alias": [
      "my-app-staging.vercel.app"
    ]
  }
}
```

### 多域名配置

```json
{
  "alias": [
    "app.company.com",
    "crm.company.com", 
    "customer-portal.vercel.app"
  ]
}
```

## ❓ 常见问题

### Q: 域名已被占用怎么办？
A: 尝试其他域名变体：
- `my-customer-manage.vercel.app`
- `customer-mgmt.vercel.app`
- `yourname-crm.vercel.app`

### Q: 如何删除多个别名？
A: 逐个删除或使用脚本：
```bash
node scripts/domain-manager.js remove domain1.vercel.app
node scripts/domain-manager.js remove domain2.vercel.app
```

### Q: 自定义域名不生效？
A: 检查：
1. DNS 记录是否正确
2. 域名是否已在 Vercel 中添加
3. 等待 DNS 传播（最多 24 小时）

### Q: 如何查看域名状态？
A: 访问 [Vercel 控制台](https://vercel.com/dashboard) → 项目 → Settings → Domains

## 🔗 相关链接

- [Vercel 域名文档](https://vercel.com/docs/concepts/projects/domains)
- [DNS 配置指南](https://vercel.com/docs/concepts/projects/domains/add-a-domain)
- [自定义域名 SSL](https://vercel.com/docs/concepts/projects/domains/ssl)

---

## 🎯 快速参考

```bash
# 最常用的命令
npm run domain:list                    # 查看域名
npm run deploy                         # 部署应用
vercel alias set production my-app.vercel.app  # 设置域名
``` 