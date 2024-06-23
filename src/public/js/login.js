const nickForm = document.querySelector("form");

function getExpirationDate() {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
    const tomorrow = new Date(today.getTime() + oneDay);
    return tomorrow.toUTCString(); // Format date for cookie
  }

nickForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nickInput = nickForm.querySelector("input");
    const nickname = nickInput.value.trim();
    document.cookie = `nickname=${nickname}; expires=${getExpirationDate()}` ;
    
    nickForm.remove();

    window.location = "/chat";
})