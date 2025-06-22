function getUserPrefix() {
  return localStorage.getItem('usuarioLogado') || 'anonimo';
}

function getMetasConcluidas() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_metasConcluidas`) || '[]');
}

function getStudyMinutes() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_studyMinutes`) || '[0,0,0,0,0,0,0]');
}

function getStreakInfo() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_streakInfo`) || '{"lastDate":null,"streak":0}');
}

function renderEstudoSemana() {
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const studyMinutes = getStudyMinutes();
  const ul = document.getElementById('lista-estudo-semana');
  ul.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const li = document.createElement('li');
    li.textContent = `${diasSemana[i]}: ${studyMinutes[i]} min`;
    ul.appendChild(li);
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

document.addEventListener("DOMContentLoaded", function () {
  renderEstudoSemana();
  renderMetasConcluidas();
  renderStreak();
  

  // Sidebar (mantém seu código)
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('show');
        toggle.classList.toggle('bx-x');
        bodypd.classList.toggle('body-pd');
        headerpd.classList.toggle('body-pd');
      });
    }
  };

  showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');

  const linkColor = document.querySelectorAll('.nav_link');
  function colorLink() {
    if (linkColor) {
      linkColor.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }
  }
  linkColor.forEach(l => l.addEventListener('click', colorLink));

  // --- GRÁFICO DE BARRAS ---
  const ctxBar = document.getElementById('graficoEstudos').getContext('2d');
  const studyMinutes = getStudyMinutes();

  const studyData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Minutos estudados',
      data: studyMinutes,
      backgroundColor: [
        '#2E4A42', '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#8BC34A', '#E8F5E9'
      ],
      borderRadius: 8,
    }]
  };

  const configBar = {
    type: 'bar',
    data: studyData,
    options: {
      scales: { y: { beginAtZero: true } },
      responsive: true,
      maintainAspectRatio: false
    }
  };

  new Chart(ctxBar, configBar);

  // --- GRÁFICO DE PIZZA ---
  const ctxPie = document.getElementById('graficoPizza').getContext('2d');

  function formatarTempoTotal(minutos) {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas}h${minutosRestantes.toString().padStart(2, '0')}min`;
  }

  const totalMinutos = studyMinutes.reduce((acc, val) => acc + val, 0);
  const tempoFormatado = formatarTempoTotal(totalMinutos);

  document.getElementById('totalHoras').textContent = tempoFormatado;

  const pizzaData = {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    datasets: [{
      data: studyMinutes,
      backgroundColor: [
        '#2E4A42', '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#8BC34A', '#E8F5E9'
      ],
      borderWidth: 0
    }]
  };

  const configPie = {
    type: 'pie',
    data: pizzaData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 0 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: ${value} min`;
            }
          }
        }
      }
    }
  };

  new Chart(ctxPie, configPie);
});