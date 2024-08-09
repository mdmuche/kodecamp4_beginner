const fullname = document.getElementById("fullname");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const registerButton = document.getElementById("registerButton");

registerButton.addEventListener("click", async () => {
  try {
    const response = await fetch(urlMaker("/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: fullname.value,
        userName: username.value,
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    // console.log(data);

    if (response.status == 201 && data.message == "user created") {
      location.assign("/frontend/index.html");
    }
  } catch (error) {
    // console.error(error);
    alert("An error occured");
  }
});
