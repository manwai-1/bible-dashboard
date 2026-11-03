import React, { useState, useEffect, useMemo } from 'react';
import { 
  Church, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Sparkles, 
  Eraser, 
  RotateCcw, 
  ChevronRight, 
  Plus, 
  Trash2, 
  FolderHeart 
} from 'lucide-react';

// 66 卷書分類與章數設定
const BIBLE_STRUCTURE = [
  {
    category: "律法書 (摩西五經)",
    statType: "law",
    subStatType: "history",
    books: [
      { name: "創世記", chapters: 50 },
      { name: "出埃及記", chapters: 40 },
      { name: "利未記", chapters: 27 },
      { name: "民數記", chapters: 36 },
      { name: "申命記", chapters: 34 }
    ]
  },
  {
    category: "舊約歷史書",
    statType: "history",
    subStatType: "god",
    books: [
      { name: "約書亞記", chapters: 24 },
      { name: "士師記", chapters: 21 },
      { name: "路得記", chapters: 4 },
      { name: "撒母耳記上", chapters: 31 },
      { name: "撒母耳記下", chapters: 24 },
      { name: "列王紀上", chapters: 22 },
      { name: "列王紀下", chapters: 25 },
      { name: "歷代志上", chapters: 29 },
      { name: "歷代志下", chapters: 36 },
      { name: "以斯拉記", chapters: 10 },
      { name: "尼希米記", chapters: 13 },
      { name: "以斯帖記", chapters: 10 }
    ]
  },
  {
    category: "詩歌智慧書",
    statType: "life",
    subStatType: "god",
    books: [
      { name: "約伯記", chapters: 42 },
      { name: "詩篇", chapters: 150 },
      { name: "箴言", chapters: 31 },
      { name: "傳道書", chapters: 12 },
      { name: "雅歌", chapters: 8 }
    ]
  },
  {
    category: "大先知書",
    statType: "god",
    subStatType: "law",
    books: [
      { name: "以賽亞書", chapters: 66 },
      { name: "耶利米書", chapters: 52 },
      { name: "耶利米哀歌", chapters: 5 },
      { name: "以西結書", chapters: 48 },
      { name: "但以理書", chapters: 12 }
    ]
  },
  {
    category: "小先知書",
    statType: "god",
    subStatType: "history",
    books: [
      { name: "何西阿書", chapters: 14 },
      { name: "約珥書", chapters: 3 },
      { name: "阿摩司書", chapters: 9 },
      { name: "俄巴底亞書", chapters: 1 },
      { name: "約拿書", chapters: 4 },
      { name: "彌迦書", chapters: 7 },
      { name: "那鴻書", chapters: 3 },
      { name: "哈巴谷書", chapters: 3 },
      { name: "西番雅書", chapters: 3 },
      { name: "哈該書", chapters: 2 },
      { name: "撒迦利亞書", chapters: 14 },
      { name: "瑪拉基書", chapters: 4 }
    ]
  },
  {
    category: "四福音書",
    statType: "grace",
    subStatType: "life",
    books: [
      { name: "馬太福音", chapters: 28 },
      { name: "馬可福音", chapters: 16 },
      { name: "路加福音", chapters: 24 },
      { name: "約翰福音", chapters: 21 }
    ]
  },
  {
    category: "新約歷史書",
    statType: "history",
    subStatType: "grace",
    books: [
      { name: "使徒行傳", chapters: 28 }
    ]
  },
  {
    category: "保羅書信",
    statType: "grace",
    subStatType: "law",
    books: [
      { name: "羅馬書", chapters: 16 },
      { name: "哥林多前書", chapters: 16 },
      { name: "哥林多後書", chapters: 13 },
      { name: "加拉太書", chapters: 6 },
      { name: "以弗所書", chapters: 6 },
      { name: "腓立比書", chapters: 4 },
      { name: "歌羅西書", chapters: 4 },
      { name: "帖撒羅尼迦前書", chapters: 5 },
      { name: "帖撒羅尼迦後書", chapters: 3 },
      { name: "提摩太前書", chapters: 6 },
      { name: "提摩太後書", chapters: 4 },
      { name: "提多書", chapters: 3 },
      { name: "腓利門書", chapters: 1 }
    ]
  },
  {
    category: "普通書信",
    statType: "life",
    subStatType: "grace",
    books: [
      { name: "希伯來書", chapters: 13 },
      { name: "雅各書", chapters: 5 },
      { name: "彼得前書", chapters: 5 },
      { name: "彼得後書", chapters: 3 },
      { name: "約翰一書", chapters: 5 },
      { name: "約翰二書", chapters: 1 },
      { name: "約翰三書", chapters: 1 },
      { name: "猶大書", chapters: 1 }
    ]
  },
  {
    category: "新約預言書",
    statType: "god",
    subStatType: "life",
    books: [
      { name: "啟示錄", chapters: 22 }
    ]
  }
];

// 學習標籤顏色與圖示
const ACTIVITIES = {
  devotional: { id: 'devotional', label: '靈修讀經', color: '#38bdf8', icon: Sparkles },
  worship: { id: 'worship', label: '主日崇拜', color: '#ffd350', icon: Church },
  theology: { id: 'theology', label: '神學課程', color: '#9b3bf4', icon: GraduationCap },
  fellowship: { id: 'fellowship', label: '團契查經', color: '#16f916', icon: Users },
  personal: { id: 'personal', label: '個人研經', color: '#f8fafc', icon: BookOpen },
  eraser: { id: 'eraser', label: '橡皮擦', color: '#ef4444', icon: Eraser }
};

// 五圍屬性
const STAT_INFO = {
  history: { label: "歷史", color: "#f59e0b" },
  law: { label: "律法", color: "#10b981" },
  grace: { label: "恩典", color: "#ec4899" },
  life: { label: "生命", color: "#06b6d4" },
  god: { label: "上帝", color: "#8b5cf6" }
};

export default function App() {
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('bible_dashboard_profiles');
      return saved ? JSON.parse(saved) : [{ id: 'default', name: '預設存檔' }];
    } catch {
      return [{ id: 'default', name: '預設存檔' }];
    }
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    try {
      return localStorage.getItem('bible_dashboard_active_id') || 'default';
    } catch {
      return 'default';
    }
  });

  const [allData, setAllData] = useState(() => {
    try {
      const saved = localStorage.getItem('bible_dashboard_data');
      return saved ? JSON.parse(saved) : { default: {} };
    } catch {
      return { default: {} };
    }
  });

  const [selectedTool, setSelectedTool] = useState('devotional');
  const [selectedMonth, setSelectedMonth] = useState('全年');
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // 存檔至 LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('bible_dashboard_profiles', JSON.stringify(profiles));
      localStorage.setItem('bible_dashboard_active_id', activeProfileId);
      localStorage.setItem('bible_dashboard_data', JSON.stringify(allData));
    } catch (e) {
      console.error(e);
    }
  }, [profiles, activeProfileId, allData]);

  const currentRecords = allData[activeProfileId] || {};

  // 計算章節範圍標籤
  const getChapterRangeLabel = (totalChapters, blockIndex, totalBlocks) => {
    if (totalChapters < 5) return `${blockIndex + 1}`;
    const base = Math.floor(totalChapters / totalBlocks);
    const remainder = totalChapters % totalBlocks;
    let start = 1;
    for (let i = 0; i < blockIndex; i++) {
      start += base + (i < remainder ? 1 : 0);
    }
    const count = base + (blockIndex < remainder ? 1 : 0);
    const end = start + count - 1;
    return start === end ? `${start}` : `${start}-${end}`;
  };

  // 點擊方塊互動
  const handleBlockClick = (bookName, blockIndex) => {
    const key = `${bookName}_${blockIndex}`;
    const cellData = currentRecords[key] || { layers: [] };
    let newLayers = [...cellData.layers];

    if (selectedTool === 'eraser') {
      if (newLayers.length === 0) return;
      const updated = { ...currentRecords };
      delete updated[key];
      setAllData({ ...allData, [activeProfileId]: updated });
      return;
    }

    const existingIndex = newLayers.findIndex(l => l.type === selectedTool);
    if (existingIndex >= 0) {
      newLayers[existingIndex] = {
        ...newLayers[existingIndex],
        count: newLayers[existingIndex].count + 1,
        month: selectedMonth
      };
    } else {
      newLayers.push({ type: selectedTool, count: 1, month: selectedMonth });
    }

    setAllData({
      ...allData,
      [activeProfileId]: {
        ...currentRecords,
        [key]: { layers: newLayers }
      }
    });
  };

  // 五圍能力值計算
  const stats = useMemo(() => {
    const counts = { history: 0, law: 0, grace: 0, life: 0, god: 0 };
    BIBLE_STRUCTURE.forEach(cat => {
      cat.books.forEach(book => {
        const totalBlocks = Math.min(book.chapters, 5);
        for (let i = 0; i < totalBlocks; i++) {
          const key = `${book.name}_${i}`;
          const cell = currentRecords[key];
          if (cell && cell.layers && cell.layers.length > 0) {
            const studyWeight = cell.layers.reduce((sum, l) => sum + l.count, 0);
            counts[cat.statType] += studyWeight * 2;
            counts[cat.subStatType] += studyWeight * 1;
          }
        }
      });
    });
    return counts;
  }, [currentRecords]);

  const lightValue = useMemo(() => {
    return Object.values(stats).reduce((a, b) => a + b, 0);
  }, [stats]);

  // 角色稱號判定
  const characterTitle = useMemo(() => {
    if (lightValue === 0) return { title: "初信尋道者", desc: "剛展開旅程，等待神的微光引導" };
    if (stats.law >= 30 && stats.history >= 20) return { title: "西奈山的摩西", desc: "在真理律例與救贖歷史中敬虔前行" };
    if (stats.grace >= 30 && stats.life >= 20) return { title: "外邦使徒保羅", desc: "體會恩典的浩大，將福音化作生命" };
    if (stats.god >= 35) return { title: "烈火先知以利亞", desc: "專心瞻仰神的聖潔威嚴與榮耀" };
    if (stats.life >= 30) return { title: "琴弦牧童大衛", desc: "在日常與詩歌中譜出敬拜生命" };
    if (lightValue >= 100) return { title: "天國精兵", desc: "博覽全卷聖經，靈命扎實純熟" };
    return { title: "蒙恩奔跑者", desc: "神的話語是腳前的燈、路上的光" };
  }, [stats, lightValue]);

  // 繪製雷達圖多邊形
  const radarPoints = useMemo(() => {
    const keys = ["history", "law", "grace", "life", "god"];
    const maxVal = Math.max(50, ...Object.values(stats));
    const center = 110;
    const radius = 75;

    return keys.map((k, i) => {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const ratio = Math.min(1, stats[k] / maxVal);
      const r = Math.max(8, ratio * radius);
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }, [stats]);

  // 新增存檔
  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    const newId = `profile_${Date.now()}`;
    const newProfile = { id: newId, name: newProfileName.trim() };
    setProfiles([...profiles, newProfile]);
    setActiveProfileId(newId);
    setNewProfileName('');
    setShowAddProfileModal(false);
  };

  // 刪除存檔
  const handleDeleteCurrentProfile = () => {
    if (profiles.length <= 1) return;
    setConfirmModal({
      isOpen: true,
      title: '確認刪除存檔',
      message: `確定要刪除「${profiles.find(p => p.id === activeProfileId)?.name}」嗎？此操作無法還原。`,
      onConfirm: () => {
        const remaining = profiles.filter(p => p.id !== activeProfileId);
        const nextId = remaining[0].id;
        const updatedData = { ...allData };
        delete updatedData[activeProfileId];
        setProfiles(remaining);
        setActiveProfileId(nextId);
        setAllData(updatedData);
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  // 清空當前紀錄
  const handleResetCurrent = () => {
    setConfirmModal({
      isOpen: true,
      title: '重置此存檔進度',
      message: '確定要將目前存檔的所有方塊重置嗎？',
      onConfirm: () => {
        setAllData({ ...allData, [activeProfileId]: {} });
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 pb-24 select-none">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 頂部存檔管理列 */}
        <header className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <FolderHeart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">聖經學習儀表板</h1>
              <p className="text-xs text-slate-400">追蹤 66 卷書卷進度與屬靈成長五圍數值</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeProfileId}
              onChange={(e) => setActiveProfileId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowAddProfileModal(true)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-2 rounded-xl transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>新增</span>
            </button>

            {profiles.length > 1 && (
              <button
                onClick={handleDeleteCurrentProfile}
                title="刪除當前存檔"
                className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl transition border border-slate-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* RPG 角色五圍雷達圖面板 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex flex-col justify-center space-y-3">
            <div className="inline-block bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-400 uppercase tracking-widest w-fit">
              RPG 屬靈稱號
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
              {characterTitle.title}
            </div>
            <p className="text-sm text-slate-400">{characterTitle.desc}</p>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-xs text-slate-400">綜合亮光值:</span>
              <span className="text-3xl font-black text-amber-400 tracking-tight">{lightValue}</span>
              <span className="text-xs text-slate-500">點</span>
            </div>
          </div>

          {/* SVG 雷達圖 */}
          <div className="flex items-center justify-center">
            <div className="relative w-56 h-56">
              <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
                  <polygon
                    key={idx}
                    points={["history", "law", "grace", "life", "god"].map((_, i) => {
                      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                      const r = 75 * scale;
                      return `${110 + r * Math.cos(angle)},${110 + r * Math.sin(angle)}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray={idx < 3 ? "2 2" : "none"}
                  />
                ))}
                <polygon
                  points={radarPoints}
                  fill="rgba(56, 189, 248, 0.25)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />
                {["歷史", "律法", "恩典", "生命", "上帝"].map((name, i) => {
                  const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                  const x = 110 + 92 * Math.cos(angle);
                  const y = 110 + 92 * Math.sin(angle) + 4;
                  return (
                    <text
                      key={name}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-slate-300"
                    >
                      {name}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* 五圍數值清單 */}
          <div className="flex flex-col justify-center space-y-2">
            {Object.entries(STAT_INFO).map(([key, info]) => (
              <div key={key} className="flex items-center justify-between bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80 text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }}></span>
                  <span className="text-slate-300 font-medium">{info.label}</span>
                </span>
                <span className="font-bold text-slate-100">{stats[key]} 點</span>
              </div>
            ))}
          </div>
        </div>

        {/* 釘選調色盤與控制工具 */}
        <div className="sticky top-3 z-30 bg-slate-900/95 border border-slate-800 p-3 rounded-2xl shadow-2xl backdrop-blur-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {Object.values(ACTIVITIES).map(act => {
                const IconComponent = act.icon;
                const isSelected = selectedTool === act.id;
                return (
                  <button
                    key={act.id}
                    onClick={() => setSelectedTool(act.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 text-white shadow-lg' 
                        : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${act.color}25` : 'transparent',
                      borderColor: isSelected ? act.color : undefined
                    }}
                  >
                    <IconComponent className="w-3.5 h-3.5" style={{ color: act.color }} />
                    <span style={{ color: isSelected ? act.color : undefined }}>{act.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">月份:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 outline-none focus:border-blue-500"
              >
                <option value="全年">全年</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={`${i+1}月`}>{i+1}月</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 66 卷書卷分類總覽 */}
        <div className="space-y-6">
          {BIBLE_STRUCTURE.map((cat, idx) => (
            <section key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-200">{cat.category}</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[11px]">
                    +{STAT_INFO[cat.statType].label} / +{STAT_INFO[cat.subStatType].label}
                  </span>
                  <span>共 {cat.books.length} 卷</span>
                </div>
              </div>

              {/* 書卷卡片網格 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {cat.books.map((book) => {
                  const totalBlocks = Math.min(book.chapters, 5);

                  return (
                    <div 
                      key={book.name}
                      className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 p-3 rounded-xl flex flex-col justify-between gap-3 shadow-inner"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200 truncate">{book.name}</span>
                        <span className="text-[10px] text-slate-500">{book.chapters}章</span>
                      </div>

                      {/* 嚴格鎖定 5 欄網格排版 */}
                      <div className="grid grid-cols-5 gap-1.5 w-full">
                        {[...Array(totalBlocks)].map((_, bIdx) => {
                          const key = `${book.name}_${bIdx}`;
                          const cellData = currentRecords[key] || { layers: [] };
                          const hasData = cellData.layers.length > 0;
                          const totalClicks = cellData.layers.reduce((sum, l) => sum + l.count, 0);

                          let bgStyle = { backgroundColor: '#ef4444' };
                          if (hasData) {
                            if (cellData.layers.length === 1) {
                              bgStyle = { backgroundColor: ACTIVITIES[cellData.layers[0].type]?.color || '#ef4444' };
                            } else {
                              const colors = cellData.layers.map(l => ACTIVITIES[l.type]?.color || '#ef4444');
                              bgStyle = { background: `linear-gradient(135deg, ${colors.join(', ')})` };
                            }
                          }

                          return (
                            <div key={bIdx} className="flex flex-col items-center gap-1">
                              <button
                                onClick={() => handleBlockClick(book.name, bIdx)}
                                style={bgStyle}
                                title={
                                  hasData 
                                    ? cellData.layers.map(l => `${ACTIVITIES[l.type]?.label || l.type}: ${l.count}次 (${l.month || '無'})`).join('\n')
                                    : '未學習'
                                }
                                className="w-full aspect-square rounded-md transition-transform active:scale-90 hover:opacity-90 relative flex items-center justify-center shadow"
                              >
                                {totalClicks > 1 && (
                                  <span className="absolute -top-1.5 -right-1.5 bg-slate-950 text-white text-[9px] font-black rounded-full px-1 border border-slate-700 shadow-md">
                                    {totalClicks}
                                  </span>
                                )}
                              </button>
                              <span className="text-[9px] text-slate-400 font-mono scale-90">
                                {getChapterRangeLabel(book.chapters, bIdx, totalBlocks)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* 底部重置按鈕 */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleResetCurrent}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>清空當前存檔進度</span>
          </button>
        </div>

        {/* 新增存檔 Modal */}
        {showAddProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white">新增學習存檔</h3>
              <input
                type="text"
                placeholder="例如：小明的進度 / 2026年度"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddProfileModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateProfile}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                >
                  確定新增
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 確認提示 Modal */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white">{confirmModal.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{confirmModal.message}</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  取消
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
                >
                  確認執行
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}