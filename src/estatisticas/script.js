// --- Funções utilitárias para metas ---
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
function getMetasConcluidas() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_metasConcluidas`) || '[]');
}
function setMetasConcluidas(metas) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_metasConcluidas`, JSON.stringify(metas));
}

// --- Funções utilitárias para matérias ---
function getMaterias() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_materias`)) || [];
}
function setMaterias(materias) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_materias`, JSON.stringify(materias));
}
function getStudyMinutes() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_studyMinutes`) || '[0,0,0,0,0,0,0]');
}
function setStudyMinutes(arr) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_studyMinutes`, JSON.stringify(arr));
}

// --- Funções utilitárias para streak ---
function getStreakInfo() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_streakInfo`) || '{"lastDate":null,"streak":0}');
}
function setStreakInfo(info) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_streakInfo`, JSON.stringify(info));
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

function renderMetasConcluidas() {
  const qtd = getMetasConcluidas().length;
  document.querySelectorAll('.card').forEach(card => {
    const h2 = card.querySelector('h2');
    if (h2 && h2.textContent.toLowerCase().includes('metas concluídas')) {
      const valor = card.querySelector('.valor');
      const small = card.querySelector('small');
      if (valor) valor.textContent = qtd > 0 ? qtd : '0';
      if (small) small.textContent = qtd === 1
        ? 'Você já completou 1 meta!'
        : qtd > 1
          ? `Você já completou ${qtd} metas!`
          : 'Nenhuma meta concluída ainda';
    }
  });
}

function renderStreak() {
  const streakInfo = getStreakInfo();
  const valor = document.getElementById('streak-valor');
  const small = document.querySelector('#streak-card .streak-data');
  if (valor) valor.textContent = streakInfo.streak > 0 ? streakInfo.streak : '0';
  if (small) {
    if (streakInfo.streak > 1) {
      small.textContent = `Último registro: ${streakInfo.lastDate || '-'}`;
    } else if (streakInfo.streak === 1) {
      small.textContent = `Você estudou hoje!`;
    } else {
      small.textContent = `Nenhum dia seguido ainda`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTempoEstudo();
  renderMetaAtual();
  renderConclusaoMeta();
  renderMaterias();
  renderMetasConcluidas();
  renderStreak();

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
        const tempoTotal = getTempoEstudo() + tempoSegundos;
        setTempoEstudo(tempoTotal);

        let metaSegundos = Number(metas[favorita].horas) * 3600;
        metaSegundos = Math.max(0, metaSegundos - tempoSegundos);
        metas[favorita].horas = (metaSegundos / 3600).toFixed(2);

        // --- ADICIONA META CONCLUÍDA AUTOMATICAMENTE ---
        if (metaSegundos <= 0) {
          const concluidas = getMetasConcluidas();
          concluidas.push(metas[favorita]);
          setMetasConcluidas(concluidas);

          alert('Parabéns! Você concluiu sua meta!');
          metas.splice(favorita, 1);
          setMetas(metas);

          const prefix = getUserPrefix();
          localStorage.removeItem(`${prefix}_metaFavorita`);

          setTempoEstudo(0);
        } else {
          setMetas(metas);
          alert('Tempo registrado!');
        }

        // Atualiza o array de minutos estudados por dia
        const hoje = new Date();
        const diaSemana = hoje.getDay();
        const idx = diaSemana === 0 ? 6 : diaSemana - 1;
        const studyMinutes = getStudyMinutes();
        studyMinutes[idx] += Math.floor(tempoSegundos / 60);
        setStudyMinutes(studyMinutes);

        // --- ATUALIZA O STREAK AQUI ---
        const streakInfo = getStreakInfo();
        const hojeStr = hoje.toISOString().slice(0, 10);
        if (streakInfo.lastDate) {
          const ultima = new Date(streakInfo.lastDate);
          const diffDias = Math.floor((hoje - ultima) / (1000 * 60 * 60 * 24));
          if (diffDias === 1) {
            streakInfo.streak += 1;
          } else if (diffDias > 1) {
            streakInfo.streak = 1;
          }
        } else {
          streakInfo.streak = 1;
        }
        streakInfo.lastDate = hojeStr;
        setStreakInfo(streakInfo);

        renderTempoEstudo();
        renderMetaAtual();
        renderConclusaoMeta();
        renderMetasConcluidas();
        renderStreak();

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
  const btnCancelarMateria = document.getElementById('cancelar-materia');
  if (btnCancelarMateria) {
    btnCancelarMateria.onclick = () => {
      document.getElementById('modal-materia-bg').style.display = 'none';
    };
  }
});