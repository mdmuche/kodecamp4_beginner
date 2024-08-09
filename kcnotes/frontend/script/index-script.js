const userNameOrEmail = document.getElementById("usernameoremail");
const password = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async () => {
  const result = await fetch(urlMaker("/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailOrUserName: userNameOrEmail.value,
      password: password.value,
    }),
  });

  const data = await result.json();

  console.log(data);

  sessionStorage.setItem("token", `Bearer ${data.token}`);

  location.assign("/frontend/dashboard.html");
});
