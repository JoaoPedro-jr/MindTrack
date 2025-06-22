function getUserPrefix() {
  return localStorage.getItem('usuarioLogado') || 'anonimo';
}

let metaEditandoIndex = null;

function getMetas() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_metasMindTrack`) || '[]');
}

function setMetas(metas) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_metasMindTrack`, JSON.stringify(metas));
}

function getFavorita() {
  const prefix = getUserPrefix();
  return Number(localStorage.getItem(`${prefix}_metaFavorita`));
}

function setFavorita(idx) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_metaFavorita`, idx);
}

function getMetasConcluidas() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_metasConcluidas`) || '[]');
}

function setMetasConcluidas(metas) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_metasConcluidas`, JSON.stringify(metas));
}

function renderMetas() {
  const cards = document.querySelector('.cards');
  cards.innerHTML = '';
  const favorita = getFavorita();
  getMetas().forEach((meta, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>Meta ${meta.tipo}</h3>
      <p>Total de horas: <span class="highlight">${meta.horas} horas</span></p>
      <div class="card-actions">
        <button class="btn-icon btn-fav${favorita === idx ? ' favorita' : ''}" title="Favoritar"><i class="bx bx-star"></i></button>
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

    card.querySelector('.btn-remove').onclick = () => {
      const metas = getMetas();
      metas.splice(idx, 1);
      setMetas(metas);
      renderMetas();
      renderMetasConcluidas();
    };

    card.querySelector('.btn-fav').onclick = () => {
      setFavorita(idx);
      window.location.href = "estatisticas.html";
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
  renderMetasConcluidas();
}

// --- NOVO: Função para concluir meta automaticamente ao atingir 0 horas ---
// Chame esta função ao registrar tempo de estudo na tela de estatísticas!
function concluirMetaSeNecessario() {
  const metas = getMetas();
  let alterou = false;
  metas.forEach((meta, idx) => {
    if (Number(meta.horas) <= 0) {
      // Adiciona ao array de concluídas
      const concluidas = getMetasConcluidas();
      concluidas.push(meta);
      setMetasConcluidas(concluidas);
      // Remove das metas ativas
      metas.splice(idx, 1);
      alterou = true;
    }
  });
  if (alterou) {
    setMetas(metas);
    renderMetas();
    renderMetasConcluidas();
  }
}

function renderMetasConcluidas() {
  const qtd = getMetasConcluidas().length;
  document.querySelectorAll('.card').forEach(card => {
    const h2 = card.querySelector('h2');
    if (h2 && h2.textContent.toLowerCase().includes('metas concluídas')) {
      const valor = card.querySelector('.valor');
      const small = card.querySelector('small');
      if (valor) valor.textContent = qtd;
      if (small) small.textContent = qtd === 1
        ? 'Você já completou 1 meta!'
        : `Você já completou ${qtd} metas!`;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderMetas();
  renderMetasConcluidas();

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