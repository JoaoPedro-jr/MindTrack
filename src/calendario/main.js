function inicializarCalendario() {
    const calendarioGrid = document.getElementById("calendario-grid");
    const modal = document.querySelector(".modal");
    const inputTitulo = document.getElementById("titulo-evento");
    const selectCor = document.getElementById("cor-evento");
    const btnSalvar = document.getElementById("salvarEventoBtn");
    const btnDesfazer = document.getElementById("desfazerBtn");
    const btnReset = document.getElementById("resetCalendarBtn");
    const btnClose = document.getElementById("closeModalBtn");

    let diaSelecionado = null;
    let historico = [];

  
    function gerarDias() {
        calendarioGrid.innerHTML = '';
    
        calendarioGrid.appendChild(criarSobra());
        for (let i = 1; i <= 5; i++) calendarioGrid.appendChild(criarDia(i));
        calendarioGrid.appendChild(criarSobra());

        for (let i = 6; i <= 12; i++) calendarioGrid.appendChild(criarDia(i));
     
        for (let i = 13; i <= 19; i++) calendarioGrid.appendChild(criarDia(i));
 
        for (let i = 20; i <= 26; i++) calendarioGrid.appendChild(criarDia(i));
      
        for (let i = 27; i <= 31; i++) calendarioGrid.appendChild(criarDia(i));
        calendarioGrid.appendChild(criarSobra());
        calendarioGrid.appendChild(criarSobra());
    }

    function criarDia(numero) {
        const div = document.createElement("div");
        div.className = `dia`;
        div.innerHTML = `<button class="add">+</button><span class="numero">${numero}</span>`;
        return div;
    }
    function criarSobra() {
        const div = document.createElement("div");
        div.className = "sobra";
        div.innerHTML = `<span class="numero"></span><div></div>`;
        return div;
    }


    function atribuirEventosAdd() {
        document.querySelectorAll(".add").forEach((botao) => {
            botao.onclick = function (e) {
                diaSelecionado = e.target.closest(".dia");
                inputTitulo.value = "";
                selectCor.value = "prova";
                modal.style.display = "flex";
            };
        });
    }


    btnClose.onclick = fecharModal;
    function fecharModal() {
        modal.style.display = "none";
    }
    window.fecharModal = fecharModal; 


    btnSalvar.onclick = function () {
        if (!diaSelecionado) return;
        const titulo = inputTitulo.value.trim();
        const cor = selectCor.value;
        if (titulo === "") {
            alert("Digite um título para o evento.");
            return;
        }
  
        diaSelecionado.querySelectorAll(".evento").forEach(e => e.remove());
        const divEvento = document.createElement("div");
        divEvento.classList.add("evento", cor);
        divEvento.textContent = titulo;
        diaSelecionado.appendChild(divEvento);

        const indexDia = Array.from(document.querySelectorAll(".dia")).indexOf(diaSelecionado);
        historico.push({ dia: indexDia, titulo, cor });

        salvarEventosLocalStorage();
        modal.style.display = "none";
    };


    btnDesfazer.onclick = function () {
        if (historico.length === 0) {
            alert("Nada para desfazer.");
            return;
        }
        const ultima = historico.pop();
        const dias = document.querySelectorAll(".dia");
        const dia = dias[ultima.dia];
        const eventos = dia.querySelectorAll(".evento");
        for (let i = eventos.length - 1; i >= 0; i--) {
            if (eventos[i].textContent === ultima.titulo && eventos[i].classList.contains(ultima.cor)) {
                dia.removeChild(eventos[i]);
                break;
            }
        }
        salvarEventosLocalStorage();
    };


    btnReset.onclick = function () {
        if (confirm("Tem certeza que deseja resetar o calendário? Isso apagará todos os eventos.")) {
            localStorage.removeItem('eventosCalendario');
            gerarDias();
            atribuirEventosAdd();
            historico = [];
        }
    };


    function salvarEventosLocalStorage() {
        const dias = document.querySelectorAll(".dia");
        const eventos = [];
        dias.forEach((dia, index) => {
            dia.querySelectorAll(".evento").forEach((evento) => {
                eventos.push({
                    dia: index,
                    titulo: evento.textContent,
                    cor: evento.classList[1] || "default"
                });
            });
        });
        localStorage.setItem("eventosCalendario", JSON.stringify(eventos));
    }

    function carregarEventosLocalStorage() {
        const eventos = JSON.parse(localStorage.getItem("eventosCalendario") || "[]");
        const dias = document.querySelectorAll(".dia");
        eventos.forEach((evento) => {
            if (dias[evento.dia]) {
                const divEvento = document.createElement("div");
                divEvento.classList.add("evento", evento.cor);
                divEvento.textContent = evento.titulo;
                dias[evento.dia].appendChild(divEvento);
            }
        });
    }


    gerarDias();
    atribuirEventosAdd();
    carregarEventosLocalStorage();
}