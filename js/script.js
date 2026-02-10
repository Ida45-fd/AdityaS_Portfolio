// Initialize contacts from localStorage
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editIndex = null;

// DOM Elements
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const companyInput = document.getElementById("company");
const notesInput = document.getElementById("notes");
const list = document.getElementById("contactList");
const addBtn = document.getElementById("addContactBtn");
const updateBtn = document.getElementById("updateContactBtn");
const cancelBtn = document.getElementById("cancelBtn");
const search = document.getElementById("search");
const sortBy = document.getElementById("sortBy");
const clearAllBtn = document.getElementById("clearAll");
const contactForm = document.getElementById("contactForm");
const formTitle = document.getElementById("formTitle");
const contactCount = document.getElementById("contactCount");
const emptyState = document.getElementById("emptyState");

// Error elements
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");


// 🚀 PHONE INPUT — BLOCK LETTERS IN REAL TIME
phoneInput.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});


// Save to localStorage
function saveToStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
  updateContactCount();
}

function updateContactCount() {
  contactCount.textContent = contacts.length;
}


// VALIDATION
function validateName(name) {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return "";
}

function validateEmail(email) {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Enter valid email";
  return "";
}

// 🔥 STRICT PHONE VALIDATION (10 digits only)
function validatePhone(phone) {
  if (!phone.trim()) return "Phone number required";

  if (!/^\d{10}$/.test(phone)) {
    return "Phone must be exactly 10 digits";
  }

  return "";
}


// Real-time validation
nameInput.addEventListener("blur", () => {
  const error = validateName(nameInput.value);
  nameError.textContent = error;
  nameInput.classList.toggle("error", error);
});

emailInput.addEventListener("blur", () => {
  const error = validateEmail(emailInput.value);
  emailError.textContent = error;
  emailInput.classList.toggle("error", error);
});

phoneInput.addEventListener("blur", () => {
  const error = validatePhone(phoneInput.value);
  phoneError.textContent = error;
  phoneInput.classList.toggle("error", error);
});


// Validate form
function validateForm() {
  const nameErr = validateName(nameInput.value);
  const emailErr = validateEmail(emailInput.value);
  const phoneErr = validatePhone(phoneInput.value);

  nameError.textContent = nameErr;
  emailError.textContent = emailErr;
  phoneError.textContent = phoneErr;

  return !nameErr && !emailErr && !phoneErr;
}


// RENDER
function render(contactsToRender = contacts) {
  list.innerHTML = "";

  if (contactsToRender.length === 0) {
    emptyState.classList.add("show");
    list.style.display = "none";
    return;
  }

  emptyState.classList.remove("show");
  list.style.display = "block";

  contactsToRender.forEach((contact, index) => {
    const actualIndex = contacts.indexOf(contact);

    const li = document.createElement("li");
    li.className = "contact-item";

    li.innerHTML = `
      <div>
        <strong>${contact.name}</strong><br>
        ${contact.email}<br>
        ${contact.phone}
      </div>
      <div>
        <button onclick="editContact(${actualIndex})">Edit</button>
        <button onclick="deleteContact(${actualIndex})">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });
}


// ADD CONTACT
contactForm.addEventListener("submit", function(e){
  e.preventDefault();

  if (!validateForm()) return;

  const templateParams = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    company: companyInput.value,
    notes: notesInput.value
  };

  emailjs.send(
    "service_nazv8zk",
    "template_jkp28cr",
    templateParams
  ).then(function(){
      alert("Contact sent to your Gmail 📧");
      clearForm();
  }, function(error){
      alert("Failed to send email");
      console.log(error);
  });
});



// DELETE
function deleteContact(index) {
  contacts.splice(index, 1);
  saveToStorage();
  render();
}


// EDIT
function editContact(index) {
  const c = contacts[index];

  nameInput.value = c.name;
  emailInput.value = c.email;
  phoneInput.value = c.phone;

  editIndex = index;

  addBtn.style.display = "none";
  updateBtn.style.display = "block";
}

updateBtn.onclick = () => {
  if (!validateForm()) return;

  contacts[editIndex] = {
    ...contacts[editIndex],
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim()
  };

  saveToStorage();
  render();
  clearForm();

  addBtn.style.display = "block";
  updateBtn.style.display = "none";
};


// CLEAR FORM
function clearForm() {
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  companyInput.value = "";
  notesInput.value = "";
}


// PROJECT CARD ALERT + REDIRECT
// document.querySelectorAll(".project-card").forEach(card => {
//   card.addEventListener("click", function (e) {
//     e.preventDefault();
//     const link = this.getAttribute("href");
//     alert("Opening project 🚀");
//     window.open(link, "_blank");
//   });
// });


// INIT
updateContactCount();
render();

document.querySelectorAll(".faq-question").forEach(btn=>{
  btn.addEventListener("click", function(){

    const answer = this.nextElementSibling;

    if(answer.style.display === "block"){
      answer.style.display = "none";
    } else {
      answer.style.display = "block";
    }

  });
});
