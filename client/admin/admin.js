const $ = (sel) => document.querySelector(sel);


async function saveModal(e) {
e.preventDefault();
const id = $('#modal').dataset.id;
const payload = {
type: $('#type').value,
title: $('#title').value.trim(),
body: $('#body').value,
published: $('#published').checked,
};


// 이미지 업로드
const file = $('#image').files[0];
if (file) {
const fd = new FormData();
fd.append('image', file);
const ur = await fetch('/api/content/upload', { method: 'POST', credentials: 'include', body: fd });
const { path } = await ur.json();
payload.images = [path];
}


const method = id ? 'PUT' : 'POST';
const url = id ? `/api/content/${id}` : '/api/content';
const r = await fetch(url, {
method,
headers: { 'Content-Type': 'application/json' },
credentials: 'include',
body: JSON.stringify(payload)
});


if (r.ok) {
$('#modal').close();
loadList();
} else {
alert('저장 실패');
}
}


$('#login-form')?.addEventListener('submit', login);
$('#logout')?.addEventListener('click', logout);
$('#createBtn')?.addEventListener('click', () => openModal());
$('#cancel')?.addEventListener('click', () => $('#modal').close());
$('#modal-form')?.addEventListener('submit', saveModal);


// 자동 세션 체크
me().then(({ authenticated, user }) => {
if (authenticated) {
$('#me').textContent = `${user.username} 로그인됨`;
$('#logout').classList.remove('hidden');
$('#editor').classList.remove('hidden');
$('#login-form').classList.add('hidden');
loadList();
}
});