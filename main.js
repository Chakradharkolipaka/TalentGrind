// document.addEventListener("DOMContentLoaded", async function () {
//     try {
//         // Get the token from localStorage (saved during login)
//         const token = localStorage.getItem("authToken");

//         if (!token) {
//             throw new Error("No auth token found. Please log in.");
//         }

//         // Fetch user profile
//         const profileResponse = await fetch("http://localhost:5000/api/profile", {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         });

//         const userData = await profileResponse.json();

//         if (!profileResponse.ok) {
//             throw new Error(userData.message || "Failed to fetch profile");
//         }

//         // Update profile image (fallback to default image if broken)
//         const profileImg = document.querySelector(".profile img");
//         profileImg.onerror = () => profileImg.src = "https://i.postimg.cc/7ZBcjDqp/user-default.jpg";
//         profileImg.src = userData.profileImage || "https://i.postimg.cc/7ZBcjDqp/user-default.jpg";

//         // Set welcome name (fallback if missing)
//         document.querySelector(".profile h2").textContent = `Welcome, ${userData.fullname || userData.name || "User"}`;

//         // Get SkillCoins from a separate API (optional)
//         const coinsElement = document.querySelector(".profile .coins");
//         try {
//             const coinsResponse = await fetch("http://localhost:5000/api/skillcoins", {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             const coinsData = await coinsResponse.json();

//             if (coinsResponse.ok && coinsData.balance !== undefined) {
//                 coinsElement.textContent = `${coinsData.balance} 💰`; // Show SkillCoins
//             } else {
//                 coinsElement.textContent = "—";
//             }
//         } catch (coinsError) {
//             console.warn("SkillCoins not available:", coinsError.message);
//             coinsElement.textContent = "—"; // Optional: hide or show dash
//         }

//     } catch (error) {
//         document.querySelector(".profile").innerHTML = `<p style="color: red;">❌ Error loading profile.</p>`;
//         console.error("Error fetching user data:", error.message);
//     }
// });
