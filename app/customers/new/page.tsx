'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { read, utils } from 'xlsx';

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

interface CustomerForm {
  name: string;
  region: string;
  country: string;
  mainIndustry: string; // 主营
  companyFeature: string; // 客户画像
  demandProducts: string;
  website: string;
  cardInfo: string; // 名片信息
  level: string;
  source: string;
  chemicalSegment: string; // 化工分属
  keywords: string; // 客户关键词
  contacts: Contact[];
  followUp: FollowUp;
}

const INIT: CustomerForm = {
  name: '',
  region: '',
  country: '',
  mainIndustry: '',
  companyFeature: '',
  demandProducts: '',
  website: '',
  cardInfo: '',
  level: '',
  source: '',
  chemicalSegment: '',
  keywords: '',
  contacts: [],
  followUp: { owner: '', progress: '', record: '', advice: '' },
};

export default function NewCustomerPage() {
  const [form, setForm] = useState<typeof INIT>(INIT);
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      else if (/区域/.test(key)) draft.region = value;
      else if (/国家/.test(key)) draft.country = value;
      else if (/主营/.test(key)) draft.mainIndustry = value;
      else if (/客户画像/.test(key)) draft.companyFeature = value;
      else if (/需求产品/.test(key)) draft.demandProducts = value;
      else if (/网址/.test(key)) draft.website = value;
      else if (/名片信息/.test(key)) draft.cardInfo = value.replace(/<<n>>/g, '\n');
      else if (/客户等级/.test(key)) draft.level = value;
      else if (/客户来源/.test(key)) draft.source = value;
      else if (/化工分属/.test(key)) draft.chemicalSegment = value;
      else if (/客户关键词/.test(key)) draft.keywords = value;

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

  async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const arrayBuffer = ev.target?.result as ArrayBuffer;
      if (!arrayBuffer) return;
      const wb = read(arrayBuffer, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[][] = utils.sheet_to_json(ws, { header: 1 });
      if (rows.length < 2) return;
      const headers = rows[0];

      // 若只有一条数据，沿用现有逻辑填表；多条则批量入库
      if (rows.length === 2) {
        const dataRow = rows[1];
        const pairs: string[] = [];
        headers.forEach((h: any, idx: number) => {
          const key = String(h || '').trim();
          let val = dataRow[idx];
          if (key && val !== undefined && val !== null) {
            let strVal = String(val);
            if (key === '名片信息') {
              // 保留换行
              strVal = strVal.replace(/\r?\n/g, '<<n>>');
            } else {
              strVal = strVal.replace(/\r?\n+/g, ' ').trim();
            }
            if (strVal.trim()) pairs.push(`${key}: ${strVal.trim()}`);
          }
        });
        const lines = pairs.join('\n');
        parseImport(lines);
        setShowImport(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // 多行批量导入
      let success = 0;
      setImporting(true);
      setProgress({ done: 0, total: rows.length - 1 });
      for (let i = 1; i < rows.length; i++) {
        const dataRow = rows[i];
        if (!dataRow || dataRow.every((cell: any) => cell === undefined || cell === null || String(cell).trim() === '')) continue;

        const draft = structuredClone(INIT) as typeof INIT;

        headers.forEach((h: any, idx: number) => {
          const key = String(h || '').trim();
          const valueRaw = dataRow[idx];
          if (valueRaw === undefined || valueRaw === null) return;
          const value = String(valueRaw).trim();

          if (/客户名称/.test(key)) draft.name = value;
          else if (/区域/.test(key)) draft.region = value;
          else if (/国家/.test(key)) draft.country = value;
          else if (/主营/.test(key)) draft.mainIndustry = value;
          else if (/客户画像/.test(key)) draft.companyFeature = value;
          else if (/需求产品/.test(key)) draft.demandProducts = value;
          else if (/网址/.test(key)) draft.website = value;
          else if (/名片信息/.test(key)) draft.cardInfo = value.replace(/\r?\n/g, '\n');
          else if (/客户等级/.test(key)) draft.level = value;
          else if (/客户来源/.test(key)) draft.source = value;
          else if (/化工分属/.test(key)) draft.chemicalSegment = value;
          else if (/客户关键词/.test(key)) draft.keywords = value;

          else if (/业务对接人/.test(key)) draft.followUp.owner = value;
          else if (/最新进度/.test(key)) draft.followUp.progress = value;
          else if (/跟进记录/.test(key)) draft.followUp.record = value;
          else if (/业务经理建议/.test(key)) draft.followUp.advice = value;
        });

        const { followUp, ...rest } = draft;
        const payload = { ...rest, followUps: [followUp] };

        try {
          await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          success++;
          setProgress((p) => ({ ...p, done: p.done + 1 }));
        } catch (err) {
          console.error('导入失败', err);
        }
      }

      alert(`成功导入 ${success} 条客户信息`);
      setImporting(false);
      router.push('/customers');
      // 期望模板为两列：键 / 值
      setShowImport(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsArrayBuffer(file);
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
      {importing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm space-y-4 shadow-xl">
            <h2 className="text-lg font-medium">正在批量导入 {progress.done}/{progress.total}</h2>
            <div className="w-full bg-gray-200 rounded overflow-hidden">
              <div
                className="bg-blue-600 h-3"
                style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-semibold mb-8 text-center">客户信息录入</h1>

      {/* 导入按钮 */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-lg space-y-4 shadow-xl">
            <h2 className="text-lg font-medium">粘贴信息并解析 / 上传 Excel 模板</h2>
            <textarea
              placeholder="每行格式：键: 值"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm h-40"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              onChange={handleFileImport}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
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
            <input placeholder="区域" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.region} onChange={(e) => onChange('region', e.target.value)} />
            <input placeholder="国家" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.country} onChange={(e) => onChange('country', e.target.value)} />
            <input placeholder="主营" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.mainIndustry} onChange={(e) => onChange('mainIndustry', e.target.value)} />
            <input placeholder="客户画像" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.companyFeature} onChange={(e) => onChange('companyFeature', e.target.value)} />
            <input placeholder="需求产品" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.demandProducts} onChange={(e) => onChange('demandProducts', e.target.value)} />
            <input placeholder="网址" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.website} onChange={(e) => onChange('website', e.target.value)} />
            <input placeholder="客户等级" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.level} onChange={(e) => onChange('level', e.target.value)} />
            <input placeholder="客户来源" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.source} onChange={(e) => onChange('source', e.target.value)} />
            <input placeholder="化工分属" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.chemicalSegment} onChange={(e) => onChange('chemicalSegment', e.target.value)} />
            <input placeholder="客户关键词" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.keywords} onChange={(e) => onChange('keywords', e.target.value)} />
          </div>
        </section>

        {/* 联系信息 - 名片信息 */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">名片信息</h2>
          <textarea
            placeholder="粘贴名片信息文本"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm h-32"
            value={form.cardInfo}
            onChange={(e) => onChange('cardInfo', e.target.value)}
          />
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