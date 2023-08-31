export function initAuth() {
    authModalToggle()
    authFormSelector()
    authFormInteractions()
}

function authModalToggle() {
    const authMenuButton = document.querySelector(".register-login")
    const modal = authMenuButton?.parentElement?.querySelector(".modal")
    authMenuButton?.addEventListener("click", function() {
        modal?.classList.add("active")
    })
    modal?.addEventListener("click", function(e) {
        if (e.target !== modal) return
        modal.classList.remove("active")
    });
}

function authFormSelector() {
    const authLoginSelector = document.querySelector(".login-selector") 
    const authRegisterSelector = document.querySelector(".register-selector")
    const authFormContainer = document.querySelector(".form-container")
    const authForm = authFormContainer?.querySelector("form") as HTMLFormElement
    const selectedDiv = document.querySelector(".auth-selected")
    const usernameInput = authFormContainer?.querySelector("#username") as HTMLInputElement
    const emailInput = authFormContainer?.querySelector("#email") as HTMLInputElement
    const passwordInput = authFormContainer?.querySelector("#password") as HTMLInputElement
    const confirmationInput = authFormContainer?.querySelector("#confirmation") as HTMLInputElement

    authLoginSelector?.addEventListener("click", function() {
        authLoginSelector.classList.add("active")
        authFormContainer?.classList.add("login")
        authRegisterSelector?.classList.remove("active")
        authFormContainer?.classList.remove("register")
        selectedDiv?.classList.remove("translated")
        authForm.action = "/login"
        usernameInput.removeAttribute("pattern")
        passwordInput.removeAttribute("pattern")
        emailInput.disabled = true;
        confirmationInput.disabled = true;
    })

    authRegisterSelector?.addEventListener("click", function() {
        authRegisterSelector.classList.add("active")
        authFormContainer?.classList.add("register")
        authLoginSelector?.classList.remove("active")
        authFormContainer?.classList.remove("login")
        selectedDiv?.classList.add("translated")
        authForm.action = "/register"
        usernameInput.setAttribute("pattern","^[a-zA-Z\\d]{8,24}$")
        passwordInput.setAttribute("pattern", "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,24}$")
        emailInput.disabled = false;
        confirmationInput.disabled = false;
    })
}

function authFormInteractions() {
    const modal = document.querySelector("#auth")?.querySelector(".modal")
    const inputFields = modal?.querySelectorAll("input");
    const authForm = modal?.querySelector("form") as HTMLFormElement;
    const registerPasswordField = document.querySelector("#password");
    const confirmationField = document.querySelector("#confirmation");
    
    interface errorMessages {
        "valueMissing": object,
        "typeMismatch": object,
        "patternMismatch": object,
        "valid": string,
    }

    const errorMessages: errorMessages = {
        "valueMissing": {
            "username": "Please enter username.",
            "email": "Please enter email.",
            "password": "Please enter password.",
            "confirmation": "Please confirm password."
        },
        "typeMismatch": {
            "email": "Please enter a valid email."
        },
        "patternMismatch": {
            "username": "Does not meet requirements.",
            "password": "Does not meet requirements.",
            "confirmation": "Passwords do not match."
        },
        "valid": "This is not a valid input."
    };

    inputFields?.forEach(function(inputField) {
        inputField.addEventListener("focusin", function(e){
            (e.target as HTMLInputElement).parentElement?.classList.add("in-focus");
            (e.target as HTMLInputElement).parentElement?.querySelector("label")?.classList.add("is-active");
        })
        inputField.addEventListener("focusout", function(e){
            (e.target as HTMLInputElement).parentElement?.classList.remove("in-focus");
            if((e.target as HTMLInputElement).value == "") {
                (e.target as HTMLInputElement).parentElement?.querySelector("label")?.classList.remove("is-active");
            }
            checkValidityFocusOut(e);
        })
        inputField.addEventListener("input", function(e){
            if((e.target as HTMLInputElement).validity.valid){
                ((e.target as HTMLInputElement).parentElement?.querySelector(".error-message") as HTMLElement).textContent = "";
                (e.target as HTMLInputElement).parentElement?.classList.remove("invalid");
            }
        })
    })

    registerPasswordField?.addEventListener("input", function(){
        confirmationField?.setAttribute("pattern", (registerPasswordField as HTMLInputElement).value);
        if ((confirmationField as HTMLInputElement).value === (registerPasswordField as HTMLInputElement).value) {
            (confirmationField?.parentElement?.querySelector(".error-message") as HTMLElement).textContent = "";
            confirmationField?.parentElement?.classList.remove("invalid");
        }
        else if ((confirmationField as HTMLInputElement).value !== "" && !confirmationField?.classList.contains("invalid")) {
            updateErrorMessage(confirmationField as HTMLInputElement);
            confirmationField?.parentElement?.classList.add("invalid");
        }
    })

    authForm?.addEventListener("submit", function(e){
        let prevent = false;
        inputFields?.forEach(function(inputField) {
                            console.log(inputField)
            if (!inputField.validity.valid && !inputField.disabled) {
                updateErrorMessage(inputField);
                prevent = true;
            }
        })
        if (prevent) e.preventDefault();
    });

    function checkValidityFocusOut(e: Event) {
        if ((e.target as HTMLInputElement).value !== "" && !(e.target as HTMLInputElement).validity.valid) updateErrorMessage(e.target as HTMLInputElement);
        }

    function updateErrorMessage(inputField: HTMLInputElement) {
        const errorSpan = inputField?.parentElement?.querySelector(".error-message");
        if(inputField.validity.valueMissing) {
            (errorSpan as HTMLElement).textContent = errorMessages["valueMissing"][inputField.name as keyof errorMessages["valueMissing"]];
            }
        else if(inputField.validity.typeMismatch) {
            (errorSpan as HTMLElement).textContent = errorMessages["typeMismatch"][inputField.name as keyof errorMessages["typeMismatch"]];
        }
        else if(inputField.validity.patternMismatch) {
            (errorSpan as HTMLElement).textContent = errorMessages["patternMismatch"][inputField.name as keyof errorMessages["patternMismatch"]];
        }
        else {
            (errorSpan as HTMLElement).textContent = errorMessages["valid"]; /* This is just as a safety in case there would be another reason for invalid input */
        }
        inputField?.parentElement?.classList.add("invalid");
    }
}