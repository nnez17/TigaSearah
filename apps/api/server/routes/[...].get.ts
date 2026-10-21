import { defineEventHandler, setResponseStatus } from "h3";

export default defineEventHandler((event) => {
	setResponseStatus(event, 404);
	return '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Halaman Tidak Ditemukan — Tiga Searah</title><style>body{margin:0;background:#0b0d10;color:#f2f3f0;font:16px/1.7 system-ui,sans-serif;min-height:100vh;display:grid;place-items:center}main{padding:40px;max-width:680px}img{width:70px;height:70px}small,a{color:#369cff}h1{font-size:clamp(45px,8vw,80px);line-height:1.1;letter-spacing:-.06em}p{color:#a5aeb9}a{display:inline-block;margin-top:20px;text-underline-offset:5px}a:focus-visible{outline:2px solid #369cff;outline-offset:8px}</style></head><body><main><img src="/images/tiga-searah.webp" alt="Tiga Searah"><p><small>404 / A DIFFERENT DIRECTION</small></p><h1>Sepertinya<br>beda arah.</h1><p>Halaman yang kamu cari tidak ditemukan.</p><a href="/">Kembali ke beranda ↗</a></main></body></html>';
});
