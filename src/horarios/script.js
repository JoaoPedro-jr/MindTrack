document.addEventListener("DOMContentLoaded", function (event) {

  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId)


    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener('click', () => {

        nav.classList.toggle('show')

        toggle.classList.toggle('bx-x')

        bodypd.classList.toggle('body-pd')

        headerpd.classList.toggle('body-pd')
      })
    }
  }

  showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')


  const linkColor = document.querySelectorAll('.nav_link')

  function colorLink() {
    if (linkColor) {
      linkColor.forEach(l => l.classList.remove('active'))
      this.classList.add('active')
    }
  }
  linkColor.forEach(l => l.addEventListener('click', colorLink))

});

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById('graficoEstudos').getContext('2d');

  const studyData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Minutos estudados',
      data: [120, 90, 45, 60, 30, 180, 0],
      backgroundColor: [
        '#2E4A42', // Seg
        '#4CAF50', // Ter
        '#81C784', // Qua
        '#A5D6A7', // Qui
        '#C8E6C9', // Sex
        '#8BC34A', // Sáb
        '#E8F5E9'  // Dom
      ],
      borderRadius: 8,
    }]
  };

  const config = {
    type: 'bar',
    data: studyData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  };

  new Chart(ctx, config);
});




document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById('graficoPizza').getContext('2d');
  const studyMinutes = [120, 90, 45, 60, 30, 180, 0]; // Dados dos dias

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
        '#2E4A42', // Segunda
        '#4CAF50', // Terça
        '#81C784', // Quarta
        '#A5D6A7', // Quinta
        '#C8E6C9', // Sexta
        '#8BC34A', // Sábado
        '#E8F5E9'  // Domingo
      ],
      borderWidth: 0
    }]
  };

  const config = {
    type: 'pie',
    data: pizzaData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 0 // Remove qualquer espaço extra interno do Chart.js
      },
      plugins: {
        legend: {
          display: false // Remove legenda interna duplicada
        },
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

  new Chart(ctx, config);
});