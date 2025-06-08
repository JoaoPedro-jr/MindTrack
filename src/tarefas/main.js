
function getTarefas() {
  return JSON.parse(localStorage.getItem('tarefasMindTrack') || '[]');
}
function setTarefas(tarefas) {
  localStorage.setItem('tarefasMindTrack', JSON.stringify(tarefas));
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


    span.ondblclick = () => {
      if (tarefa.completa) return;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = tarefa.titulo;
      input.onblur = () => {
        tarefa.titulo = input.value.trim() || tarefa.titulo;
        setTarefas(tarefas);
        renderTarefas();
      };
      input.onkeydown = e => {
        if (e.key === 'Enter') input.blur();
      };
      li.replaceChild(input, span);
      input.focus();
    };

    li.appendChild(span);


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


document.getElementById('addTaskButton').onclick = () => {
  const titulo = prompt('Digite o nome da tarefa:');
  if (titulo && titulo.trim()) {
    const tarefas = getTarefas();
    tarefas.push({ titulo: titulo.trim(), favorita: false, completa: false });
    setTarefas(tarefas);
    renderTarefas();
  }
};


document.addEventListener('DOMContentLoaded', renderTarefas);