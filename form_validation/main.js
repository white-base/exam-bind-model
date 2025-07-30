import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';


const bm = new BindModel({
    items: {
        name: $('#inputName'),
        email: $('#inputEmail'),
        password: $('#inputPassword'),
        state: $('#inputState'),
        gender: $('input[name="gender"]:checked'),
        terms: $('#termsCheck'),
        file: $('#formFile'),
        message: $('#message')
    },
    command: {
        create: {
            cbValid(valid, cmd) {
                if (!valid) {
                    alert('Please fill out all required fields correctly.');
                    return false;
                }
                return true;
            },
            cbEnd(status, cmd, res) {
                if (res) {
                    alert('Form submitted successfully!');
                } else {
                    alert('Form submission failed. Please try again.');
                }
            }
        }
    },
});

bm.url = '/submit'; // Set the URL for form submission

$('#btn_Submit').click(() => bm.cmd['create'].execute());
