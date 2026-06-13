import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'kohiro_profile_config';


export const AdminEditor = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState({
    nameJa: '小松﨑 博人',
    title: '20代の駆け出し大家',
    subtitle: '一都三県・名古屋エリア中心に収益不動産へ投資しています',
    colorLeft: '#2b7465',
    colorRight: '#629b86',
    // New fields
    holdingName: '愛知県名古屋市中村区 木造アパート',
    holdingMeta: '1R×5戸 / 築9年',
    reqUse: '一棟アパート (1LDK以上◎ / 1K1R○)',
    reqStructure: '木造、軽量鉄骨',
    reqAge: '10年以内 (オリックス想定)',
    reqPrice: '5,000万円以内',
    reqYield: '7%以上',
    reqArea: '一都三県・名古屋中心',
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse config');
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'hiroto2026') {
      setIsLoggedIn(true);
    } else {
      alert('パスワードが違います');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    alert('保存しました！トップページに反映されています。');
  };

  const handleReset = () => {
    if (confirm('すべての変更をリセットして初期状態に戻しますか？')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  };

  const copyConfig = () => {
    const code = `
export const PROFILE_OVERRIDE = ${JSON.stringify({
      nameJa: config.nameJa,
      title: config.title,
      subtitle: config.subtitle
    }, null, 2)};

export const PROPERTY_OVERRIDE = ${JSON.stringify({
      holdingName: config.holdingName,
      holdingMeta: config.holdingMeta,
      reqUse: config.reqUse,
      reqStructure: config.reqStructure,
      reqAge: config.reqAge,
      reqPrice: config.reqPrice,
      reqYield: config.reqYield,
      reqArea: config.reqArea,
    }, null, 2)};

export const THEME_OVERRIDE = ${JSON.stringify({
      colorLeft: config.colorLeft,
      colorRight: config.colorRight
    }, null, 2)};
    `;
    navigator.clipboard.writeText(code);
    alert('設定コードをコピーしました！このコードをAIに渡すと永久保存できます。');
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="glass-panel">
          <h1>Admin Studio Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit">Unlock</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="glass-panel wide">
        <div className="header-row">
          <h1>Admin Studio</h1>
          <div className="actions">
            <button onClick={handleSave} className="primary">Save Changes</button>
            <button onClick={handleReset} className="danger">Reset All</button>
          </div>
        </div>

        <div className="editor-grid">
          <section>
            <h3>Profile & Theme</h3>
            <div className="field">
              <label>Name (Ja)</label>
              <input name="nameJa" value={config.nameJa} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Title / Badge</label>
              <input name="title" value={config.title} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Bio / Subtitle</label>
              <textarea name="subtitle" value={config.subtitle} onChange={handleChange} rows={2} />
            </div>
            <div className="field color">
              <label>Theme Colors (Left / Right)</label>
              <div className="color-picker-row">
                <input type="color" name="colorLeft" value={config.colorLeft} onChange={handleChange} />
                <input type="color" name="colorRight" value={config.colorRight} onChange={handleChange} />
              </div>
            </div>
          </section>

          <section>
            <h3>保有物件情報</h3>
            <div className="field">
              <label>物件名</label>
              <input name="holdingName" value={config.holdingName} onChange={handleChange} />
            </div>
            <div className="field">
              <label>諸元 (戸数/築年など)</label>
              <input name="holdingMeta" value={config.holdingMeta} onChange={handleChange} />
            </div>

            <h3 style={{ marginTop: '20px' }}>物件条件</h3>
            <div className="req-flex">
              <div className="field small">
                <label>用途</label>
                <input name="reqUse" value={config.reqUse} onChange={handleChange} />
              </div>
              <div className="field small">
                <label>構造</label>
                <input name="reqStructure" value={config.reqStructure} onChange={handleChange} />
              </div>
            </div>
            <div className="req-flex">
              <div className="field small">
                <label>築年</label>
                <input name="reqAge" value={config.reqAge} onChange={handleChange} />
              </div>
              <div className="field small">
                <label>価格</label>
                <input name="reqPrice" value={config.reqPrice} onChange={handleChange} />
              </div>
            </div>
            <div className="req-flex">
              <div className="field small">
                <label>利回り</label>
                <input name="reqYield" value={config.reqYield} onChange={handleChange} />
              </div>
              <div className="field small">
                <label>地域</label>
                <input name="reqArea" value={config.reqArea} onChange={handleChange} />
              </div>
            </div>
          </section>
        </div>

        <div className="footer-actions">
          <button onClick={copyConfig} className="secondary">Copy Config Code for AI</button>
          <a href="/" className="back-link">Back to Website</a>
        </div>
      </div>

      <style>{`
        .req-flex { display: flex; gap: 10px; }
        .req-flex .field { flex: 1; }
        .small input { padding: 12px 16px !important; font-size: 14px !important; }
      `}</style>
    </div>
  );
};
