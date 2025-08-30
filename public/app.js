(() => {
  // Frontend logic for Voting page
  const API_BASE = 'http://localhost:3000/api';
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  const el = (id) => document.getElementById(id);

  async function fetchJSON(url) {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error((await res.json())?.message || res.statusText);
    return res.json();
  }

  function renderAll(list, container) {
    container.innerHTML = '';
    list.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `${item.name}<span class="tag">${item.isAvailable ? 'available' : 'unavailable'}</span>`;
      container.appendChild(li);
    });
  }

  async function loadAll() {
    try {
      const data = await fetchJSON(`${API_BASE}/menu/all`);
      const menu = data.menu || [];
      const select = el('menuSelect');
      if (select) {
        select.innerHTML = '<option disabled selected value="">Select an item</option>';
        menu.filter(m => m.isAvailable).forEach((m) => {
          const opt = document.createElement('option');
          opt.value = m._id;
          opt.textContent = m.name;
          select.appendChild(opt);
        });
      }
      const allList = el('all-list');
      if (allList) renderAll(menu, allList);
    } catch (e) {
      const allList = el('all-list');
      if (allList) allList.innerHTML = '<li>Failed to load items.</li>';
    }
  }

  async function loadTop() {
    const limitEl = el('limit');
    const limit = Number(limitEl ? limitEl.value : 3) || 3;
    try {
      const data = await fetchJSON(`${API_BASE}/menu/top?limit=${limit}`);
      const top = data.topItems || [];
      const ul = el('top-list');
      if (!ul) return;
      ul.innerHTML = '';
      if (!top.length) {
        ul.innerHTML = '<li>No votes yet.</li>';
        return;
      }
      top.forEach((t, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${idx + 1}. ${t.name}</span><span class="tag">${t.votes} votes</span>`;
        ul.appendChild(li);
      });
    } catch {
      const ul = el('top-list');
      if (ul) ul.innerHTML = '<li>Failed to load rankings.</li>';
    }
  }

  async function submitVote(e) {
    e.preventDefault();
    const roll = el('roll').value.trim();
    const menuItemId = el('menuSelect').value;
    const msg = el('vote-msg');
    msg.textContent = '';
    msg.className = 'msg';

    if (!roll || !menuItemId) {
      msg.textContent = 'Please enter a roll number and choose an item.';
      msg.classList.add('err');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/vote`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ studentRoll: roll, menuItemId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to vote');
      msg.textContent = data.message || 'Vote submitted!';
      msg.classList.add('ok');
      await loadTop();
    } catch (e) {
      msg.textContent = e.message;
      msg.classList.add('err');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const voteForm = el('vote-form');
    if (voteForm) voteForm.addEventListener('submit', submitVote);
    const refreshTop = el('refreshTop');
    if (refreshTop) refreshTop.addEventListener('click', loadTop);
    loadAll();
    loadTop();
  });
})();
