document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirm-password").value;


        // Check passwords
        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        const registrationData = {

            username: name,
            email: email,
            password: password,
            phone: phone

        };


        try {

            const response = await fetch(
                "https://ubiquitous-halibut-p7jwpv9qrp5v27qvw-8000.app.github.dev/api/register/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(registrationData)
                }
            );


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error || "Registration failed."
                );

            }


            console.log("Registration:", result);

            alert(
                "Registration successful! Please check your email to verify your account."
            );


        } catch (error) {

            console.error("Registration error:", error);

            alert(
                error.message ||
                "There was a problem registering your account."
            );

        }

    });

});