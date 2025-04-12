document.getElementById("teachSkillForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // ✅ Retrieve and validate user ID
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("❌ User not logged in. Please log in to continue.");
        return;
    }

    // ✅ Get form values
    const skillNameElem = document.getElementById("skillName");
    const categoryElem = document.getElementById("category");
    const levelElem = document.getElementById("level");
    const descriptionElem = document.getElementById("description");
    const availabilityElem = document.getElementById("availability");
    const skillCoinsElem = document.getElementById("skillCoins");

    if (!skillNameElem || !categoryElem || !levelElem || !descriptionElem || !availabilityElem || !skillCoinsElem) {
        alert("❌ Some form elements are missing. Please check the form.");
        return;
    }

    const skillName = skillNameElem.value.trim();
    const category = categoryElem.value.trim();
    const level = levelElem.value.trim();
    const description = descriptionElem.value.trim();
    const availability = availabilityElem.value.trim();
    const skillCoins = Number(skillCoinsElem.value); // Convert to number

    // ✅ Basic form validation
    if (!skillName || !description || !availability || skillCoins < 10) {
        alert("❌ All required fields must be filled correctly! SkillCoins must be at least 10.");
        return;
    }

    // ✅ Prepare data for API
    const videoUrl = document.getElementById("videoUrl").value.trim();

    const skillData = {
        userId,
        skillName,
        category,
        level,
        description,
        availability,
        skillCoins,
        videoUrl
    };

    try {
        const response = await fetch("http://localhost:5000/api/teach-skill", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(skillData),
        });

        // ✅ Read response as text first
        const text = await response.text();
        console.log("🔍 API Response:", text);

        // ✅ Try to parse JSON safely
        let result;
        try {
            result = JSON.parse(text);
        } catch (jsonError) {
            throw new Error("Server returned invalid JSON.");
        }

        if (response.ok) {
            alert("✅ Skill submitted successfully!");
            document.getElementById("teachSkillForm").reset(); // ✅ Reset form after success
        } else {
            alert(`❌ Failed to submit skill: ${result.message}`);
        }
    } catch (error) {
        console.error("❌ Error submitting skill:", error);
        alert("❌ Server error. Please try again later.");
    }

});
