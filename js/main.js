/* ============================================================
  R Design - JavaScript

  機能一覧:
  ─────────────────────────────────
  1. ヘッダー: スクロールでスタイル変更
  2. ハンバーガーメニュー: スマホ用ドロワー開閉
  3. スクロールアニメーション: Intersection Observer
  4. スムーズスクロール: ヘッダー高さを考慮したオフセット補正
  5. モバイルナビ: リンクをタップで自動クローズ
  6. フォーム: ダミー送信ハンドリング
  7. フッター: 著作権年を自動更新
============================================================ */

/* DOMが読み込まれたら実行 */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
    定数・要素取得
  ---------------------------------------------------------- */
  const HEADER_HEIGHT = 64; // ヘッダーの高さ（px）— CSS側と合わせてください

  const header     = document.getElementById('header');
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('drawer');


  /* ----------------------------------------------------------
    1. ヘッダー: スクロールでスタイル変更
       スクロール位置が 40px を超えたら .is-scrolled を付与
  ---------------------------------------------------------- */
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初回実行（リロード時の位置対応）
  }


  /* ----------------------------------------------------------
    2. ハンバーガーメニュー
       ボタンクリックで .is-open を切り替え
  ---------------------------------------------------------- */
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      drawer.classList.toggle('is-open', isOpen);

      // アクセシビリティ属性の更新
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');

      // ドロワーが開いている間は背面スクロールを無効化
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }


  /* ----------------------------------------------------------
    3. スクロールアニメーション（Intersection Observer）
       .js-fade クラスを持つ要素が画面に入ると .is-visible を付与
  ---------------------------------------------------------- */
  const fadeTargets = document.querySelectorAll('.js-fade');

  if (fadeTargets.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // 一度表示されたら監視を解除（パフォーマンス最適化）
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,              // 要素の12%が見えたらトリガー
      rootMargin: '0px 0px -40px 0px' // 画面下端より少し手前でトリガー
    });

    fadeTargets.forEach(el => fadeObserver.observe(el));
  }


  /* ----------------------------------------------------------
    4. スムーズスクロール
       ページ内アンカーリンクのクリックで、
       ヘッダー高さ分だけオフセットしてスクロール
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      // "#" のみ（ページトップ）
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // 対象要素が存在する場合
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const targetY = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      }
    });
  });


  /* ----------------------------------------------------------
    5. モバイルナビ: リンクタップで自動クローズ
  ---------------------------------------------------------- */
  if (drawer && hamburger) {
    const drawerLinks = drawer.querySelectorAll('a');

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        drawer.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'メニューを開く');
        document.body.style.overflow = '';
      });
    });
  }


  /* ----------------------------------------------------------
    6. フォーム: ダミー送信ハンドリング
       ★ Formspreeなどを設定したらこのブロックは不要です
       action属性に送信先URLを設定するだけで動作します
  ---------------------------------------------------------- */
  const form = document.querySelector('.contact-form');

  if (form) {
    form.addEventListener('submit', e => {
      // action属性がダミー（"#"）の場合のみインターセプト
      if (form.getAttribute('action') === '#') {
        e.preventDefault();
        alert(
          '⚠️ これはダミーフォームです。\n\n' +
          'お問い合わせはLINEまたはInstagram DMよりお願いします。\n\n' +
          '【フォームを実際に動作させるには】\n' +
          'Formspree（https://formspree.io/）にアクセスして\n' +
          '取得したURLをformタグのaction属性に設定してください。'
        );
      }
    });
  }


  /* ----------------------------------------------------------
    7. フッター著作権年を自動更新
       span#year に現在の年を挿入
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = `© ${new Date().getFullYear()}`;
  }


}); // DOMContentLoaded end
