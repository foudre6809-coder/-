(() => {
  const raw = document.getElementById('dashboard-data');
  if (!raw) return;

  const DATA = JSON.parse(raw.textContent);
  const MODE = {
    personal: '个人认证',
    company: '企业认证',
  };

  const REALNAME_PAGES = {
    personal: [
      '实名认证首页',
      '个人认证方式选择页',
      '手机号认证页',
      '身份证认证页',
      '银行卡认证页',
      '实名认证提交成功页',
      '实名认证审核中页',
      '实名认证未通过页',
      '资料归档失败页',
      '认证完成页',
    ],
    company: [
      '实名认证首页',
      '企业认证方式选择页',
      '企业证件认证-企业信息页',
      '企业证件认证-联系人信息页',
      '对公打款认证-填写认证信息页',
      '对公打款认证-校验认证信息页',
      '实名认证提交成功页',
      '实名认证审核中页',
      '实名认证未通过页',
      '资料归档失败页',
      '认证完成页',
    ],
  };

  const PAGE_IMAGES = [
    { level1: '注册结果页', level2: '注册成功页', page: '注册成功页', src: 'assets/page_01.png' },
    { level1: '注册结果页', level2: '注册失败页', page: '注册失败页', src: 'assets/page_02.png' },
    { level1: '账号信息', level2: '费用中心入口', page: '费用中心入口', src: 'assets/page_03.png' },
    { level1: '账号信息', level2: '返回旧版/体验新版', page: '返回旧版/体验新版', src: 'assets/page_04.png' },
    { level1: '账号信息', level2: '基本信息模块', page: '基本信息模块', src: 'assets/page_05.png' },
    { level1: '账号信息', level2: '实名认证模块', page: '实名认证模块', src: 'assets/page_06.png' },
    { level1: '实名认证', level2: '个人认证方式选择页', page: '个人认证方式选择页', src: 'assets/page_07.png' },
    { level1: '实名认证', level2: '手机号认证页', page: '手机号认证页', src: 'assets/page_08.png' },
    { level1: '实名认证', level2: '身份证认证页', page: '身份证认证页', src: 'assets/page_09.png' },
    { level1: '实名认证', level2: '银行卡认证页', page: '银行卡认证页', src: 'assets/page_10.png' },
    { level1: '实名认证', level2: '实名认证提交成功页', page: '实名认证提交成功页', src: 'assets/page_11.png' },
    { level1: '实名认证', level2: '实名认证审核中页', page: '实名认证审核中页', src: 'assets/page_12.png' },
    { level1: '实名认证', level2: '实名认证未通过页', page: '实名认证未通过页', src: 'assets/page_13.png' },
    { level1: '实名认证', level2: '资料归档失败页', page: '资料归档失败页', src: 'assets/page_14.png' },
    { level1: '实名认证', level2: '企业认证方式选择页', page: '企业认证方式选择页', src: 'assets/page_15.png' },
    { level1: '账号信息', level2: '安全设置模块', page: '安全设置模块', src: 'assets/page_16.png' },
    { level1: '账号信息', level2: '访问控制模块', page: '访问控制模块', src: 'assets/page_17.png' },
    { level1: '账号信息', level2: '您可能想了解模块', page: '您可能想了解模块', src: 'assets/page_18.png' },
    { level1: '账号信息', level2: '侧边导航栏', page: '侧边导航栏', src: 'assets/page_19.png' },
    { level1: '实名认证', level2: '企业证件认证-企业信息页', page: '企业证件认证-企业信息页', src: 'assets/page_20.png' },
    { level1: '实名认证', level2: '已完成个人认证页', page: '已完成个人认证页', src: 'assets/page_21.png' },
    { level1: '实名认证', level2: '企业证件认证-联系人信息页', page: '企业证件认证-联系人信息页', src: 'assets/page_21.png' },
    { level1: '实名认证', level2: '对公打款认证-填写认证信息页', page: '对公打款认证-填写认证信息页', src: 'assets/page_21.png' },
    { level1: '实名认证', level2: '对公打款认证-校验认证信息页', page: '对公打款认证-校验认证信息页', src: 'assets/page_21.png' },
    { level1: '实名认证', level2: '认证完成页', page: '认证完成页', src: 'assets/page_21.png' },
  ];

  const typeOrder = ['点击率', '分布分析', '来源分析', '流失率', '频次', '其他', '取消率', '失败原因', '体验时长', '性能加载', '页面规模', '转化率'];
  const pageSummaryOrder = ['pv', 'uv', 'stay', 'bounce'];

  const state = {
    authMode: 'personal',
    start: DATA.dateRange?.[0] || '',
    end: DATA.dateRange?.[1] || '',
    level1: '全部',
    level2: '全部',
    page: '全部',
    type: '全部',
    funnel: '个人手机号认证',
    imageIndex: 0,
    metricModal: null,
  };

  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (n) => Number(n || 0).toLocaleString('zh-CN');
  const pct = (v) => (Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : '-');
  const uniq = (xs) => ['全部', ...Array.from(new Set(xs.filter(Boolean)))];
  const splitButtons = (text) => String(text || '')
    .split(/[、,，;；/]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const heatColor = (rate) => {
    const v = Math.max(0, Math.min(1, Number(rate) || 0));
    const hue = 220 - v * 170;
    const sat = 80;
    const light = 94 - v * 38;
    return `hsl(${hue} ${sat}% ${light}%)`;
  };
  const metricValue = (row, kind) => {
    if (!row) return null;
    if (kind === 'pv') return row.pvSum || 0;
    if (kind === 'uv') return row.uvSum || 0;
    if (kind === 'stay') return row.type === '体验时长' ? parseFloat(String(row.display || row.baseValue || 0)) || 0 : Number(row.baseValue) || 0;
    if (kind === 'bounce') {
      if (row.type === '流失率') return row.denSum ? row.numSum / row.denSum : parseFloat(String(row.display || row.baseValue || 0)) || 0;
      return Number(row.baseValue) || 0;
    }
    return Number(row.baseValue) || 0;
  };
  const isRealnameModeItem = (m) => {
    if (m.level1 !== '实名认证') return true;
    const allow = state.authMode === 'personal' ? REALNAME_PAGES.personal : REALNAME_PAGES.company;
    return allow.includes(displayLevel2(m));
  };

  function displayLevel2(m) {
    if (m.level1 !== '实名认证') return m.level2;
    const map = {
      '实名认证首页': '实名认证首页',
      '个人认证-方式选择': '个人认证方式选择页',
      '个人认证-手机号认证': '手机号认证页',
      '个人认证-身份证认证': '身份证认证页',
      '个人认证-银行卡认证': '银行卡认证页',
      '企业认证-方式选择': '企业认证方式选择页',
      '企业认证-企业证件认证': m.page || '企业证件认证-企业信息页',
      '企业认证-对公打款认证': m.page || '对公打款认证-填写认证信息页',
      '认证提交成功': '实名认证提交成功页',
      '认证审核中': '实名认证审核中页',
      '认证未通过': '实名认证未通过页',
      '认证资料归档失败': '资料归档失败页',
      '认证完成': '认证完成页',
    };
    return map[m.level2] || m.level2;
  }

  function displayPage(m) {
    if (m.level1 !== '实名认证') return m.page;
    if (m.level2 === '个人认证-方式选择') return '个人认证方式选择页';
    if (m.level2 === '企业认证-方式选择') return '企业认证方式选择页';
    if (m.level2 === '认证完成') return '认证完成页';
    return m.page || displayLevel2(m);
  }

  const metrics = DATA.metrics.map((m) => ({ ...m, level2Display: displayLevel2(m), pageDisplay: displayPage(m) }));

  const app = document.createElement('div');
  app.className = 'dash-shell';
  app.innerHTML = `
    <style>
      :root{--bg:#f5f7fb;--panel:#fff;--ink:#1f2937;--muted:#64748b;--line:#dbe3ee;--blue:#2563eb;--cyan:#0891b2;--green:#16a34a;--orange:#ea580c;--red:#dc2626;--soft-blue:#eff6ff;--soft-green:#ecfdf5;--soft-orange:#fff7ed;--soft-red:#fef2f2}
      *{box-sizing:border-box}
      body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",Arial,sans-serif}
      .dash-shell{max-width:1480px;margin:0 auto;padding:14px}
      .header{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:10px}
      h1{margin:0;font-size:24px}
      .sub{margin-top:5px;color:var(--muted);font-size:12px}
      .badge{border:1px solid var(--line);background:#fff;padding:6px 10px;font-weight:800;font-size:13px}
      .mode-toggle{display:flex;gap:8px;align-items:center;justify-content:flex-end;margin-bottom:10px}
      .mode-btn{border:1px solid var(--line);background:#fff;padding:8px 12px;border-radius:999px;cursor:pointer;font-size:13px;font-weight:800;color:#334155}
      .mode-btn.active{background:var(--blue);color:#fff;border-color:var(--blue)}
      .filters{display:grid;grid-template-columns:repeat(6,minmax(120px,1fr));gap:8px;background:#fff;border:1px solid var(--line);padding:10px;margin-bottom:10px}
      .filter label{display:block;font-size:11px;color:var(--muted);margin-bottom:4px}
      select,input{width:100%;min-height:32px;border:1px solid var(--line);background:#fff;padding:5px 8px;border-radius:4px;color:var(--ink);font-size:13px}
      .kpis,.page-kpis{display:grid;grid-template-columns:repeat(4,minmax(130px,1fr));gap:8px;margin-bottom:8px}
      .kpi{background:#fff;border:1px solid var(--line);padding:8px 9px;min-height:74px;position:relative}
      .kpi .label{font-size:12px;color:var(--muted)}
      .kpi .value{font-size:19px;font-weight:850;margin-top:6px;line-height:1.1}
      .kpi .hint{font-size:11px;color:var(--muted);margin-top:4px}
      .kpi-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
      .kpi-page .value{font-size:18px}
      .more-btn{border:1px solid var(--line);background:#fff;color:#334155;border-radius:999px;padding:4px 8px;font-size:11px;cursor:pointer;font-weight:800;line-height:1}
      .more-btn:hover{border-color:var(--blue);color:var(--blue)}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:start}
      .panel{background:#fff;border:1px solid var(--line);padding:12px;min-width:0}
      .panel.wide{grid-column:1/-1}
      .panel h2{margin:0 0 8px;font-size:15px}
      .panel-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px}
      .count{font-size:12px;color:var(--muted)}
      details.panel{padding:0}
      details.panel>summary{list-style:none;cursor:pointer;padding:11px 12px;font-weight:800;display:flex;justify-content:space-between;align-items:center;font-size:14px}
      details.panel>summary::-webkit-details-marker{display:none}
      details.panel>summary::after{content:'展开';font-size:12px;color:var(--muted)}
      details.panel[open]>summary::after{content:'收起'}
      .details-body{padding:0 12px 12px}
      .image-panel{display:grid;grid-template-columns:minmax(320px,1.05fr) minmax(240px,.95fr);gap:10px;align-items:start}
      .screen{border:1px solid var(--line);background:#f8fafc;min-height:220px;display:grid;place-items:center;overflow:hidden}
      .screen img{max-width:100%;max-height:300px;display:block}
      .screen-info h3{margin:0 0 6px;font-size:16px}
      .chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
      .chip{background:var(--soft-blue);color:var(--blue);font-size:11px;font-weight:800;padding:4px 7px;border-radius:999px}
      .heat-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:8px 0 6px}
      .heat-head strong{font-size:12px}
      .heat-note{font-size:11px;color:var(--muted)}
      .heatmap{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
      .heat-item{border:1px solid rgba(148,163,184,.35);border-radius:10px;padding:9px;min-height:84px;display:flex;flex-direction:column;justify-content:space-between;cursor:default;position:relative;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.45)}
      .heat-item:hover{transform:translateY(-1px);box-shadow:0 8px 18px rgba(15,23,42,.08)}
      .heat-item .heat-btn{font-weight:900;font-size:12px;line-height:1.2}
      .heat-item .heat-rate{font-size:15px;font-weight:900;margin-top:4px}
      .heat-item .heat-metric{font-size:11px;color:rgba(15,23,42,.68);margin-top:2px}
      .heat-item .heat-buttons{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
      .heat-pill{display:inline-flex;align-items:center;border-radius:999px;padding:2px 6px;font-size:10px;font-weight:800;background:rgba(255,255,255,.56);color:#0f172a}
      .heat-grid-title{font-size:12px;color:var(--muted);margin-top:4px}
      .heat-tooltip{position:fixed;z-index:25;max-width:280px;background:#0f172a;color:#fff;border-radius:10px;padding:10px 11px;font-size:12px;line-height:1.45;box-shadow:0 12px 24px rgba(15,23,42,.28);pointer-events:none;transform:translate(12px,12px)}
      .heat-tooltip[hidden]{display:none}
      .heat-tooltip .t1{font-weight:900;margin-bottom:4px}
      .heat-tooltip .t2{color:rgba(255,255,255,.78);font-size:11px}
      .thumbs{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}
      .thumb{border:2px solid transparent;background:#fff;padding:0;cursor:pointer;height:56px;overflow:hidden}
      .thumb.active{border-color:var(--blue)}
      .thumb img{width:100%;height:100%;object-fit:cover}
      .button-table{margin-top:8px;border:1px solid var(--line);background:#fff;overflow:auto}
      .button-table table{width:100%;border-collapse:collapse;font-size:12px}
      .button-table th,.button-table td{padding:7px 8px;border-bottom:1px solid #eef2f7;text-align:left;vertical-align:top}
      .button-table th{background:#f8fafc;color:var(--muted);font-weight:800;position:sticky;top:0}
      .button-table tr:last-child td{border-bottom:0}
      .button-meter{height:8px;border-radius:999px;background:#eef2f7;overflow:hidden;margin-top:4px}
      .button-meter > span{display:block;height:100%;background:linear-gradient(90deg,var(--orange),#f59e0b)}
      .warns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
      .warn{border:1px solid var(--line);padding:8px;background:#fff}
      .warn.red{background:var(--soft-red);border-color:#fecaca}
      .warn.orange{background:var(--soft-orange);border-color:#fed7aa}
      .warn-title{font-weight:850;font-size:12px}
      .warn-meta{color:var(--muted);font-size:11px;margin-top:5px;line-height:1.3}
      .warn-value{font-size:16px;font-weight:900;margin-top:5px}
      .center-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:start}
      .funnel-toolbar{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;margin:0 0 8px;padding:7px 9px;background:#f8fbff;border:1px solid #e4edf8}
      .funnel-control{min-width:170px}
      .funnel-control label{display:block;font-size:11px;color:var(--muted);margin-bottom:4px}
      .funnel-summary{display:flex;flex-direction:column;align-items:flex-end;gap:2px;text-align:right}
      .funnel-summary span{font-size:11px;color:var(--muted)}
      .funnel-summary strong{font-size:18px;font-weight:900}
      .funnel-summary small{color:var(--muted);font-size:11px}
      .funnel{display:grid;gap:6px}
      .funnel-step{display:grid;grid-template-columns:28px minmax(130px,1.2fr) 1fr 78px;gap:7px;align-items:center;padding:3px 5px;border:1px solid transparent}
      .funnel-step.hot{background:var(--soft-red);border-color:#fecaca}
      .step{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;color:#fff;background:var(--blue);font-weight:800;font-size:12px}
      .hot .step{background:var(--red)}
      .stage{font-weight:800;font-size:12px;line-height:1.1}
      .loss{color:var(--muted);font-size:11px;margin-top:1px}
      .stay{color:#334155;font-size:11px;margin-top:1px}
      .track{height:10px;background:#eef2f7;border:1px solid #e5e7eb}
      .fill{height:100%;min-width:2px;background:linear-gradient(90deg,var(--blue),var(--cyan))}
      .fill.green{background:linear-gradient(90deg,var(--green),#22c55e)}
      .fill.red{background:linear-gradient(90deg,var(--red),#fb7185)}
      .metric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
      .metric-card{border:1px solid var(--line);padding:8px 9px;background:#fff;min-height:92px;display:flex;flex-direction:column}
      .metric-top{display:flex;justify-content:space-between;gap:8px}
      .metric-title{font-weight:850;line-height:1.25;font-size:12px}
      .tag{flex:0 0 auto;border-radius:999px;padding:3px 7px;font-size:11px;background:var(--soft-blue);color:var(--blue);font-weight:800}
      .metric-value{font-size:17px;font-weight:900;margin:7px 0 5px;line-height:1.1}
      .meta{color:var(--muted);font-size:11px;line-height:1.35}
      .path{color:#94a3b8;font-size:11px;line-height:1.35;margin-top:auto;padding-top:8px}
      .bars{display:grid;gap:8px}
      .bar-row{display:grid;grid-template-columns:minmax(110px,200px) 1fr 76px;gap:7px;align-items:center;font-size:12px}
      .label{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
      .legend{display:flex;flex-wrap:wrap;gap:10px;color:var(--muted);font-size:11px;margin-top:6px}
      .dot{display:inline-block;width:8px;height:8px;margin-right:5px;border-radius:50%}
      .empty{border:1px dashed var(--line);padding:20px;color:var(--muted);text-align:center}
      .modal{position:fixed;inset:0;z-index:20;display:grid;place-items:center}
      .modal[hidden]{display:none}
      .modal-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.45)}
      .modal-card{position:relative;background:#fff;border:1px solid var(--line);width:min(1060px,calc(100vw - 28px));max-height:calc(100vh - 28px);display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(15,23,42,.2)}
      .modal-head{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid var(--line)}
      .modal-head h3{margin:0;font-size:16px}
      .modal-head button{border:1px solid var(--line);background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer}
      .modal-sub{padding:0 14px 10px;color:var(--muted);font-size:12px}
      .modal-body{padding:0 14px 14px;overflow:auto}
      .metric-table{width:100%;border-collapse:collapse;font-size:12px}
      .metric-table th,.metric-table td{border-bottom:1px solid #eef2f7;padding:8px 8px;text-align:left;vertical-align:top}
      .metric-table th{position:sticky;top:0;background:#f8fafc;color:var(--muted);font-weight:800}
      .metric-table tr:last-child td{border-bottom:0}
      .footer{margin-top:10px;color:var(--muted);font-size:11px}
      @media(max-width:1100px){.filters{grid-template-columns:repeat(3,1fr)}.kpis,.page-kpis{grid-template-columns:repeat(2,1fr)}.grid,.image-panel,.center-grid{grid-template-columns:1fr}.warns{grid-template-columns:repeat(2,1fr)}.heatmap{grid-template-columns:1fr}}
      @media(max-width:720px){.dash-shell{padding:12px}.header{display:block}.filters,.kpis,.warns{grid-template-columns:1fr}.funnel-step{grid-template-columns:1fr;gap:6px}.bar-row{grid-template-columns:1fr}.mode-toggle{justify-content:flex-start;flex-wrap:wrap}h1{font-size:21px}}
    </style>
    <div class="header">
      <div>
        <h1>账号中心埋点数据看板</h1>
        <div class="sub">按时间、页面与指标查看点击、转化、流失和认证漏斗</div>
      </div>
      <div class="badge">示例看板</div>
    </div>
    <div class="mode-toggle">
      <button class="mode-btn" data-mode="personal">个人认证</button>
      <button class="mode-btn" data-mode="company">企业认证</button>
    </div>
    <section class="filters"></section>
    <details class="panel wide" id="imagePanel">
      <summary><span>当前页面插图</span><span class="count" id="imageCount"></span></summary>
      <div class="details-body">
        <div class="image-panel">
          <div class="screen" id="pageScreen"></div>
          <div class="screen-info">
            <h3 id="imageTitle"></h3>
            <div class="meta" id="imageMeta"></div>
            <div class="chips" id="imageChips"></div>
            <div class="heat-head">
              <strong>按钮热力图</strong>
              <span class="heat-note">按页面按钮点击率着色</span>
            </div>
            <div class="heatmap" id="buttonHeatmap"></div>
            <div class="heat-grid-title">按钮点击率明细</div>
            <div class="button-table" id="buttonTable"></div>
            <div class="meta">这里展示的是页面级按钮点击率汇总，按钮名称来自埋点说明里的涉及按钮。</div>
            <div class="thumbs" id="thumbs"></div>
          </div>
        </div>
      </div>
    </details>
    <section class="kpis"></section>
    <section class="page-kpis"></section>
    <main class="grid">
      <details class="panel wide" id="warnPanel">
        <summary><span>关键问题预警</span><span class="count" id="warnCount"></span></summary>
        <div class="details-body">
          <div class="warns" id="warnings"></div>
        </div>
      </details>
      <section class="panel">
        <div class="panel-head"><h2>认证漏斗</h2><span class="count" id="funnelCount"></span></div>
        <div class="funnel-toolbar">
          <div class="funnel-control">
            <label>漏斗</label>
            <select id="funnelSelect"></select>
          </div>
          <div class="funnel-summary">
            <span>当前漏斗转化率</span>
            <strong id="funnelRate"></strong>
            <small>最后一步 / 第一步</small>
          </div>
        </div>
        <div class="funnel" id="funnelView"></div>
      </section>
      <section class="panel">
        <div class="panel-head"><h2>来源渠道</h2><span class="count">相关指标筛选时参考</span></div>
        <div id="sourceRank" class="bars"></div>
      </section>
      <details class="panel wide">
        <summary><span>指标卡片</span><span class="count" id="metricCount"></span></summary>
        <div class="details-body"><div class="metric-grid cards" id="metricCards"></div></div>
      </details>
    </main>
    <div class="footer">页面图片来自“新-需求文档-账号中心”；数据为示例假数据。</div>
    <div class="heat-tooltip" id="heatTooltip" hidden></div>
    <div class="modal" id="metricModal" hidden>
      <div class="modal-backdrop" data-close="1"></div>
      <div class="modal-card" role="dialog" aria-modal="true">
        <div class="modal-head">
          <h3 id="metricModalTitle"></h3>
          <button type="button" id="metricModalClose">关闭</button>
        </div>
        <div class="modal-sub" id="metricModalSub"></div>
        <div class="modal-body">
          <table class="metric-table">
            <thead>
              <tr>
                <th style="width:25%">页面/模块</th>
                <th style="width:12%">PV</th>
                <th style="width:12%">UV</th>
                <th style="width:16%">页面停留时间</th>
                <th style="width:12%">跳出率</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody id="metricModalBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  document.body.innerHTML = '';
  document.body.appendChild(app);

  const filtersEl = app.querySelector('.filters');
  const kpisEl = app.querySelector('.kpis');
  const warningsEl = app.querySelector('#warnings');
  const warnCountEl = app.querySelector('#warnCount');
  const sourceRankEl = app.querySelector('#sourceRank');
  const funnelSelectEl = app.querySelector('#funnelSelect');
  const funnelViewEl = app.querySelector('#funnelView');
  const funnelRateEl = app.querySelector('#funnelRate');
  const funnelCountEl = app.querySelector('#funnelCount');
  const metricCardsEl = app.querySelector('#metricCards');
  const metricCountEl = app.querySelector('#metricCount');
  const pageScreenEl = app.querySelector('#pageScreen');
  const imageTitleEl = app.querySelector('#imageTitle');
  const imageMetaEl = app.querySelector('#imageMeta');
  const imageChipsEl = app.querySelector('#imageChips');
  const buttonHeatmapEl = app.querySelector('#buttonHeatmap');
  const buttonTableEl = app.querySelector('#buttonTable');
  const heatTooltipEl = app.querySelector('#heatTooltip');
  const thumbsEl = app.querySelector('#thumbs');
  const imageCountEl = app.querySelector('#imageCount');
  const pageKpisEl = app.querySelector('.page-kpis');
  const metricModalEl = app.querySelector('#metricModal');
  const metricModalTitleEl = app.querySelector('#metricModalTitle');
  const metricModalSubEl = app.querySelector('#metricModalSub');
  const metricModalBodyEl = app.querySelector('#metricModalBody');
  const metricModalCloseEl = app.querySelector('#metricModalClose');
  const modeButtons = [...app.querySelectorAll('.mode-btn')];

  function setupModeButtons() {
    modeButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === state.authMode);
      btn.onclick = () => {
        if (state.authMode === btn.dataset.mode) return;
        state.authMode = btn.dataset.mode;
        state.level2 = '全部';
        state.page = '全部';
        state.funnel = state.authMode === 'personal' ? '个人手机号认证' : '企业证件认证';
        state.imageIndex = 0;
        render();
      };
    });
  }

  function level2Options() {
    const base = metrics.filter((m) => (state.level1 === '全部' || m.level1 === state.level1) && isRealnameModeItem(m));
    return uniq(base.map((m) => (m.level1 === '实名认证' ? m.level2Display : m.level2)));
  }

  function pageOptions() {
    const base = metrics.filter((m) => (state.level1 === '全部' || m.level1 === state.level1) && isRealnameModeItem(m));
    return uniq(base.map((m) => m.pageDisplay));
  }

  function setSelectOptions(select, values, selected) {
    select.innerHTML = values.map((v) => `<option value="${esc(v)}" ${v === selected ? 'selected' : ''}>${esc(v)}</option>`).join('');
  }

  function renderFilters() {
    const level1Opts = uniq(metrics.map((m) => m.level1));
    const level2Opts = level2Options();
    const pageOpts = pageOptions();
    const filters = [
      ['开始日期', 'date', 'startDate', state.start],
      ['结束日期', 'date', 'endDate', state.end],
      ['一级分类', 'select', 'level1', state.level1, level1Opts],
      ['二级分类', 'select', 'level2', state.level2, level2Opts],
      ['页面/模块', 'select', 'page', state.page, pageOpts],
      ['指标类型', 'select', 'type', state.type, ['全部', ...typeOrder]],
    ];
    filtersEl.innerHTML = filters.map(([label, kind, id, value, opts]) => {
      if (kind === 'date') {
        return `<div class="filter"><label>${label}</label><input id="${id}" type="date" value="${esc(value)}"></div>`;
      }
      return `<div class="filter"><label>${label}</label><select id="${id}">${opts.map((o) => `<option value="${esc(o)}" ${o === value ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></div>`;
    }).join('');

    filtersEl.querySelectorAll('select').forEach((el) => {
      el.onchange = () => {
        state[el.id] = el.value;
        if (el.id === 'level1') {
          state.level2 = '全部';
          state.page = '全部';
        }
        if (el.id === 'level2') state.page = '全部';
        render();
      };
    });
    filtersEl.querySelectorAll('input[type="date"]').forEach((el) => {
      el.onchange = () => {
        state[el.id === 'startDate' ? 'start' : 'end'] = el.value || DATA.dateRange[el.id === 'startDate' ? 0 : 1];
        if (state.start > state.end) state.end = state.start;
        if (state.end < state.start) state.start = state.end;
        render();
      };
    });
  }

  function filteredMetrics(opts = {}) {
    const ignorePage = Boolean(opts.ignorePage);
    const ignoreType = Boolean(opts.ignoreType);
    return metrics.filter((m) => {
      if (!isRealnameModeItem(m)) return false;
      if (state.level1 !== '全部' && m.level1 !== state.level1) return false;
      if (state.level2 !== '全部' && (m.level1 === '实名认证' ? m.level2Display : m.level2) !== state.level2) return false;
      if (!ignorePage && state.page !== '全部' && m.pageDisplay !== state.page) return false;
      if (!ignoreType && state.type !== '全部' && m.type !== state.type) return false;
      return true;
    });
  }

  function currentPageRows() {
    return metricAgg(filteredMetrics({ ignoreType: true }));
  }

  function summaryRows() {
    return metricAgg(filteredMetrics({ ignorePage: true, ignoreType: true }));
  }

  function summaryByPage() {
    const rows = summaryRows();
    const map = new Map();
    for (const row of rows) {
      const key = row.pageDisplay;
      if (!map.has(key)) {
        map.set(key, {
          page: row.pageDisplay,
          level1: row.level1,
          level2: row.level2Display,
          pvRow: null,
          uvRow: null,
          stayRow: null,
          bounceRow: null,
          clickRows: [],
        });
      }
      const item = map.get(key);
      if (row.type === '页面规模' && !item.pvRow) item.pvRow = row;
      if (row.type === '体验时长' && !item.stayRow) item.stayRow = row;
      if (row.type === '流失率' && !item.bounceRow) item.bounceRow = row;
      if (row.type === '点击率' && row.involved) item.clickRows.push(row);
      if (!item.uvRow && row.type === '页面规模') item.uvRow = row;
    }
    return [...map.values()].map((item) => ({
      ...item,
      pv: item.pvRow ? item.pvRow.pvSum : 0,
      uv: item.uvRow ? item.uvRow.uvSum : 0,
      stay: item.stayRow ? metricValue(item.stayRow, 'stay') : 0,
      bounce: item.bounceRow ? metricValue(item.bounceRow, 'bounce') : 0,
      clickRows: item.clickRows,
    }));
  }

  function pickCurrentPageSummary(rows) {
    if (!rows.length) return null;
    if (state.page !== '全部') return rows.find((r) => r.page === state.page) || rows[0];
    return [...rows].sort((a, b) => {
      const score = (r) => (r.stay > 0 ? 1 : 0) * 100000 + (r.bounce > 0 ? 1 : 0) * 10000 + r.pv;
      return score(b) - score(a);
    })[0];
  }

  function metricAgg(rows) {
    const ids = new Set(rows.map((m) => m.id));
    const daily = DATA.daily.filter((d) => ids.has(d.id) && d.date >= state.start && d.date <= state.end);
    const byId = new Map(rows.map((m) => [m.id, { ...m, pvSum: 0, uvSum: 0, numSum: 0, denSum: 0, display: '' }]));
    for (const r of daily) {
      const item = byId.get(r.id);
      if (!item) continue;
      item.pvSum += r.pv;
      item.uvSum += r.uv;
      item.numSum += Number(r.num) || 0;
      item.denSum += Number(r.den) || 0;
    }
    for (const item of byId.values()) {
      if (item.type === '页面规模') {
        item.display = `PV ${fmt(item.pvSum)} / UV ${fmt(item.uvSum)}`;
      } else if (item.unit === '%') {
        item.display = item.denSum ? pct(item.numSum / item.denSum) : pct(Number(item.baseValue) || 0);
      } else if (item.type === '体验时长') {
        item.display = `${((item.numSum / Math.max(1, daily.filter((d) => d.id === item.id).length)) || Number(item.baseValue) || 0).toFixed(1)} 秒`;
      } else if (item.type === '性能加载') {
        item.display = `${Math.round((item.numSum / Math.max(1, daily.filter((d) => d.id === item.id).length)) || Number(item.baseValue) || 0)} ms`;
      } else if (item.unit === '次/人') {
        item.display = `${(Number(item.baseValue) || 0).toFixed(2)} 次/人`;
      } else {
        item.display = pct(Number(item.baseValue) || 0);
      }
    }
    return [...byId.values()];
  }

  function renderPageKpis(rows) {
    const summaries = summaryByPage();
    const current = pickCurrentPageSummary(summaries);
    const currentLabel = current ? current.page : '暂无页面';
    const currentHint = current ? `${current.level1} / ${current.level2}` : '当前筛选没有页面';
    const cards = [
      ['当前页面PV', current ? fmt(current.pv) : '-', 'page', 'pv'],
      ['当前页面UV', current ? fmt(current.uv) : '-', 'page', 'uv'],
      ['页面停留时间', current ? `${Number(current.stay || 0).toFixed(1)} 秒` : '-', 'page', 'stay'],
      ['跳出率', current ? pct(current.bounce) : '-', 'page', 'bounce'],
    ];
    pageKpisEl.innerHTML = cards.map((c) => `
      <article class="kpi kpi-page">
        <div class="kpi-top">
          <div class="label">${c[0]}</div>
          <button type="button" class="more-btn" data-metric="${c[3]}">更多</button>
        </div>
        <div class="value">${c[1]}</div>
        <div class="hint">${esc(currentLabel)} · ${esc(currentHint)}</div>
      </article>
    `).join('');
    pageKpisEl.querySelectorAll('.more-btn').forEach((btn) => {
      btn.onclick = () => openMetricModal(btn.dataset.metric, currentLabel, currentHint);
    });
  }

  function openMetricModal(metricKey, currentLabel, currentHint) {
    const rows = summaryByPage()
      .map((item) => ({ ...item }))
      .sort((a, b) => (metricSortValue(b, metricKey) - metricSortValue(a, metricKey)));
    metricModalEl.hidden = false;
    metricModalTitleEl.textContent = metricTitle(metricKey);
    metricModalSubEl.textContent = `${currentLabel} · ${currentHint} · 按${metricTitle(metricKey)}从高到低排序`;
    metricModalBodyEl.innerHTML = rows.map((item) => `
      <tr>
        <td>${esc(item.page)}<div class="meta">${esc(item.level1)} / ${esc(item.level2)}</div></td>
        <td>${fmt(item.pv)}</td>
        <td>${fmt(item.uv)}</td>
        <td>${Number(item.stay || 0).toFixed(1)} 秒</td>
        <td>${pct(item.bounce)}</td>
        <td>${esc(item.clickRows.slice(0, 2).map((r) => r.metric).join('、') || '无')}</td>
      </tr>
    `).join('') || '<tr><td colspan="6"><div class="empty">没有可展示的数据</div></td></tr>';
  }

  function metricTitle(metricKey) {
    return ({ pv: '页面PV', uv: '页面UV', stay: '页面停留时间', bounce: '跳出率' }[metricKey] || '汇总数据');
  }

  function metricSortValue(item, metricKey) {
    if (!item) return 0;
    if (metricKey === 'pv') return item.pv || 0;
    if (metricKey === 'uv') return item.uv || 0;
    if (metricKey === 'stay') return item.stay || 0;
    if (metricKey === 'bounce') return item.bounce || 0;
    return 0;
  }

  function closeMetricModal() {
    metricModalEl.hidden = true;
  }

  function renderKpis(rows) {
    const pv = rows.reduce((s, r) => s + r.pvSum, 0);
    const uv = rows.reduce((s, r) => s + r.uvSum, 0);
    const clickRows = rows.filter((r) => r.type === '点击率');
    const clickDen = clickRows.reduce((s, r) => s + (r.denSum || 0), 0);
    const clickNum = clickRows.reduce((s, r) => s + (r.numSum || 0), 0);
    const click = clickDen ? clickNum / clickDen : 0;
    const lossRows = [...rows].filter((r) => r.type === '流失率').sort((a, b) => (b.numSum / Math.max(1, b.denSum)) - (a.numSum / Math.max(1, a.denSum)));
    const highLoss = lossRows[0];
    const cards = [
      ['PV', fmt(pv), '所选时间段'],
      ['UV', fmt(uv), '所选时间段'],
      ['整体点击率', pct(click), '总点击 / 总PV'],
      ['最高流失页面', highLoss ? pct(highLoss.numSum / Math.max(1, highLoss.denSum)) : '-', highLoss ? highLoss.pageDisplay : '当前无流失率'],
    ];
    kpisEl.innerHTML = cards.map((c) => `<article class="kpi"><div class="label">${c[0]}</div><div class="value">${c[1]}</div><div class="hint">${esc(c[2])}</div></article>`).join('');
  }

  function renderWarnings(rows) {
    const items = [];
    const loss = [...rows].filter((r) => r.type === '流失率').sort((a, b) => (b.numSum / Math.max(1, b.denSum)) - (a.numSum / Math.max(1, a.denSum)))[0];
    const conversion = [...rows].filter((r) => r.type === '转化率').sort((a, b) => (a.numSum / Math.max(1, a.denSum)) - (b.numSum / Math.max(1, b.denSum)))[0];
    const click = [...rows].filter((r) => r.type === '点击率').sort((a, b) => (a.numSum / Math.max(1, a.denSum)) - (b.numSum / Math.max(1, b.denSum)))[0];
    if (loss) items.push(['red', '流失率最高', loss, pct(loss.numSum / Math.max(1, loss.denSum)), loss.definition || loss.involved]);
    if (conversion) items.push(['orange', '转化率最低', conversion, pct(conversion.numSum / Math.max(1, conversion.denSum)), conversion.definition || conversion.involved]);
    if (click) items.push(['orange', '点击率最低', click, pct(click.numSum / Math.max(1, click.denSum)), click.definition || click.involved]);
    warnCountEl.textContent = `${items.length} 条`;
    warningsEl.innerHTML = items.map(([cls, title, m, value, meta]) => `<article class="warn ${cls}"><div class="warn-title">${title}</div><div class="warn-value">${value}</div><div class="warn-meta">${esc(m.pageDisplay)} · ${esc(m.metric)}</div><div class="warn-meta">${esc(meta)}</div></article>`).join('') || '<div class="empty">当前筛选暂无预警</div>';
  }

  function selectedFunnelData() {
    const rows = DATA.funnelDaily.filter((f) => f.name === state.funnel && f.date >= state.start && f.date <= state.end);
    const map = new Map();
    for (const row of rows) {
      const key = `${row.order}|${row.stage}`;
      if (!map.has(key)) map.set(key, { order: row.order, stage: row.stage, users: 0 });
      map.get(key).users += row.users;
    }
    return [...map.values()].sort((a, b) => a.order - b.order);
  }

  function dwellForStage(stage) {
    const isPersonal = state.funnel.includes('个人');
    const map = {
      '实名认证首页': '实名认证首页',
      '认证方式选择页': isPersonal ? '个人认证-方式选择' : '企业认证-方式选择',
      '手机号认证页': '个人认证-手机号认证',
      '身份证认证页': '个人认证-身份证认证',
      '银行卡认证页': '个人认证-银行卡认证',
      '企业证件认证-企业信息页': '企业认证-企业证件认证',
      '企业证件认证-联系人信息页': '企业认证-企业证件认证',
      '对公打款认证-填写认证信息页': '企业认证-对公打款认证',
      '对公打款认证-校验认证信息页': '企业认证-对公打款认证',
    };
    const key = map[stage];
    if (!key) return '-';
    const row = metrics.find((m) => m.level1 === '实名认证' && m.level2 === key && m.type === '体验时长');
    if (!row) return '-';
    return row.baseValue ? `${Number(row.baseValue).toFixed(1)} 秒` : '-';
  }

  function renderFunnel() {
    const rows = selectedFunnelData();
    const max = Math.max(1, ...rows.map((r) => r.users));
    const rate = rows.length && rows[0].users ? rows[rows.length - 1].users / rows[0].users : 0;
    funnelCountEl.textContent = `${rows.length} 步`;
    funnelRateEl.textContent = pct(rate);
    funnelViewEl.innerHTML = rows.map((r, idx) => {
      const prev = idx ? rows[idx - 1].users : r.users;
      const loss = idx ? prev - r.users : 0;
      const lossRate = idx ? (loss / prev) : 0;
      const hot = lossRate >= 0.35;
      return `
        <div class="funnel-step ${hot ? 'hot' : ''}">
          <div class="step">${r.order}</div>
          <div>
            <div class="stage">${esc(r.stage)}</div>
            <div class="loss">流失 ${fmt(loss)} · 流失率 ${idx ? pct(lossRate) : '0.0%'}</div>
            <div class="stay">停留时长 ${esc(dwellForStage(r.stage))}</div>
          </div>
          <div class="track"><div class="fill ${hot ? 'red' : 'green'}" style="width:${Math.max(4, (r.users / max) * 100)}%"></div></div>
          <strong>${fmt(r.users)}</strong>
        </div>
      `;
    }).join('');
  }

  function renderSource() {
    const rows = [
      { source: '账号信息页', count: 1260 },
      { source: '注册成功页', count: 830 },
      { source: '侧边导航', count: 710 },
      { source: '认证结果页', count: 520 },
      { source: '其他入口', count: 390 },
    ];
    const max = Math.max(1, ...rows.map((r) => r.count));
    sourceRankEl.innerHTML = rows.map((r) => `<div class="bar-row"><div class="label" title="${esc(r.source)}">${esc(r.source)}</div><div class="track"><div class="fill" style="width:${Math.max(4, (r.count / max) * 100)}%"></div></div><strong>${fmt(r.count)}</strong></div>`).join('');
  }

  function renderImagePanel(rows) {
    const candidates = PAGE_IMAGES.filter((img) => {
      if (state.level1 !== '全部' && img.level1 !== state.level1) return false;
      if (state.level2 !== '全部' && img.level2 !== state.level2) return false;
      if (state.page !== '全部' && img.page !== state.page) return false;
      return true;
    });
    const preferredPage = state.page !== '全部' ? state.page : (pickCurrentPageSummary(summaryByPage())?.page || '');
    let itemIndex = candidates.findIndex((img) => img.page === preferredPage);
    if (itemIndex < 0) itemIndex = 0;
    if (state.imageIndex >= candidates.length || !candidates[state.imageIndex] || candidates[state.imageIndex].page !== preferredPage) {
      state.imageIndex = itemIndex;
    }
    const item = candidates[state.imageIndex] || candidates[itemIndex];
    imageCountEl.textContent = candidates.length ? `${candidates.length} 张匹配图片` : '无匹配图片';
    if (!item) {
      pageScreenEl.innerHTML = '<div class="empty">当前筛选没有对应页面图片</div>';
      imageTitleEl.textContent = '未选择具体页面';
      imageMetaEl.textContent = '可以通过页面/模块筛选定位页面';
      imageChipsEl.innerHTML = '';
      thumbsEl.innerHTML = '';
      return;
    }
    pageScreenEl.innerHTML = `<img src="${esc(item.src)}" alt="${esc(item.page)}页面截图">`;
    imageTitleEl.textContent = item.page;
    imageMetaEl.textContent = `${item.level1} / ${item.level2}`;
    const targetRows = rows.filter((m) => m.level1 === item.level1 && displayLevel2(m) === item.level2);
    const tags = targetRows.slice(0, 3).map((m) => m.type);
    imageChipsEl.innerHTML = [...new Set(tags)].map((t) => `<span class="chip">${esc(t)}</span>`).join('');
    const buttonRows = targetRows.filter((m) => m.type === '点击率' && m.involved);
    const buttonItems = buttonRows
      .slice()
      .sort((a, b) => (Number(b.baseValue) || 0) - (Number(a.baseValue) || 0))
      .map((m) => ({
        metric: m.metric,
        rate: Number(m.baseValue) || 0,
        rateLabel: pct(m.baseValue || 0),
        buttons: splitButtons(m.involved),
        definition: m.definition || '',
        involved: m.involved || '',
        page: `${m.level1} / ${m.pageDisplay}`,
      }));
    buttonHeatmapEl.innerHTML = buttonItems.length ? buttonItems.map((it) => {
      const bg = heatColor(it.rate);
      return `
        <div class="heat-item" data-title="${esc(it.metric)}" data-rate="${esc(it.rateLabel)}" data-buttons="${esc(it.buttons.join('、'))}" data-page="${esc(it.page)}" data-definition="${esc(it.definition)}" style="background:${bg}">
          <div>
            <div class="heat-btn">${esc(it.metric)}</div>
            <div class="heat-metric">${esc(it.page)}</div>
          </div>
          <div class="heat-rate">${esc(it.rateLabel)}</div>
          <div class="heat-buttons">${it.buttons.slice(0, 4).map((b) => `<span class="heat-pill">${esc(b)}</span>`).join('')}</div>
        </div>
      `;
    }).join('') : '<div class="empty">当前页面暂无可展示的按钮热力图</div>';
    buttonHeatmapEl.querySelectorAll('.heat-item').forEach((item) => {
      const show = (x, y) => {
        heatTooltipEl.hidden = false;
        heatTooltipEl.innerHTML = `
          <div class="t1">${esc(item.dataset.title || '')}</div>
          <div>${esc(item.dataset.rate || '')} · ${esc(item.dataset.page || '')}</div>
          <div class="t2">按钮：${esc(item.dataset.buttons || '')}</div>
          <div class="t2">说明：${esc(item.dataset.definition || '暂无说明')}</div>
        `;
        const width = heatTooltipEl.offsetWidth || 280;
        const height = heatTooltipEl.offsetHeight || 120;
        const left = Math.min(window.innerWidth - width - 12, x + 14);
        const top = Math.min(window.innerHeight - height - 12, y + 14);
        heatTooltipEl.style.left = `${Math.max(12, left)}px`;
        heatTooltipEl.style.top = `${Math.max(12, top)}px`;
      };
      item.addEventListener('mouseenter', (e) => show(e.clientX, e.clientY));
      item.addEventListener('mousemove', (e) => show(e.clientX, e.clientY));
      item.addEventListener('mouseleave', () => { heatTooltipEl.hidden = true; });
    });
    buttonTableEl.innerHTML = buttonItems.length ? `
      <table>
        <thead><tr><th>指标块</th><th>点击率</th><th>涉及按钮</th><th>说明</th></tr></thead>
        <tbody>
          ${buttonItems.map((it) => {
            const width = Math.max(8, Math.round(Math.min(1, it.rate / 0.4) * 100));
            return `<tr><td>${esc(it.metric)}</td><td>${esc(it.rateLabel)}</td><td>${esc(it.buttons.join('、'))}</td><td><div class="button-meter"><span style="width:${width}%"></span></div><div class="meta">${esc(it.definition || '暂无说明')}</div></td></tr>`;
          }).join('')}
        </tbody>
      </table>
    ` : '<div class="empty">当前页面暂无按钮点击率明细</div>';
    thumbsEl.innerHTML = candidates.slice(0, 12).map((it, idx) => `<button class="thumb ${idx === state.imageIndex ? 'active' : ''}" data-i="${idx}" title="${esc(it.level2)}"><img src="${esc(it.src)}" alt=""></button>`).join('');
    thumbsEl.querySelectorAll('.thumb').forEach((btn) => {
      btn.onclick = () => {
        state.imageIndex = Number(btn.dataset.i);
        renderImagePanel(rows);
      };
    });
  }

  function renderMetricCards(rows) {
    metricCountEl.textContent = `${rows.length} 项`;
    metricCardsEl.className = 'metric-grid';
    metricCardsEl.innerHTML = rows.sort((a, b) => a.id.localeCompare(b.id)).map((m) => `
      <article class="metric-card">
        <div class="metric-top"><div class="metric-title">${esc(m.metric)}</div><span class="tag">${esc(m.type)}</span></div>
        <div class="metric-value">${esc(m.display)}</div>
        <div class="meta">${esc(m.definition || m.involved || '暂无定义')}</div>
        <div class="path">${esc(m.level1)} / ${esc(m.level2Display)} / ${esc(m.pageDisplay)}</div>
      </article>
    `).join('') || '<div class="empty">没有匹配指标</div>';
  }

  function render() {
    setupModeButtons();
    renderFilters();
    const rows = metricAgg(filteredMetrics());
    const pageRows = metricAgg(filteredMetrics({ ignoreType: true }));
    renderKpis(rows);
    renderPageKpis(pageRows);
    renderWarnings(rows);
    renderFunnel();
    renderSource();
    renderImagePanel(pageRows);
    renderMetricCards(rows);
    funnelSelectEl.innerHTML = (state.authMode === 'personal'
      ? ['个人手机号认证', '个人身份证认证', '个人银行卡认证']
      : ['企业证件认证', '对公打款认证']
    ).map((v) => `<option value="${esc(v)}" ${v === state.funnel ? 'selected' : ''}>${esc(v)}</option>`).join('');
    funnelSelectEl.onchange = () => {
      state.funnel = funnelSelectEl.value;
      renderFunnel();
    };
  }

  metricModalEl.addEventListener('click', (e) => {
    if (e.target && e.target.dataset && e.target.dataset.close) closeMetricModal();
  });
  metricModalCloseEl.onclick = closeMetricModal;
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !metricModalEl.hidden) closeMetricModal();
  });

  render();
})();
