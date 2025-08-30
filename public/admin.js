/* Admin-only operations — per-row toggles */
const API_BASE = 'http://localhost:3000/api';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const el = (id) => document.getElementById(id);

async function fetchJSON(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error((await res.json())?.message || res.statusText);
  return res.json();
}

function liForItem(item) {
  const li = document.createElement('li');
  li.dataset.itemId = item._id;
  const nameSpan = document.createElement('span');
  nameSpan.textContent = item.name;
  nameSpan.style.flex = '1';
  const right = document.createElement('div');
  right.className = 'row-end';
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = item.isAvailable ? 'available' : 'unavailable';
  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.className = 'switch';
  toggle.checked = !!item.isAvailable;
  toggle.title = 'Toggle availability';
  toggle.addEventListener('change', async () => {
    const adminPass = el('admin-pass-list').value;
    const msg = el('toggle-msg'); msg.textContent=''; msg.className='msg';
    if (!adminPass) {
      msg.textContent = 'Enter admin password to update availability.';
      msg.classList.add('err');
      toggle.checked = !toggle.checked;
      return;
    }
    try {
      await updateAvailability(item._id, toggle.checked, adminPass);
      tag.textContent = toggle.checked ? 'available' : 'unavailable';
      msg.textContent = 'Availability updated';
      msg.classList.add('ok');
    } catch (err) {
      msg.textContent = err.message || 'Failed to update';
      msg.classList.add('err');
      toggle.checked = !toggle.checked;
    }
  });
  right.appendChild(tag);
  right.appendChild(toggle);
  li.appendChild(nameSpan);
  li.appendChild(right);
  return li;
}

function renderAll(list) {
  const ul = el('all-list');
  ul.innerHTML = '';
  list.forEach((item) => ul.appendChild(liForItem(item)));
}

async function loadAll() {
  try {
    const data = await fetchJSON(`${API_BASE}/menu/all`);
    renderAll(data.menu || []);
  } catch (e) {
    el('all-list').innerHTML = '<li>Failed to load items.</li>';
  }
}

async function addItem(e) {
  e.preventDefault();
  const name = el('add-name').value.trim().toLowerCase();
  const isAvailable = el('add-available').checked;
  const adminPass = el('add-pass').value;
  const msg = el('add-msg'); msg.textContent = ''; msg.className = 'msg';

  try {
    const res = await fetch(`${API_BASE}/admin/addItem`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, isAvailable, adminPass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add item');
    msg.textContent = data.message || 'Item added';
    msg.classList.add('ok');
    e.target.reset();
    await loadAll();
  } catch (err) {
    msg.textContent = err.message;
    msg.classList.add('err');
  }
}

async function updateAvailability(itemId, isAvailable, adminPass) {
  const url = `${API_BASE}/admin/updateItem?itemId=${encodeURIComponent(itemId)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ isAvailable, adminPass })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update item');
  }
  return data;
}

document.addEventListener('DOMContentLoaded', () => {
  el('add-form').addEventListener('submit', addItem);
  el('refreshAll').addEventListener('click', loadAll);
  loadAll();
});
