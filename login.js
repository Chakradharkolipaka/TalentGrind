document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // ⛔ Prevent page reload

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            console.log("📩 Sending login request with:", { email, password });

            fetch("http://localhost:5000/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
            .then(response => response.json())
            .then(data => {
                console.log("🔍 Login Response:", data);  // Debugging

                if (data.success && data.user && data.user._id) {
                    localStorage.setItem("userId", data.user._id);  // ✅ Store userId
                    localStorage.setItem("token", data.token);      // ✅ Store token
                    window.location.href = "mainpage.html";       // ✅ Redirect to dashboard
                } else {
                    alert(data.message || "Login failed!");
                }
            })
            .catch(error => console.error("❌ Login Error:", error));
        });
    } else {
        console.error("❌ Form with ID 'login-form' not found!");
    }
});
function displaySkills(skills) {
    const container = document.getElementById("skill-container");
    container.innerHTML = "";

    if (skills.length === 0) {
        container.innerHTML = "<p>No skills found.</p>";
        return;
    }

    skills.forEach(skill => {
        const skillCard = document.createElement("div");
        skillCard.classList.add("skill-card");
        skillCard.innerHTML = `
            <h4>${skill.skillName}</h4>
            <p>${skill.description}</p>
            <p><strong>Cost:</strong> ${skill.skillCoins} SkillCoins</p>
            <button class="btn spend-skillcoins" data-cost="${skill.skillCoins}">Spend ${skill.skillCoins} SkillCoins</button>
            <div class="video-container" style="display:none;">
                <video width="100%" controls>
                    <source src="${skill.videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;

        // Append the card
        container.appendChild(skillCard);

        // Add event listener to the button
        const button = skillCard.querySelector(".spend-skillcoins");
        const videoContainer = skillCard.querySelector(".video-container");
        button.addEventListener("click", () => {
            // Spend SkillCoins logic can be added here
            videoContainer.style.display = "block"; // Show the video
        });
    });
}
