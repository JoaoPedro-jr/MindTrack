document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login-form");
    const button = document.querySelector(".login-button");
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
  
      if (!email || !password) {
        alert("Por favor, complete todos os campos.");
        return;
      }
  
      if (!email) {
        alert("Por favor, insira um endereço de e-mail válido.");
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
      window.location.href = "dashboard.html";
  
      form.reset();
      
    });
  });