// --- Funções utilitárias para metas ---
function getMetas() {
  return JSON.parse(localStorage.getItem('metas')) || [];
}
function setMetas(metas) {
  localStorage.setItem('metas', JSON.stringify(metas));
}
function getFavorita() {
  const idx = localStorage.getItem('metaFavorita');
  return idx !== null ? Number(idx) : null;
}
function setFavorita(idx) {
  localStorage.setItem('metaFavorita', idx);
}
function getTempoEstudo() {
  return Number(localStorage.getItem('tempoEstudo')) || 0;
}
function setTempoEstudo(segundos) {
  localStorage.setItem('tempoEstudo', segundos);
}
function formatTime(segundos) {
  const h = String(Math.floor(segundos / 3600)).padStart(2, '0');
  const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
  const s = String(segundos % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// --- Renderização dos cards de metas ---
function renderTempoEstudo() {
  const tempo = getTempoEstudo();
  const el = document.querySelector('.planejamento-card.tempo-estudo .highlight');
  if (el) el.textContent = formatTime(tempo);
}
function renderMetaAtual() {
  const metas = getMetas();
  const favorita = getFavorita();
  const el = document.querySelector('.planejamento-card.meta-atual .highlight');
  if (el) {
    if (favorita !== null && metas[favorita]) {
      el.textContent = `${metas[favorita].horas}:00:00`;
    } else {
      el.textContent = '--:--:--';
    }
  }
}
function renderConclusaoMeta() {
  const metas = getMetas();
  const favorita = getFavorita();
  const tempoEstudo = getTempoEstudo();
  const el = document.querySelector('.planejamento-card.conclusao-meta .highlight');
  if (el) {
    if (favorita !== null && metas[favorita]) {
      const metaSegundos = Number(metas[favorita].horas) * 3600;
      const totalMeta = tempoEstudo + metaSegundos;
      const percent = totalMeta > 0 ? Math.min(100, (tempoEstudo / totalMeta) * 100) : 0;
      el.textContent = `${percent.toFixed(0)}%`;
    } else {
      el.textContent = '--%';
    }
  }
}

// --- Funções utilitárias para matérias ---
function getMaterias() {
  return JSON.parse(localStorage.getItem('materias')) || [];
}
function setMaterias(materias) {
  localStorage.setItem('materias', JSON.stringify(materias));
}

// --- Renderização da lista de matérias ---
function renderMaterias() {
  const ul = document.querySelector('.materias-list');
  if (!ul) return;
  ul.innerHTML = '';
  getMaterias().forEach((mat, idx) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.innerHTML = `
      <span style="flex:1;">${mat}</span>
      <button class="btn-icon btn-edit-materia" title="Editar"><i class='bx bx-pencil'></i></button>
      <button class="btn-icon btn-remove-materia" title="Excluir"><i class='bx bx-trash'></i></button>
    `;
    // Editar matéria
    li.querySelector('.btn-edit-materia').onclick = () => {
      document.getElementById('modal-materia-title').textContent = 'Editar Matéria';
      document.getElementById('nome-materia').value = mat;
      document.getElementById('modal-materia-bg').style.display = 'flex';
      document.getElementById('salvar-materia').onclick = () => {
        const novoNome = document.getElementById('nome-materia').value.trim();
        if (novoNome) {
          const materias = getMaterias();
          materias[idx] = novoNome;
          setMaterias(materias);
          renderMaterias();
          document.getElementById('modal-materia-bg').style.display = 'none';
        }
      };
    };
    // Excluir matéria
    li.querySelector('.btn-remove-materia').onclick = () => {
      if (confirm('Deseja excluir esta matéria?')) {
        const materias = getMaterias();
        materias.splice(idx, 1);
        setMaterias(materias);
        renderMaterias();
      }
    };
    ul.appendChild(li);
  });
}

// --- Inicialização e eventos ---
document.addEventListener('DOMContentLoaded', () => {
  // Render cards e matérias ao carregar
  renderTempoEstudo();
  renderMetaAtual();
  renderConclusaoMeta();
  renderMaterias();

  // Modal de estudo
  const btnRegistro = document.querySelector('.btn-registro');
  if (btnRegistro) {
    btnRegistro.onclick = () => {
      document.getElementById('modal-estudo-bg').style.display = 'flex';
    };
  }
  const btnCancelarEstudo = document.getElementById('cancelar-estudo');
  if (btnCancelarEstudo) {
    btnCancelarEstudo.onclick = () => {
      document.getElementById('modal-estudo-bg').style.display = 'none';
      document.getElementById('tempo-estudo').value = '';
    };
  }
  const btnSalvarEstudo = document.getElementById('salvar-estudo');
  if (btnSalvarEstudo) {
    btnSalvarEstudo.onclick = () => {
      const tempo = document.getElementById('tempo-estudo').value;
      if (!tempo) {
        alert('Por favor, preencha o tempo.');
        return;
      }
      const [h, m, s] = tempo.split(':').map(Number);
      const tempoSegundos = (h || 0) * 3600 + (m || 0) * 60 + (s || 0);

      const metas = getMetas();
      const favorita = getFavorita();

      if (favorita !== null && metas[favorita]) {
        // Só soma tempo se houver meta favorita
        const tempoTotal = getTempoEstudo() + tempoSegundos;
        setTempoEstudo(tempoTotal);

        let metaSegundos = Number(metas[favorita].horas) * 3600;
        metaSegundos = Math.max(0, metaSegundos - tempoSegundos);
        metas[favorita].horas = (metaSegundos / 3600).toFixed(2);

        if (metaSegundos <= 0) {
          alert('Parabéns! Você concluiu sua meta!');
          metas.splice(favorita, 1);
          localStorage.removeItem('metaFavorita');
          setTempoEstudo(0); // Reseta o tempo de estudo ao concluir a meta
        } else {
          alert('Tempo registrado!');
        }
        setMetas(metas);

        renderTempoEstudo();
        renderMetaAtual();
        renderConclusaoMeta();

        document.getElementById('modal-estudo-bg').style.display = 'none';
        document.getElementById('tempo-estudo').value = '';
      } else {
        alert('Favor selecione uma meta favorita antes de registrar estudo!');
      }
    };
  }

  // Modal de matéria - adicionar
  const btnAddMateria = document.querySelector('.btn-add-materia');
  if (btnAddMateria) {
    btnAddMateria.onclick = () => {
      document.getElementById('modal-materia-title').textContent = 'Adicionar Matéria';
      document.getElementById('nome-materia').value = '';
      document.getElementById('modal-materia-bg').style.display = 'flex';
      document.getElementById('salvar-materia').onclick = () => {
        const nome = document.getElementById('nome-materia').value.trim();
        if (nome) {
          const materias = getMaterias();
          materias.push(nome);
          setMaterias(materias);
          renderMaterias();
          document.getElementById('modal-materia-bg').style.display = 'none';
        }
      };
    };
  }
  // Modal de matéria - cancelar
  const btnCancelarMateria = document.getElementById('cancelar-materia');
  if (btnCancelarMateria) {
    btnCancelarMateria.onclick = () => {
      document.getElementById('modal-materia-bg').style.display = 'none';
    };
  }
});