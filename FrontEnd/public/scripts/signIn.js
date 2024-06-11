const userForm = document.querySelector("#userForm");
const userModal = document.querySelector("#userModal");

function openCreateUserModal() {
  userModal.showModal();
  userForm.reset();
}

userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  document.querySelectorAll(".error-message").forEach((element) => {
    element.remove();
  });
  document.querySelectorAll(".input-error").forEach((element) => {
    element.classList.remove("input-error");
  });

  const firstName = e.target[0].value;
  const lastName = e.target[1].value;
  const email = e.target[2].value;
  const password = e.target[3].value;
  const passwordConfirmation = e.target[4].value;

  const validation = validate(
    {
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation
    },
    {
      firstName: {
        presence: { allowEmpty: false },
        length: { minimum: 5 },
      },
      lastName: {
        presence: { allowEmpty: false },
        length: { minimum: 5 },
      },
    }
  );

  if (validation) {
    checkValidation(validation);
    return;
  }

  const url = "http://localhost:8000/signIn";
  
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.isError) {
        checkValidation(data.error);
        return;
      }else{
        userModal.close();
      }
    });
});

function checkValidation(validation) {
  Object.keys(validation).forEach((key) => {
    const el = document.querySelector(`input[name=${key}]`);
    setErr(el, validation[key]);
  });
}

function setErr(e, messages) {
  e.classList.add("input-error");
  messages.reverse().forEach((message) => {
    const p = document.createElement("p");
    p.textContent = message;
    p.classList.add("text-red-500", "error-message");
    e.parentNode.insertBefore(p, e.nextSibling);
  });
}