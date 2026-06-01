/* ============================================================
  R Design - JavaScript

  機能一覧:
  1. ヘッダー: スクロールでスタイル変更
  2. ハンバーガーメニュー
  3. スクロールアニメーション（Intersection Observer）
  4. スムーズスクロール
  5. モバイルナビ: リンクタップで自動クローズ
  6. フッター: 著作権年を自動更新
  7. 開業診断（リアルタイム結果表示）
  8. セルフ見積もり（パック自動判定）
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const HEADER_H = 64;

  /* ----------------------------------------------------------
    1. ヘッダー: スクロールでスタイル変更
  ---------------------------------------------------------- */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ----------------------------------------------------------
    2. ハンバーガーメニュー
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      drawer.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }


  /* ----------------------------------------------------------
    3. スクロールアニメーション（Intersection Observer）
  ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.js-fade');
  if (fadeEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => obs.observe(el));
  }


  /* ----------------------------------------------------------
    4. スムーズスクロール（ヘッダー高さ補正）
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - HEADER_H;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    });
  });


  /* ----------------------------------------------------------
    5. モバイルナビ: リンクタップで自動クローズ
  ---------------------------------------------------------- */
  if (drawer && hamburger) {
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        drawer.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'メニューを開く');
        document.body.style.overflow = '';
      });
    });
  }


  /* ----------------------------------------------------------
    6. フッター著作権年を自動更新
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()}`;


  /* ----------------------------------------------------------
    7. 開業診断（リアルタイム結果表示）

    Q2〜Q5の回答に基づき、おすすめサービスをリアルタイムで表示。
    Q1は状況確認のみ（結果には影響しない）。
  ---------------------------------------------------------- */
  const DIAG_SERVICES = [
    { q: 'dq2', val: 'no', key: 'hp',        label: '🖥️ ホームページ制作' },
    { q: 'dq3', val: 'no', key: 'google',    label: '📍 Googleマップ登録サポート' },
    { q: 'dq4', val: 'no', key: 'line',      label: '💬 LINE公式アカウント構築' },
    { q: 'dq5', val: 'no', key: 'instagram', label: '📸 Instagram整備' },
  ];

  const diagEmpty = document.getElementById('diagEmpty');
  const diagBody  = document.getElementById('diagBody');
  const diagRecs  = document.getElementById('diagRecs');
  const diagPack  = document.getElementById('diagPack');
  const diagOk    = document.getElementById('diagOk');

  function getRadio(name) {
    const el = document.querySelector(`[name="${name}"]:checked`);
    return el ? el.value : null;
  }

  function updateDiagnosis() {
    // Q2〜Q5が1つでも回答されたら結果表示
    const answered = ['dq2','dq3','dq4','dq5'].some(q => getRadio(q) !== null);
    if (!answered) return;

    // おすすめサービスを収集
    const recs = DIAG_SERVICES.filter(s => getRadio(s.q) === s.val);

    diagEmpty.hidden = true;
    diagBody.hidden  = false;

    if (recs.length === 0) {
      // 全て整っている場合
      diagRecs.innerHTML = '';
      diagPack.hidden = true;
      diagOk.hidden   = false;
    } else {
      diagOk.hidden = true;
      diagRecs.innerHTML = recs
        .map(r => `<li>${r.label}</li>`)
        .join('');

      // 4つ全部必要なら開業スタートパックを提案
      const allCore = ['hp','google','line','instagram'].every(
        k => recs.some(r => r.key === k)
      );
      if (allCore) {
        diagPack.hidden = false;
        diagPack.innerHTML = `
          <div class="diag-result__pack-badge">
            → 開業スタートパック（¥39,800）がおすすめです
          </div>`;
      } else {
        diagPack.hidden = true;
      }
    }
  }

  // ラジオボタン変更を監視
  document.querySelectorAll('[name^="dq"]').forEach(r => {
    r.addEventListener('change', updateDiagnosis);
  });


  /* ----------------------------------------------------------
    8. セルフ見積もり（パック自動判定）

    チェックされたサービスに最適なパックを自動適用し、
    追加オプションと合計金額をリアルタイム表示。
    個人情報入力不要。
  ---------------------------------------------------------- */

  // サービス単価定義
  const EST_ITEMS = {
    hp:        { name: 'ホームページ制作',          price: 19800 },
    google:    { name: 'Googleマップ登録サポート',   price:  5000 },
    line:      { name: 'LINE公式アカウント構築',     price: 10000 },
    instagram: { name: 'Instagramプロフィール整備',  price: 10000 },
    posts:     { name: 'Instagram投稿作成（10本）',  price:  9800 },
    rich_menu: { name: 'LINEリッチメニュー作成',    price:  5000 },
  };

  // パック定義（上に書いたものが優先適用される）
  const EST_PACKS = [
    {
      id:       'startup',
      name:     '開業スタートパック',
      price:    39800,
      requires: ['hp', 'google', 'line', 'instagram'],
    },
    {
      id:       'collection',
      name:     '集客スタートパック',
      price:    24800,
      requires: ['google', 'line', 'instagram'],
    },
  ];

  const estEmpty    = document.getElementById('estEmpty');
  const estBody     = document.getElementById('estBody');
  const estPackArea = document.getElementById('estPackArea');
  const estExtras   = document.getElementById('estExtrasArea');
  const estTotal    = document.getElementById('estTotalNum');

  function calcEstimate(selected) {
    // 最適パックを探す（先に書いた方が優先）
    let pack = null;
    for (const p of EST_PACKS) {
      if (p.requires.every(k => selected.includes(k))) {
        pack = p;
        break;
      }
    }

    const packKeys = pack ? pack.requires : [];
    const extras   = selected.filter(k => !packKeys.includes(k));
    let   total    = pack ? pack.price : 0;

    if (!pack) {
      // パック非適用 → 単品合計
      extras.length === 0; // noop
      selected.forEach(k => { total += EST_ITEMS[k].price; });
      return { pack: null, extras: selected, total };
    }

    extras.forEach(k => { total += EST_ITEMS[k].price; });
    return { pack, extras, total };
  }

  function renderEstimate(selected) {
    if (selected.length === 0) {
      estEmpty.hidden = false;
      estBody.hidden  = true;
      return;
    }

    estEmpty.hidden = false; // 一瞬消す→再表示でアニメーション感を出す
    estEmpty.hidden = true;
    estBody.hidden  = false;

    const { pack, extras, total } = calcEstimate(selected);

    // パック表示
    if (pack) {
      const savings = pack.requires.reduce((s, k) => s + EST_ITEMS[k].price, 0) - pack.price;
      estPackArea.innerHTML = `
        <div class="est-pack">
          <span class="est-pack__badge">おすすめパック</span>
          <p class="est-pack__name">${pack.name}</p>
          <p class="est-pack__price">¥${pack.price.toLocaleString()}</p>
          <p class="est-pack__savings">単品合計より ¥${savings.toLocaleString()} お得</p>
          <ul class="est-pack__includes">
            ${pack.requires.map(k => `<li>✓ ${EST_ITEMS[k].name}</li>`).join('')}
          </ul>
        </div>`;
    } else {
      estPackArea.innerHTML = '';
    }

    // 追加オプション or 単品リスト
    const extraItems = pack ? extras : selected;
    if (extraItems.length > 0) {
      const label = pack ? '＋ オプション追加' : '選択中のサービス';
      estExtras.innerHTML = `
        <div class="est-extras">
          <p class="est-extras__label">${label}</p>
          <ul class="est-extras__list">
            ${extraItems.map(k => `
              <li>
                ${EST_ITEMS[k].name}
                <span>¥${EST_ITEMS[k].price.toLocaleString()}</span>
              </li>`).join('')}
          </ul>
        </div>`;
    } else {
      estExtras.innerHTML = '';
    }

    // 合計
    estTotal.textContent = `¥${total.toLocaleString()} 〜`;
  }

  // チェックボックス変更を監視（即時反映）
  document.querySelectorAll('[name="est"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = Array.from(document.querySelectorAll('[name="est"]:checked'))
        .map(c => c.value);
      renderEstimate(selected);
    });
  });

}); // DOMContentLoaded end
