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
            url: './data/success',
            cbValid(valid, cmd) {
                if (!valid) {
                    alert('Please fill out all required fields correctly.');
                    return false;
                }
                return true;
            },
            // cbBind(a,b,c) {
            //     console.warn('Caution: This is a test submission, data will not be saved.', c.data);
            // },
            cbResult(data, cmd, res) {
                if (data === true) {
                    alert('Form submitted successfully!');
                } else {
                    alert('Form submission failed. Please try again.');
                }
                // console.warn('Caution: This is a test submission, data will not be saved.', data);
            },
            cbEnd(status, cmd, res) {
                console.log('Submission ended with status:', status);
            }
        }
    },
});

globalThis.bm = bm; // Make bm globally accessible

// $('#btn_Submit').click(() => bm.cmd['create'].execute());
