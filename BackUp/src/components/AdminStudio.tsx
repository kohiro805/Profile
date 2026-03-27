import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'kohiro_profile_config_v1';

export const AdminStudio = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<any>({
    nameJa: '小松﨑 博人',
    title: '',
    subtitle: '',
    customSections: []
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('site_config').select('value').eq('key', 'global_config').single();
      if (data?.value) {
        setConfig(data.value);
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setConfig(JSON.parse(saved));
      }
    };
    fetchConfig();

    const handleTrigger = () => {
        const pass = prompt('Admin Studio パスワードを入力してください:');
        if (pass === '6297') {
            setIsOpen(true);
        } else if (pass !== null) {
            alert('パスワードが違います');
        }
    };
    
    const dotTrigger = document.getElementById('open-studio-trigger');
    if (dotTrigger) dotTrigger.addEventListener('click', handleTrigger);
    return () => {
        if (dotTrigger) dotTrigger.removeEventListener('click', handleTrigger);
    };
  }, []);

  const handleSave = async () => {
    const { error } = await supabase
      .from('site_config')
      .upsert({ 
        key: 'global_config', 
        value: config,
        updated_at: new Date()
      }, { onConflict: 'key' });

    if (error) {
      alert('保存エラー: ' + error.message);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      alert('保存しました！');
      window.dispatchEvent(new CustomEvent('profile-config-updated'));
      setIsOpen(false);
    }
  };

  const addSection = () => {
    const newSections = [...(config.customSections || []), { title: '', content: '' }];
    setConfig({ ...config, customSections: newSections });
  };

  const removeSection = (idx: number) => {
    if(!confirm('この枠を削除してもよろしいですか？')) return;
    const newSections = config.customSections.filter((_: any, i: number) => i !== idx);
    setConfig({ ...config, customSections: newSections });
  };

  const updateSection = (idx: number, field: string, value: string) => {
    const newSections = config.customSections.map((sec: any, i: number) => (
      i === idx ? { ...sec, [field]: value } : sec
    ));
    setConfig({ ...config, customSections: newSections });
  };

  if (!isOpen) return null;

  return (
    <div className="admin-studio-layer fixed inset-0 z-[10000] bg-[rgba(255,255,255,0.7)] backdrop-blur-[30px] flex sm:items-center items-start justify-center p-0 sm:p-5 overflow-hidden">
      <div className="admin-panel bg-white border border-gray-100 w-full max-w-[720px] sm:h-[90vh] h-full sm:rounded-[32px] rounded-none flex flex-col overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)]">
        <div className="admin-content-scroller flex-1 overflow-y-auto sm:p-10 p-6 pt-0 flex flex-col gap-10 text-left">
          <div className="admin-header border-b border-gray-100 flex justify-between items-center bg-gray-50/30 -mx-6 sm:-mx-10 p-6 pt-[calc(24px+env(safe-area-inset-top,0px))] sm:pt-[32px] sm:p-[32px_40px] mb-4">
            <div>
              <h3 className="studio-title font-heading text-[16px] tracking-[0.3em] mb-1 text-gray-950">ADMIN STUDIO</h3>
              <p className="studio-subtitle text-[9px] tracking-[0.15em] text-[var(--c-primary)] font-extrabold uppercase">MANAGE ALL SECTIONS</p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSave} className="bg-[var(--c-primary)] text-white px-6 py-3 rounded-xl font-black text-[11px] tracking-wider hover:opacity-90 transition-opacity">SAVE CHANGES</button>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 text-[#666] flex items-center justify-center hover:bg-gray-200 hover:text-black">&times;</button>
            </div>
          </div>
          <section className="flex flex-col gap-6">
            <h4 className="font-heading text-[10px] text-[var(--c-primary)] tracking-[0.3em] font-extrabold uppercase mb-2">IDENTITIES</h4>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">お名前 (JA)</label>
                <input className="st-input" value={config.nameJa || ''} onChange={(e) => setConfig({...config, nameJa: e.target.value})} />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">肩書き</label>
                <input className="st-input" value={config.title || ''} onChange={(e) => setConfig({...config, title: e.target.value})} />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">キャッチコピー</label>
                <textarea className="st-area" rows={2} value={config.subtitle || ''} onChange={(e) => setConfig({...config, subtitle: e.target.value})} />
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h4 className="font-heading text-[10px] text-[var(--c-primary)] tracking-[0.3em] font-extrabold uppercase mb-2">PAGE SECTIONS</h4>
            {(config.customSections || []).map((sec: any, idx: number) => (
                <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 relative group">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-[var(--c-primary)] bg-[rgba(3,66,57,0.08)] px-2 py-1 rounded">SECTION {String(idx + 1).padStart(2, '0')}</span>
                        <button onClick={() => removeSection(idx)} className="text-red-500 text-[11px] hover:underline opacity-50 group-hover:opacity-100 transition-opacity">DELETE</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <input 
                            className="st-input font-bold bg-white border-gray-200 text-gray-950" 
                            placeholder="タイトル (例: 保有物件)" 
                            value={sec.title} 
                            onChange={(e) => updateSection(idx, 'title', e.target.value)} 
                        />
                        <textarea 
                            className="st-area bg-white border-gray-200 text-gray-950" 
                            placeholder="内容 (自由記述)" 
                            rows={4} 
                            value={sec.content} 
                            onChange={(e) => updateSection(idx, 'content', e.target.value)} 
                        />
                    </div>
                </div>
            ))}
            <button onClick={addSection} className="w-full h-[60px] border-2 border-dashed border-gray-200 rounded-2xl text-[var(--c-primary)] hover:border-[var(--c-primary)] hover:text-[var(--c-primary)] transition-colors text-[11px] font-black tracking-widest">+ ADD NEW SECTION</button>
          </section>
        </div>
      </div>
    </div>
  );
};
