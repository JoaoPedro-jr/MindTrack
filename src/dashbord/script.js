function getUserPrefix() {
  return localStorage.getItem('usuarioLogado') || 'anonimo';
}
function getMetas() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_metasMindTrack`)) || [];
}
function setMetas(metas) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_metasMindTrack`, JSON.stringify(metas));
}
function getFavorita() {
  const prefix = getUserPrefix();
  const idx = localStorage.getItem(`${prefix}_metaFavorita`);
  return idx !== null ? Number(idx) : null;
}
function setFavorita(idx) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_metaFavorita`, idx);
}
function getTempoEstudo() {
  const prefix = getUserPrefix();
  return Number(localStorage.getItem(`${prefix}_tempoEstudo`)) || 0;
}
function setTempoEstudo(segundos) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_tempoEstudo`, segundos);
}
function formatTime(segundos) {
  const h = String(Math.floor(segundos / 3600)).padStart(2, '0');
  const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
  const s = String(segundos % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}
function getMaterias() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_materias`)) || [];
}
function setMaterias(materias) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_materias`, JSON.stringify(materias));
}
function getMetasConcluidas() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_metasConcluidas`) || '[]');
}
function getTarefas() {
  const prefix = getUserPrefix();
  // Aceita tanto objetos quanto strings
  return JSON.parse(localStorage.getItem(`${prefix}_tarefas`) || '[]');
}
function getLembretes() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_lembretes`) || '[]');
}

// --- Renderização dos cards ---
function renderTempoEstudo() {
  const tempo = getTempoEstudo();
  const el = document.getElementById('dashboard-tempo-estudo');
  if (el) el.textContent = formatTime(tempo);
}
function renderMetasConcluidasDashboard() {
  const qtd = getMetasConcluidas().length;
  const el = document.getElementById('dashboard-metas-concluidas');
  if (el) el.textContent = qtd;
}
function renderTotalMateriasDashboard() {
  const qtd = getMaterias().length;
  const el = document.getElementById('dashboard-total-materias');
  if (el) el.textContent = qtd;
}
function renderMaterias() {
  const ul = document.getElementById('dashboard-materias');
  if (!ul) return;
  ul.innerHTML = '';
  getMaterias().forEach((mat, idx) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.innerHTML = `
      <span style="flex:1;">${mat}</span>
      <button class="btn-icon btn-remove-materia" title="Excluir"><i class='bx bx-trash'></i></button>
    `;
    // Excluir matéria
    li.querySelector('.btn-remove-materia').onclick = () => {
      if (confirm('Deseja excluir esta matéria?')) {
        const materias = getMaterias();
        materias.splice(idx, 1);
        setMaterias(materias);
        renderMaterias();
        renderTotalMateriasDashboard();
      }
    };
    ul.appendChild(li);
  });
}
function renderTarefas() {
  const ul = document.getElementById('dashboard-tarefas');
  if (!ul) return;
  ul.innerHTML = '';
  getTarefas()
    .filter(tarefa => !tarefa.completa) // Só tarefas não concluídas
    .forEach(tarefa => {
      const titulo = typeof tarefa === 'string' ? tarefa : tarefa.titulo;
      if (!titulo) return;
      const li = document.createElement('li');
      li.innerHTML = `<span class="status red">Pendente</span> ${titulo}`;
      ul.appendChild(li);
    });
}
function renderLembretes() {
  const ul = document.getElementById('dashboard-lembretes');
  if (!ul) return;
  ul.innerHTML = '';
  getLembretes().forEach(lembrete => {
    const titulo = typeof lembrete === 'string' ? lembrete : lembrete.titulo;
    if (!titulo) return;
    const li = document.createElement('li');
    li.innerHTML = `<span class="status yellow">•</span> ${titulo}`;
    ul.appendChild(li);
  });
}

// --- Inicialização e eventos ---
document.addEventListener('DOMContentLoaded', () => {
  renderTempoEstudo();
  renderMetasConcluidasDashboard();
  renderTotalMateriasDashboard();
  renderMaterias();
  renderTarefas();
  renderLembretes();

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
          renderTotalMateriasDashboard();
          document.getElementById('modal-materia-bg').style.display = 'none';
        }
      };
    };
  }
  const btnCancelarMateria = document.getElementById('cancelar-materia');
  if (btnCancelarMateria) {
    btnCancelarMateria.onclick = () => {
      document.getElementById('modal-materia-bg').style.display = 'none';
    };
  }
});