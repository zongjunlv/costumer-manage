#!/usr/bin/env node

const { execSync } = require('child_process');

// 域名管理脚本
class DomainManager {
  // 列出所有别名
  static listAliases() {
    console.log('📋 当前域名别名：');
    try {
      execSync('vercel alias list', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ 获取别名失败：', error.message);
    }
  }

  // 设置新别名
  static setAlias(source, target) {
    console.log(`🔄 设置别名：${source} → ${target}`);
    try {
      execSync(`vercel alias set ${source} ${target}`, { stdio: 'inherit' });
      console.log('✅ 别名设置成功！');
    } catch (error) {
      console.error('❌ 设置别名失败：', error.message);
    }
  }

  // 删除别名
  static removeAlias(alias) {
    console.log(`🗑️ 删除别名：${alias}`);
    try {
      execSync(`vercel alias remove ${alias}`, { stdio: 'inherit' });
      console.log('✅ 别名删除成功！');
    } catch (error) {
      console.error('❌ 删除别名失败：', error.message);
    }
  }

  // 快速设置常用域名
  static quickSetup() {
    const domains = [
      'my-customer-manage.vercel.app',
      'crm-system.vercel.app', 
      'customer-portal.vercel.app'
    ];

    console.log('🚀 快速域名设置：');
    domains.forEach((domain, index) => {
      console.log(`${index + 1}. ${domain}`);
    });

    console.log('\n使用方法：');
    console.log('node scripts/domain-manager.js set production my-customer-manage.vercel.app');
  }
}

// 命令行参数处理
const [,, command, ...args] = process.argv;

switch (command) {
  case 'list':
    DomainManager.listAliases();
    break;
  case 'set':
    if (args.length !== 2) {
      console.log('用法: node scripts/domain-manager.js set <源域名> <目标域名>');
      console.log('示例: node scripts/domain-manager.js set production my-domain.vercel.app');
    } else {
      DomainManager.setAlias(args[0], args[1]);
    }
    break;
  case 'remove':
    if (args.length !== 1) {
      console.log('用法: node scripts/domain-manager.js remove <别名>');
    } else {
      DomainManager.removeAlias(args[0]);
    }
    break;
  case 'quick':
    DomainManager.quickSetup();
    break;
  default:
    console.log(`
🌐 Vercel 域名管理器

用法: 
  node scripts/domain-manager.js <命令> [参数]

命令:
  list                    - 列出所有域名别名
  set <源> <目标>         - 设置域名别名  
  remove <别名>           - 删除域名别名
  quick                   - 查看快速设置选项

示例:
  node scripts/domain-manager.js list
  node scripts/domain-manager.js set production my-crm.vercel.app
  node scripts/domain-manager.js remove old-domain.vercel.app
    `);
} 