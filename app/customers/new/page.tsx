'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Contact {
  name: string;
  position: string;
  phone: string;
}

interface FollowUp {
  owner: string;
  progress: string;
  record: string;
  advice: string;
}

const INIT = {
  name: '',
  region: '',
  country: '',
  level: '',
  source: '',
  companyFeature: '',
  mainIndustry: '',
  relatedBusiness: '',
  demandProducts: '',
  contacts: [{ name: '', position: '', phone: '' } as Contact],
  followUp: { owner: '', progress: '', record: '', advice: '' } as FollowUp,
};

export default function NewCustomerPage() {
  const [form, setForm] = useState<typeof INIT>(INIT);
  const router = useRouter();
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  function onChange(field: string, value: any) {
    setForm({ ...form, [field]: value });
  }

  function parseImport(text: string) {
    if (!text.trim()) return;

    const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);

    const draft = structuredClone(form) as typeof form; // deep clone

    // 收集联系人组
    type Group = { name?: string; position?: string; phones: string[] };
    const groups: Group[] = [];
    let current: Group | null = null;

    lines.forEach((line) => {
      const [rawKey, ...rest] = line.split(/[:：]/);
      if (!rawKey || rest.length === 0) return;
      const key = rawKey.trim();
      const value = rest.join(':').trim();

      if (/客户名称/.test(key)) draft.name = value;
      else if (/客户区域/.test(key)) draft.region = value;
      else if (/客户国家/.test(key)) draft.country = value;
      else if (/客户等级/.test(key)) draft.level = value;
      else if (/客户来源/.test(key)) draft.source = value;
      else if (/公司特点/.test(key)) draft.companyFeature = value;
      else if (/主营行业/.test(key)) draft.mainIndustry = value;
      else if (/相关业务/.test(key)) draft.relatedBusiness = value;
      else if (/需求产品/.test(key)) draft.demandProducts = value;

      else if (/联系人/.test(key)) {
        // 开启新组
        if (current) groups.push(current);
        current = { name: value.trim(), position: '', phones: [] };
      }
      else if (/职位/.test(key)) {
        if (!current) current = { phones: [] } as Group;
        current.position = value.trim();
      }
      else if (/联系方式|电话/.test(key)) {
        if (!current) current = { phones: [] } as Group;
        current.phones.push(...value.split(/[，,、;；\s]+/).filter(Boolean));
      }

      else if (/业务对接人/.test(key)) draft.followUp.owner = value;
      else if (/最新进度/.test(key)) draft.followUp.progress = value;
      else if (/跟进记录/.test(key)) draft.followUp.record = value;
      else if (/业务经理建议/.test(key)) draft.followUp.advice = value;
    });

    // push last group
    if (current) groups.push(current);

    if (groups.length > 0) {
      const contacts: Contact[] = [];
      groups.forEach((g) => {
        if (g.phones.length === 0) {
          contacts.push({ name: g.name || '', position: g.position || '', phone: '' });
        } else {
          g.phones.forEach((ph) => {
            contacts.push({ name: g.name || '', position: g.position || '', phone: ph });
          });
        }
      });
      draft.contacts = contacts;
    }

    setForm(draft);
  }

  function handleParse() {
    parseImport(importText);
    setShowImport(false);
    setImportText('');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { followUp, ...rest } = form;
    const payload = { ...rest, followUps: [followUp] };

    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    router.push('/customers?keyword=' + form.name);
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-8 text-center">客户信息录入</h1>

      {/* 导入按钮 */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-lg space-y-4 shadow-xl">
            <h2 className="text-lg font-medium">粘贴信息并解析</h2>
            <textarea
              placeholder="每行格式：键: 值"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm h-40"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <div className="flex justify-end gap-4 text-sm">
              <button onClick={() => setShowImport(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">取消</button>
              <button onClick={handleParse} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">解析并填入</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 text-right">
        <button type="button" onClick={() => setShowImport(true)} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm">
          一键导入
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-10">
        {/* 个人信息 */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">个人信息</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input required placeholder="客户名称*" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.name} onChange={(e) => onChange('name', e.target.value)} />
            <input placeholder="客户区域" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.region} onChange={(e) => onChange('region', e.target.value)} />
            <input placeholder="客户国家" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.country} onChange={(e) => onChange('country', e.target.value)} />
            <input placeholder="客户等级" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.level} onChange={(e) => onChange('level', e.target.value)} />
            <input placeholder="客户来源" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.source} onChange={(e) => onChange('source', e.target.value)} />
            <input placeholder="公司特点" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.companyFeature} onChange={(e) => onChange('companyFeature', e.target.value)} />
            <input placeholder="主营行业" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.mainIndustry} onChange={(e) => onChange('mainIndustry', e.target.value)} />
            <input placeholder="相关业务" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.relatedBusiness} onChange={(e) => onChange('relatedBusiness', e.target.value)} />
            <input placeholder="需求产品" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm col-span-full" value={form.demandProducts} onChange={(e) => onChange('demandProducts', e.target.value)} />
          </div>
        </section>

        {/* 联系信息 */}
        <section className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">联系信息</h2>
            <button
              type="button"
              onClick={() => setForm({ ...form, contacts: [...form.contacts, { name: '', position: '', phone: '' }] })}
              className="text-sm text-blue-600 hover:underline"
            >
              + 添加联系人
            </button>
          </div>
          {form.contacts.map((c, idx) => (
            <div key={idx} className="grid sm:grid-cols-4 gap-4 mb-4">
              <input placeholder="联系人" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={c.name} onChange={(e) => {
                const contacts = [...form.contacts];
                contacts[idx].name = e.target.value;
                setForm({ ...form, contacts });
              }} />
              <input placeholder="职位" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={c.position} onChange={(e) => {
                const contacts = [...form.contacts];
                contacts[idx].position = e.target.value;
                setForm({ ...form, contacts });
              }} />
              <input placeholder="联系方式" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={c.phone} onChange={(e) => {
                const contacts = [...form.contacts];
                contacts[idx].phone = e.target.value;
                setForm({ ...form, contacts });
              }} />
            </div>
          ))}
        </section>

        {/* 跟进进度 */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">跟进进度</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="业务对接人" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.followUp.owner} onChange={(e) => setForm({ ...form, followUp: { ...form.followUp, owner: e.target.value } })} />
            <input placeholder="最新进度" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.followUp.progress} onChange={(e) => setForm({ ...form, followUp: { ...form.followUp, progress: e.target.value } })} />
            <input placeholder="业务经理建议" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.followUp.advice} onChange={(e) => setForm({ ...form, followUp: { ...form.followUp, advice: e.target.value } })} />
            <textarea placeholder="跟进记录" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm col-span-full h-24" value={form.followUp.record} onChange={(e) => setForm({ ...form, followUp: { ...form.followUp, record: e.target.value } })} />
          </div>
        </section>

        <div className="text-center">
          <button type="submit" className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 shadow">
            保存
          </button>
        </div>
      </form>
    </main>
  );
} 