function getUserPrefix() {
  return localStorage.getItem('usuarioLogado') || 'anonimo';
}

function salvarRegistro(registro) {
  const prefix = getUserPrefix();
  const registros = JSON.parse(localStorage.getItem(`${prefix}_registros`) || '[]');
  registros.push(registro);
  localStorage.setItem(`${prefix}_registros`, JSON.stringify(registros));
}

function getRegistros() {
  const prefix = getUserPrefix();
  return JSON.parse(localStorage.getItem(`${prefix}_registros`) || '[]');
}



document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login-form");
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const nome = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      const password2 = document.querySelector('#confirm-password').value;
  
      if (!nome || !email || !password || !password2) {
        alert("Por favor, complete todos os campos.");
        return;
      }
  
      if (password !== password2) {
        alert("As senhas não coincidem.");
        return;
      }
  
      if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
      }
  
      if (!email) {
        alert("Por favor, insira um endereço de e-mail válido.");
        return;
      }
  
      if (!nome) {
        alert("Por favor, insira um nome válido.");
        return;
      }
  
      const user = {
        nome: nome,
        email: email,
        password: password,
      };
  
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        alert("Este e-mail já está cadastrado.");
        return;
      }
  
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Usuário cadastrado com sucesso!");
  
      form.reset();
      window.location.href = "login.html"; 
    });
  });
  