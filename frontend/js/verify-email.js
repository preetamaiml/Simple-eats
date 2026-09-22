document.addEventListener("DOMContentLoaded", async function () {

    const messageElement =
        document.getElementById("verification-message");


    // Get user_id and token from the URL
    const params = new URLSearchParams(window.location.search);

    const userId = params.get("user_id");
    const token = params.get("token");


    // Check that both values exist
    if (!userId || !token) {

        messageElement.textContent =
            "Invalid verification link.";

        return;
    }


    try {

        const response = await fetch(
            "https://ubiquitous-halibut-p7jwpv9qrp5v27qvw-8000.app.github.dev/api/verify-email/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user_id: userId,
                    token: token
                })
            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.error || "Email verification failed."
            );

        }


        messageElement.textContent =
            result.message ||
            "Your email has been verified successfully!";


    } catch (error) {

        console.error("Verification error:", error);

        messageElement.textContent =
            error.message ||
            "Something went wrong while verifying your email.";

    }

});