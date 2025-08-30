(() => {
  // Admin-only operations
  const API_BASE = 'http://localhost:3000/api';
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  const el = (id) => document.getElementById(id);

  async function fetchJSON(url) {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error((await res.json())?.message || res.statusText);
    return res.json();
  }

  function renderAll(list) {
    const ul = el('all-list');
    ul.innerHTML = '';
    list.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `${item.name}<span class="tag">${item.isAvailable ? 'available' : 'unavailable'}</span>`;
      ul.appendChild(li);
    });
  }

  async function loadAll() {
    try {
      const data = await fetchJSON(`${API_BASE}/menu/all`);
      renderAll(data.menu || []);
    } catch {
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

  async function toggleItem(e) {
    e.preventDefault();
    const name = el('toggle-name').value.trim().toLowerCase();
    const isAvailable = el('toggle-available').checked;
    const adminPass = el('toggle-pass').value;
    const msg = el('toggle-msg'); msg.textContent = ''; msg.className = 'msg';

    try {
      const res = await fetch(`${API_BASE}/admin/updateItem`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, isAvailable, adminPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update item');
      msg.textContent = data.message || 'Item updated';
      msg.classList.add('ok');
      await loadAll();
    } catch (err) {
      msg.textContent = err.message;
      msg.classList.add('err');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    el('add-form').addEventListener('submit', addItem);
    el('toggle-form').addEventListener('submit', toggleItem);
    el('refreshAll').addEventListener('click', loadAll);
    loadAll();
  });
})();
