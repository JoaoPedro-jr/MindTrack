function getUserPrefix() {
  return localStorage.getItem('usuarioLogado') || 'anonimo';
}

document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('adicionar-lembrete');
    let autocomplete;

    function pegarTextoBotao(nome) {
        const el = document.querySelector(`#textos-botoes [data-nome="${nome}"]`);
        return el ? el.textContent.trim() : '';
    }

    let container = document.querySelector('.lembretes-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'lembretes-container';
        const header = document.querySelector('.lembrete-header');
        header.insertAdjacentElement('afterend', container);
    }

    function salvarLembretes() {
        const lembretes = [];
        container.querySelectorAll('.card').forEach(card => {
            if (card.tagName.toLowerCase() === 'form') return;

            const titulo = card.querySelector('.card-title').textContent;
            const conteudo = card.querySelector('.card-text').textContent;
            const dataTexto = card.querySelector('.horario-lembrete').innerHTML;
            const local = card.querySelector('.local-lembrete')?.textContent || '';
            const concluido = card.classList.contains('concluido');

            lembretes.push({ titulo, conteudo, dataTexto, local, concluido });
        });
        const prefix = getUserPrefix();
        localStorage.setItem(`${prefix}_lembretes`, JSON.stringify(lembretes));
    }

    function riscarCard(card) {
        card.classList.add('concluido');
        const cardTitle = card.querySelector('.card-title');
        if (cardTitle) cardTitle.style.textDecoration = 'line-through';
        card.querySelectorAll('.card-text').forEach(el => {
            el.style.textDecoration = 'line-through';
            el.style.color = '#888';
        });
    }

    function agendarNotificacao(card, dados) {
        const regexData = /Data:<\/strong>\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/;
        const regexHora = /Hora:<\/strong>\s*<span.*?>(\d{1,2}):(\d{2})<\/span>/;

        const matchData = dados.dataTexto.match(regexData);
        const matchHora = dados.dataTexto.match(regexHora);

        if (!matchData || !matchHora) return;

        const dia = parseInt(matchData[1], 10);
        const mes = parseInt(matchData[2], 10) - 1;
        const ano = parseInt(matchData[3], 10);
        const hora = parseInt(matchHora[1], 10);
        const minuto = parseInt(matchHora[2], 10);

        const dataLembrete = new Date(ano, mes, dia, hora, minuto, 0, 0);
        const agora = new Date();
        let tempoRestante = dataLembrete.getTime() - agora.getTime();

        if (tempoRestante > 0 && !dados.concluido) {
            setTimeout(() => {
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Lembrete', {
                        body: `${dados.titulo}\n${dados.conteudo}\nLocal: ${dados.local || 'Não informado'}`
                    });
                } else if ('Notification' in window && Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification('Lembrete', {
                                body: `${dados.titulo}\n${dados.conteudo}\nLocal: ${dados.local || 'Não informado'}`
                            });
                        } else {
                            alert(`Lembrete: ${dados.titulo}\n${dados.conteudo}\nLocal: ${dados.local || 'Não informado'}`);
                        }
                    });
                } else {
                    alert(`Lembrete: ${dados.titulo}\n${dados.conteudo}\nLocal: ${dados.local || 'Não informado'}`);
                }

                riscarCard(card);
                dados.concluido = true;
                salvarLembretes();
            }, tempoRestante);
        } else if (dados.concluido) {
            riscarCard(card);
        }
    }

    function criarCard(dados) {
        const textoEditar = pegarTextoBotao('editar') || '✏️';
        const textoApagar = pegarTextoBotao('apagar') || '🗑️';

        const card = document.createElement('div');
        card.className = 'card mt-3';
        if (dados.concluido) card.classList.add('concluido');
        card.style.maxWidth = '350px';
        card.style.margin = '20px auto';

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${dados.titulo}</h5>
                <p class="card-text">${dados.conteudo}</p>
                <p class="card-text local-lembrete"><strong>Local:</strong> ${dados.local || 'Não informado'}</p>
                <p class="card-text mb-1 horario-lembrete">
                    ${dados.dataTexto}
                </p>
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-primary btn-sm editar-lembrete" title="Editar">${textoEditar}</button>
                    <button type="button" class="btn btn-danger btn-sm apagar-lembrete" title="Apagar">${textoApagar}</button>
                </div>
            </div>
        `;

        card.querySelector('.apagar-lembrete').addEventListener('click', function () {
            card.remove();
            salvarLembretes();
        });

        card.querySelector('.editar-lembrete').addEventListener('click', function () {
            const form = criarForm(dados, card);
            container.insertBefore(form, card);
            card.remove();
        });

        agendarNotificacao(card, dados);

        return card;
    }

    function criarForm(dados = {}, cardExistente = null) {
        const form = document.createElement('form');
        form.className = 'card mt-3';
        form.style.maxWidth = '350px';
        form.style.margin = '20px auto';

        const anoAtual = new Date().getFullYear();
        const titulo = dados.titulo || '';
        const conteudo = dados.conteudo || '';
        let dia = '', mes = '', ano = anoAtual, hora = '', minuto = '', local = dados.local || '';

        if (dados.dataTexto) {
            const regexData = /Data:<\/strong>\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/;
            const regexHora = /Hora:<\/strong>\s*<span.*?>(\d{1,2}):(\d{2})<\/span>/;

            const matchData = dados.dataTexto.match(regexData);
            const matchHora = dados.dataTexto.match(regexHora);

            if (matchData) {
                dia = matchData[1];
                mes = matchData[2];
                ano = matchData[3];
            }
            if (matchHora) {
                hora = matchHora[1];
                minuto = matchHora[2];
            }
        }

        const textoSalvar = pegarTextoBotao('salvar') || '✅';
        const textoCancelar = pegarTextoBotao('cancelar') || '❌';

        form.innerHTML = `
            <div class="card-body">
                <div class="mb-2">
                    <label for="titulo" class="form-label">Título</label>
                    <input type="text" class="form-control" id="titulo" required value="${titulo}">
                </div>
                <div class="mb-2">
                    <label for="conteudo" class="form-label">Conteúdo</label>
                    <textarea class="form-control" id="conteudo" rows="2" required>${conteudo}</textarea>
                </div>
                <div class="mb-2">
                    <label for="local" class="form-label">Local</label>
                    <input type="text" class="form-control" id="local" placeholder="Digite o local..." value="${local}">
                </div>
                <div class="mb-2">
                    <label for="dia" class="form-label">Dia</label>
                    <input type="number" class="form-control" id="dia" min="1" max="31" required value="${dia}">
                </div>
                <div class="mb-2">
                    <label for="mes" class="form-label">Mês</label>
                    <input type="number" class="form-control" id="mes" min="1" max="12" required value="${mes}">
                </div>
                <div class="mb-2">
                    <label for="ano" class="form-label">Ano</label>
                    <input type="number" class="form-control" id="ano" value="${ano}" readonly>
                </div>
                <div class="mb-2 d-flex gap-2">
                    <div>
                        <label for="hora" class="form-label">Hora</label>
                        <input type="number" class="form-control" id="hora" min="0" max="23" required value="${hora}">
                    </div>
                    <div>
                        <label for="minuto" class="form-label">Minuto</label>
                        <input type="number" class="form-control" id="minuto" min="0" max="59" required value="${minuto}">
                    </div>
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary cancelar-lembrete" title="Cancelar">${textoCancelar}</button>
                    <button type="submit" class="btn btn-success" title="Salvar">${textoSalvar}</button>
                </div>
            </div>
        `;

        setTimeout(() => {
            const inputLocal = form.querySelector('#local');
            if (inputLocal && window.google && google.maps && google.maps.places) {
                autocomplete = new google.maps.places.Autocomplete(inputLocal, {
                    types: ['geocode'],
                    componentRestrictions: { country: 'br' },
                    fields: ['formatted_address', 'geometry', 'name']
                });
            }
        }, 100);

        form.querySelector('.cancelar-lembrete').addEventListener('click', () => {
            if (cardExistente) {
                container.insertBefore(cardExistente, form);
            }
            form.remove();
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const titulo = form.querySelector('#titulo').value;
            const conteudo = form.querySelector('#conteudo').value;
            const local = form.querySelector('#local').value;
            const dia = form.querySelector('#dia').value;
            const mes = form.querySelector('#mes').value;
            const ano = form.querySelector('#ano').value;
            const hora = form.querySelector('#hora').value.padStart(2, '0');
            const minuto = form.querySelector('#minuto').value.padStart(2, '0');

            const dataTexto = `
                <strong>Data:</strong> ${dia}/${mes}/${ano} <br>
                <strong>Hora:</strong> <span class="hora-lembrete">${hora}:${minuto}</span>
            `;

            const card = criarCard({ titulo, conteudo, dataTexto, local, concluido: false });

            if (cardExistente) {
                container.insertBefore(card, form);
                form.remove();
            } else {
                container.appendChild(card);
                form.remove();
            }

            salvarLembretes();
        });

        return form;
    }

    // Carregar lembretes salvos do usuário logado
    const prefix = getUserPrefix();
    const lembretesSalvos = JSON.parse(localStorage.getItem(`${prefix}_lembretes`)) || [];
    lembretesSalvos.forEach(dados => {
        const card = criarCard(dados);
        container.appendChild(card);
    });

    btn.addEventListener('click', function () {
        const form = criarForm();
        container.appendChild(form);
    });

    if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
});