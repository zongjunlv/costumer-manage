const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('开始种子数据...')

  // 清理现有数据（按依赖关系倒序删除）
  console.log('清理现有数据...')
  await prisma.followUp.deleteMany({})
  await prisma.contact.deleteMany({})
  await prisma.customer.deleteMany({})
  console.log('现有数据已清理')

  // 创建示例客户
  const customer1 = await prisma.customer.create({
    data: {
      name: '北京科技有限公司',
      region: '华北',
      country: '中国',
      level: 'A级',
      source: '展会',
      companyFeature: '高新技术企业',
      mainIndustry: '软件开发',
      relatedBusiness: '企业信息化',
      demandProducts: '定制软件开发',
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: '上海贸易公司',
      region: '华东',
      country: '中国',
      level: 'B级',
      source: '网络推广',
      companyFeature: '进出口贸易',
      mainIndustry: '国际贸易',
      relatedBusiness: '进出口代理',
      demandProducts: '贸易管理系统',
    },
  })

  const customer3 = await prisma.customer.create({
    data: {
      name: '深圳制造企业',
      region: '华南',
      country: '中国',
      level: 'A级',
      source: '客户推荐',
      companyFeature: '制造业',
      mainIndustry: '电子制造',
      relatedBusiness: '智能硬件',
      demandProducts: 'ERP系统',
    },
  })

  // 创建联系人
  await prisma.contact.create({
    data: {
      customerId: customer1.id,
      name: '张经理',
      position: '技术总监',
      phone: '13800138001',
      owner: '王销售',
    },
  })

  await prisma.contact.create({
    data: {
      customerId: customer1.id,
      name: '李主管',
      position: '项目经理',
      phone: '13800138002',
      owner: '王销售',
    },
  })

  await prisma.contact.create({
    data: {
      customerId: customer2.id,
      name: '陈总',
      position: 'CEO',
      phone: '13800138003',
      owner: '刘销售',
    },
  })

  await prisma.contact.create({
    data: {
      customerId: customer3.id,
      name: '赵工',
      position: 'CTO',
      phone: '13800138004',
      owner: '赵销售',
    },
  })

  // 创建跟进记录
  await prisma.followUp.create({
    data: {
      customerId: customer1.id,
      owner: '王销售',
      progress: '需求确认',
      record: '客户对定制软件开发有明确需求，预算充足，已发送初步方案。',
      advice: '下周安排技术人员进行详细需求调研。',
    },
  })

  await prisma.followUp.create({
    data: {
      customerId: customer2.id,
      owner: '刘销售',
      progress: '方案讨论',
      record: '已提交贸易管理系统方案，客户正在内部评估。',
      advice: '等待客户反馈，保持定期联系。',
    },
  })

  await prisma.followUp.create({
    data: {
      customerId: customer3.id,
      owner: '赵销售',
      progress: '合同谈判',
      record: 'ERP系统方案已通过，正在讨论合同细节和实施计划。',
      advice: '加快合同签署进度，安排项目启动会议。',
    },
  })

  console.log('种子数据添加完成！')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 