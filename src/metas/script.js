let metaEditandoIndex = null;

function getMetas() {
  return JSON.parse(localStorage.getItem('metas')) || [];
}

function setMetas(metas) {
  localStorage.setItem('metas', JSON.stringify(metas));
}

function renderMetas() {
  const cards = document.querySelector('.cards');
  cards.innerHTML = '';
  getMetas().forEach((meta, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>Meta ${meta.tipo}</h3>
      <p>Total de horas: <span class="highlight">${meta.horas} horas</span></p>
      <div class="card-actions">
        <button class="btn-icon btn-edit"><i class="bx bx-pencil"></i></button>
        <button class="btn-icon btn-remove"><i class="bx bx-trash"></i></button>
      </div>
    `;


    card.querySelector('.btn-edit').onclick = () => {
      metaEditandoIndex = idx;
      document.getElementById('tipo-meta').value = meta.tipo.toLowerCase();
      document.getElementById('horas-meta').value = meta.horas;
      document.getElementById('modal-meta').style.display = 'flex';
      document.getElementById('salvar-meta').textContent = 'Salvar';
    };

    // Remover meta
    card.querySelector('.btn-remove').onclick = () => {
      const metas = getMetas();
      metas.splice(idx, 1);
      setMetas(metas);
      renderMetas();
    };

    cards.appendChild(card);
  });
}

function adicionarOuEditarMeta(tipo, horas) {
  const metas = getMetas();
  if (metaEditandoIndex !== null) {
   
    metas[metaEditandoIndex] = { tipo, horas };
    metaEditandoIndex = null;
    document.getElementById('salvar-meta').textContent = 'Adicionar';
  } else {
    
    metas.push({ tipo, horas });
  }
  setMetas(metas);
  renderMetas();
}

document.addEventListener('DOMContentLoaded', () => {
  renderMetas();

  document.querySelector('.btn-add').onclick = () => {
    metaEditandoIndex = null;
    document.getElementById('tipo-meta').value = 'semanal';
    document.getElementById('horas-meta').value = 1;
    document.getElementById('modal-meta').style.display = 'flex';
    document.getElementById('salvar-meta').textContent = 'Adicionar';
  };

  document.getElementById('cancelar-meta').onclick = () => {
    document.getElementById('modal-meta').style.display = 'none';
    metaEditandoIndex = null;
    document.getElementById('salvar-meta').textContent = 'Adicionar';
  };

  document.getElementById('salvar-meta').onclick = () => {
    const tipo = document.getElementById('tipo-meta').value;
    const horas = document.getElementById('horas-meta').value;
    adicionarOuEditarMeta(tipo.charAt(0).toUpperCase() + tipo.slice(1), horas);
    document.getElementById('modal-meta').style.display = 'none';
  };
});
let metaEditando = null;

function getMetas() {
  return JSON.parse(localStorage.getItem('metas')) || [];
}

function setMetas(metas) {
  localStorage.setItem('metas', JSON.stringify(metas));
}

function getFavorita() {
  return localStorage.getItem('metaFavorita') || null;
}

function setFavorita(idx) {
  localStorage.setItem('metaFavorita', idx);
}

function renderMetas() {
  const cards = document.querySelector('.cards');
  cards.innerHTML = '';
  const metas = getMetas();
  const favorita = getFavorita();

  metas.forEach((meta, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>Meta ${meta.tipo}</h3>
      <p>Total de horas: <span class="highlight">${meta.horas} horas</span></p>
      <div class="card-actions">
        <button class="btn-icon btn-fav">${favorita == idx ? '<i class="bx bxs-star"></i>' : '<i class="bx bx-star"></i>'}</button>
        <button class="btn-icon btn-edit"><i class="bx bx-pencil"></i></button>
        <button class="btn-icon btn-remove"><i class="bx bx-trash"></i></button>
      </div>
    `;

    // Favoritar meta
    card.querySelector('.btn-fav').onclick = () => {
      setFavorita(idx);
      renderMetas();
    };

    // Editar meta
    card.querySelector('.btn-edit').onclick = () => {
      metaEditando = idx;
      document.getElementById('tipo-meta').value = meta.tipo.toLowerCase();
      document.getElementById('horas-meta').value = meta.horas;
      document.getElementById('modal-meta').style.display = 'flex';
      document.getElementById('salvar-meta').textContent = 'Salvar';
    };

    // Remover meta
    card.querySelector('.btn-remove').onclick = () => {
      metas.splice(idx, 1);
      setMetas(metas);

      if (favorita == idx) setFavorita(null);
      renderMetas();
    };

    cards.appendChild(card);
  });
}

function adicionarOuEditarMeta(tipo, horas) {
  const metas = getMetas();
  if (metaEditando !== null) {
    metas[metaEditando] = { tipo, horas };
    metaEditandoIndex = null;
    document.getElementById('salvar-meta').textContent = 'Adicionar';
  } else {
    metas.push({ tipo, horas });
  }
  setMetas(metas);
  renderMetas();
}

document.addEventListener('DOMContentLoaded', () => {
  renderMetas();

  document.querySelector('.btn-add').onclick = () => {
    metaEditando = null;
    document.getElementById('tipo-meta').value = 'semanal';
    document.getElementById('horas-meta').value = 1;
    document.getElementById('modal-meta').style.display = 'flex';
    document.getElementById('salvar-meta').textContent = 'Adicionar';
  };

  document.getElementById('cancelar-meta').onclick = () => {
    document.getElementById('modal-meta').style.display = 'none';
    metaEditando = null;
    document.getElementById('salvar-meta').textContent = 'Adicionar';
  };

  document.getElementById('salvar-meta').onclick = () => {
    const tipo = document.getElementById('tipo-meta').value;
    const horas = document.getElementById('horas-meta').value;
    adicionarOuEditarMeta(tipo.charAt(0).toUpperCase() + tipo.slice(1), horas);
    document.getElementById('modal-meta').style.display = 'none';
  };
});