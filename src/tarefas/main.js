function getUserPrefix() {
  return localStorage.getItem('usuarioLogado') || 'anonimo';
}

function getTarefas() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_tarefas`) || '[]');
}

function setTarefas(tarefas) {
  const prefix = getUserPrefix();
  localStorage.setItem(`${prefix}_tarefas`, JSON.stringify(tarefas));
}

function renderTarefas() {
  const tarefas = getTarefas();
  const ulFavoritas = document.getElementById('favoriteTasks');
  const ulNormais = document.getElementById('taskList');
  const ulCompletas = document.getElementById('completeTasks');
  ulFavoritas.innerHTML = '';
  ulNormais.innerHTML = '';
  ulCompletas.innerHTML = '';

  tarefas.forEach((tarefa, idx) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = tarefa.titulo;
    if (tarefa.completa) span.classList.add('tarefa-completa');
    if (tarefa.favorita) span.classList.add('tarefa-favorita');

    // Edição inline por duplo clique
    span.ondblclick = () => editarTarefa(li, span, tarefa, tarefas);

    li.appendChild(span);

    // Botão Editar (ícone de lápis)
    if (!tarefa.completa) {
      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn btn-edit';
      btnEdit.title = 'Editar';
      btnEdit.innerHTML = "<i class='bx bx-pencil'></i>";
      btnEdit.onclick = () => editarTarefa(li, span, tarefa, tarefas);
      li.appendChild(btnEdit);
    }

    // Botão Favoritar
    const btnFav = document.createElement('button');
    btnFav.className = 'btn btn-favorite' + (tarefa.favorita ? ' active' : '');
    btnFav.title = tarefa.favorita ? 'Desfavoritar' : 'Favoritar';
    btnFav.innerHTML = "<i class='bx bxs-star'></i>";
    btnFav.onclick = () => {
      tarefa.favorita = !tarefa.favorita;
      setTarefas(tarefas);
      renderTarefas();
    };
    li.appendChild(btnFav);

    // Botão Completar
    if (!tarefa.completa) {
      const btnComp = document.createElement('button');
      btnComp.className = 'btn btn-success';
      btnComp.title = 'Concluir';
      btnComp.innerHTML = "<i class='bx bx-check'></i>";
      btnComp.onclick = () => {
        tarefa.completa = true;
        tarefa.favorita = false;
        setTarefas(tarefas);
        renderTarefas();
      };
      li.appendChild(btnComp);
    }

    // Botão Excluir
    const btnDel = document.createElement('button');
    btnDel.className = 'btn btn-danger';
    btnDel.title = 'Excluir';
    btnDel.innerHTML = "<i class='bx bx-trash'></i>";
    btnDel.onclick = () => {
      if (confirm('Excluir esta tarefa?')) {
        tarefas.splice(idx, 1);
        setTarefas(tarefas);
        renderTarefas();
      }
    };
    li.appendChild(btnDel);

    // Distribuição nas listas
    if (tarefa.completa) {
      ulCompletas.appendChild(li);
    } else if (tarefa.favorita) {
      ulFavoritas.appendChild(li);
    } else {
      ulNormais.appendChild(li);
    }
  });
}

// Função de edição (input aparece no lugar do texto)
function editarTarefa(li, span, tarefa, tarefas) {
  if (tarefa.completa) return;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = tarefa.titulo;
  input.className = 'edit-input';
  input.onblur = salvar;
  input.onkeydown = e => {
    if (e.key === 'Enter') input.blur();
    if (e.key === 'Escape') cancelar();
  };
  li.replaceChild(input, span);
  input.focus();

  function salvar() {
    const novoTitulo = input.value.trim();
    if (novoTitulo) {
      tarefa.titulo = novoTitulo;
      setTarefas(tarefas);
    }
    renderTarefas();
  }
  function cancelar() {
    renderTarefas();
  }
}

// Adicionar nova tarefa
document.getElementById('addTaskButton').onclick = () => {
  const titulo = prompt('Digite o nome da tarefa:');
  if (titulo && titulo.trim()) {
    const tarefas = getTarefas();
    tarefas.push({ titulo: titulo.trim(), favorita: false, completa: false });
    setTarefas(tarefas);
    renderTarefas();
  }
};

// Inicialização
document.addEventListener('DOMContentLoaded', renderTarefas);