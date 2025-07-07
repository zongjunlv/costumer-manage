'use client';

import { useState } from 'react';

interface Contact {
  name?: string | null;
  position?: string | null;
  phone?: string | null;
}

interface FollowUp {
  owner?: string | null;
  progress?: string | null;
  record?: string | null;
  advice?: string | null;
  createdAt?: string | Date;
}

interface Customer {
  name: string;
  region?: string | null;
  country?: string | null;
  level?: string | null;
  source?: string | null;
  companyFeature?: string | null;
  mainIndustry?: string | null;
  relatedBusiness?: string | null;
  demandProducts?: string | null;
  contacts: Contact[];
  followUps: FollowUp[];
}

export default function ExportButton({ customer }: { customer: Customer }) {
  const [copied, setCopied] = useState(false);

  function buildText() {
    const firstContact = customer.contacts[0] || {};
    const latestFollow = customer.followUps[0] || {};

    const lines: string[] = [];

    const headerPairs: [string, string | undefined | null][] = [
      ['客户名称', customer.name],
      ['客户区域', customer.region],
      ['客户国家', customer.country],
      ['客户等级', customer.level],
      ['客户来源', customer.source],
      ['公司特点', customer.companyFeature],
      ['主营行业', customer.mainIndustry],
      ['相关业务', customer.relatedBusiness],
      ['需求产品', customer.demandProducts],
    ];

    headerPairs.forEach(([k, v]) => lines.push(`${k}: ${v ?? ''}`));

    // 输出所有联系人
    customer.contacts.forEach((c) => {
      lines.push(`联系人: ${c.name ?? ''}`);
      lines.push(`职位: ${c.position ?? ''}`);
      lines.push(`联系方式: ${c.phone ?? ''}`);
    });

    // 跟进信息仅取最新一条
    lines.push(`业务对接人: ${latestFollow.owner ?? ''}`);
    lines.push(`最新进度: ${latestFollow.progress ?? ''}`);
    lines.push(`跟进记录: ${latestFollow.record ?? ''}`);
    lines.push(`业务经理建议: ${latestFollow.advice ?? ''}`);

    return lines.join('\n');
  }

  async function handleExport() {
    const text = buildText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert('复制失败，已输出到控制台');
      console.log(text);
    }
  }

  return (
    <button
      onClick={handleExport}
      className="px-3 py-1 rounded bg-gray-700 text-white text-sm hover:bg-gray-600"
    >
      {copied ? '已复制' : '一键导出'}
    </button>
  );
} 