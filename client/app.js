// 년도
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();


// 데모용 문의 폼 핸들러
const form = document.getElementById('contact-form');
if (form) {
form.addEventListener('submit', (e) => {
e.preventDefault();
const [name, email, message] = Array.from(form.querySelectorAll('input, textarea')).map(i => i.value);
console.log('CONTACT DEMO =>', { name, email, message });
alert('문의가 접수되었습니다 (데모). 콘솔을 확인하세요.');
form.reset();
});
}


async function fetchAndRender() {
// 서비스
const services = await fetch('/api/content/public?type=service').then(r => r.json());
const sWrap = document.getElementById('services-list');
if (sWrap) {
sWrap.innerHTML = services.map(s => `
<div class="card">
<h3 class="font-semibold text-lg">${s.title}</h3>
<p class="text-gray-600 text-sm mt-2">${s.body ?? ''}</p>
</div>`).join('');
}


// 포트폴리오
const portfolio = await fetch('/api/content/public?type=portfolio').then(r => r.json());
const pWrap = document.getElementById('portfolio-list');
if (pWrap) {
pWrap.innerHTML = portfolio.map(p => `
<div class="card">
${p.images?.[0] ? `<img src="${p.images[0]}" alt="" class="w-full h-40 object-cover rounded-md mb-3"/>` : ''}
<h3 class="font-semibold text-lg">${p.title}</h3>
<p class="text-gray-600 text-sm mt-2">${p.body ?? ''}</p>
</div>`).join('');
}


// 회사소개(첫 번째 항목만 사용)
const about = await fetch('/api/content/public?type=about').then(r => r.json());
const aWrap = document.getElementById('about-content');
if (aWrap && about[0]) {
aWrap.innerHTML = `<p>${about[0].body ?? ''}</p>`;
}
}


fetchAndRender();