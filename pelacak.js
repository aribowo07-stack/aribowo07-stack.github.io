/*
 * Pelacak kunjungan portofolio (Umami Cloud).
 *
 * - Website ID cukup diisi DI SINI. Selama masih "ISI-...", tidak ada yang dikirim.
 * - Penerima dibedakan lewat tautan ?dari=nama (huruf kecil, angka, tanda minus).
 *   Penanda itu disimpan di peramban penerima, lalu ditempelkan ke SETIAP halaman
 *   yang ia buka sesudahnya (termasuk layar demo), sebagai tag dan distinct ID.
 * - Kunjungan sendiri: buka sekali https://aribowo07-stack.github.io/?abaikan=saya
 *   di tiap peramban/HP milik sendiri. Batalkan dengan ?abaikan=tidak.
 * - data-domains membuat server lokal (localhost) tidak pernah tercatat.
 */
(function () {
  var ID = '71df8c03-4fc6-4928-8cbb-f15b0895d068';
  var DOMAIN = 'aribowo07-stack.github.io';
  var dari = '';

  try {
    var q = new URLSearchParams(location.search);
    if (q.get('abaikan') === 'saya') localStorage.setItem('umami.disabled', '1');
    if (q.get('abaikan') === 'tidak') localStorage.removeItem('umami.disabled');
    dari = (q.get('dari') || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
    if (dari) localStorage.setItem('porto-dari', dari);
    else dari = localStorage.getItem('porto-dari') || '';
  } catch (e) { /* mode privat: penanda hanya berlaku di halaman pertama */ }

  // Tempelkan ?dari= ke alamat yang dilaporkan, supaya tiap halaman bisa
  // dikelompokkan per penerima walau tampilan "tag" tidak tersedia di paket gratis.
  // Nilai yang sudah ada di alamat (mis. ?dari=PT-Contoh!) DISERAGAMKAN dengan
  // versi bersihnya, supaya satu penerima tidak terpecah jadi dua baris di dasbor.
  window.portoSebelumKirim = function (jenis, data) {
    if (!dari || !data || typeof data.url !== 'string') return data;
    var i = data.url.indexOf('#');
    var dasar = i < 0 ? data.url : data.url.slice(0, i);
    var hash = i < 0 ? '' : data.url.slice(i);
    if (/[?&]dari=/.test(dasar)) dasar = dasar.replace(/([?&])dari=[^&]*/, '$1dari=' + dari);
    else dasar += (dasar.indexOf('?') < 0 ? '?' : '&') + 'dari=' + dari;
    data.url = dasar + hash;
    return data;
  };

  if (ID.indexOf('ISI-') === 0) return;
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://cloud.umami.is/script.js';
  s.setAttribute('data-website-id', ID);
  s.setAttribute('data-domains', DOMAIN);
  s.setAttribute('data-before-send', 'portoSebelumKirim');
  if (dari) {
    s.setAttribute('data-tag', dari);
    s.setAttribute('data-distinct-id', 'dari-' + dari);
  }
  document.head.appendChild(s);
})();
