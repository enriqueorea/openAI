import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import axios from "axios";

const $ = (selector) => document.querySelector(selector);

const form = $("form");

const chatContainer = $("#chat_container");

let loadInterval;

const loader = (element) => {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
};

const typeText = (element, text) => {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
};

const generateUniqueId = () => {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
};

const chatStripe = (isAi, value, uniqueId) => {
  return `
      <div class="wrapper ${isAi && "ai"}" >
        <div class="chat" >
          <div class="profile" >
            <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}" />
          </div>
          <div class="message" id="${uniqueId}" > ${value} </div>
        </div>
      </div>
    `;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chat

  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();

  // bot's

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fethc

  const dataResponse = await axios.post("https://codexai-ywjg.onrender.com", {
    prompt: data.get("prompt"),
  });

  clearInterval(loadInterval);

  messageDiv.innerHTML = "";

  const parsedData = dataResponse.data.bot.trim();

  typeText(messageDiv, parsedData);
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => e.keyCode === 13 && handleSubmit(e));
