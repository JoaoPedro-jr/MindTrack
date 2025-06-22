document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login-form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        if (!email || !password) {
            alert("Por favor, complete todos os campos.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find((user) => user.email === email && user.password === password);

        if (!existingUser) {
            alert("E-mail ou senha incorretos.");
            return;
        }

        alert("Login realizado com sucesso! " + existingUser.nome);
        localStorage.setItem("loggedUser", JSON.stringify(existingUser));
        localStorage.setItem("usuarioLogado", existingUser.email); // ESSENCIAL para separar dados por usuário
        form.reset();
        window.location.href = "dashboard.html";
    });
});