// Selecionando elementos do DOM
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const phoneInput = document.getElementById('phone');
const subjectSelect = document.getElementById('subject');
const submitButton = document.querySelector('button[type="submit"]');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');

// 1. Acessar valores dos inputs
function getFormValues() {
    return {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value,
        phone: phoneInput.value,
        subject: subjectSelect.value,
        image: imageInput.files[0]
    };
}

// 2. Atualizar conteúdo em tempo real
['input', 'change'].forEach(event => {
    form.addEventListener(event, () => {
        const values = getFormValues();
        document.getElementById('result').innerHTML = `
            Nome: ${values.name}<br>
            Email: ${values.email}<br>
            Mensagem: ${values.message}<br>
            Telefone: ${values.phone}<br>
            Assunto: ${values.subject}
        `;
    });
});

// 3. Validação de campos
function validateForm() {
    let isValid = true;
    
    // Validação de nome
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Nome é obrigatório');
        isValid = false;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Email inválido');
        isValid = false;
    }
    
    // Validação de mensagem (mínimo 100 caracteres)
    if (messageInput.value.length < 100) {
        showError(messageInput, 'A mensagem deve ter pelo menos 100 caracteres');
        isValid = false;
    }
    
    // Validação de assunto
    if (!subjectSelect.value) {
        showError(subjectSelect, 'Selecione um assunto');
        isValid = false;
    }

    return isValid;
}

// 4. Resetar formulário
function resetForm() {
    form.reset();
    clearErrors();
    clearImagePreview();
    enableSubmitButton();
}

// 5. Controle do botão de envio
function enableSubmitButton() {
    const formFields = [nameInput, emailInput, messageInput, phoneInput, subjectSelect];
    const allFieldsFilled = formFields.every(field => field.value.trim() !== '');
    submitButton.disabled = !allFieldsFilled;
}

// 6. Spinner de carregamento
function showSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'spinner';
    spinner.innerHTML = '⭕';
    spinner.style.animation = 'spin 1s linear infinite';
    form.appendChild(spinner);
}

function hideSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.remove();
}

// 10. Máscara de telefone
function formatPhone(value) {
    value = value.replace(/\D/g, '');
    return value.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '($1) ($2) $3-$4');
}

phoneInput.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
});

// 12. Preview de imagem
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

function clearImagePreview() {
    imagePreview.innerHTML = '';
}

// 9. Feedback visual
function showError(element, message) {
    element.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.parentNode.appendChild(errorDiv);
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

// Manipulador principal do formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    
    if (!validateForm()) {
        return;
    }
    
    showSpinner();
    
    try {
        // Simulação de envio
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        alert('Formulário enviado com sucesso!');
        resetForm();
        
        // 7. Redirecionamento após sucesso
        setTimeout(() => {
            window.location.href = '/sucesso.html';
        }, 1000);
    } catch (error) {
        alert('Erro ao enviar formulário: ' + error.message);
    } finally {
        hideSpinner();
    }
});

// Monitora mudanças nos campos para habilitar/desabilitar botão
form.addEventListener('input', enableSubmitButton);