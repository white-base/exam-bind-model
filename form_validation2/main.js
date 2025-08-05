import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';

const bm = new BindModel({
    items: {
        names:      { required: true, selector: '#inputName' },
        terms:      { required: true, selector: '#termsCheck' },
        file:       { required: true, selector: '#formFile' },
        message:    { required: true, selector: '#message' },
        state:      { required: true, selector: '#inputState' },
        email:      { 
            required: true, selector: '#inputEmail',
            constraints: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: '유효한 이메일 주소를 입력하세요.' }
        },
        password:   { 
            required: true, selector: '#inputPassword',
            constraints: { regex: /^.{6,}$/, msg: '비밀번호는 최소 6자 이상이어야 합니다.' }
         },
        gender:     {
            selector: { key: `input[name=gender][type=radio]`, type: 'none' },
            setFilter(val) { 
                $(`input[name=gender][value=${val}]`).prop('checked', true);
            },
            getFilter(val) {
                return $(`input[name=gender]:checked`).val();
            }
        },

    },
    // Global, show screen overlay before execution
    onExecute: (model, cmd) => {
          const overlay = document.getElementById('screen-overlay');
            overlay.style.display = 'flex';
    },
    // Global, hide screen overlay after execution
    onExecuted: (model, cmd) => {
          const overlay = document.getElementById('screen-overlay');
            overlay.style.display = 'none';
    },
    command: {
        create: {
            url: './data/success',
            config: { method: 'POST' },
            cbValid(valid, cmd) {
                const form = document.querySelector('.needs-validation')
                const genderFeedback = form.querySelector('#gender-feedback');
                
                if (valid.cols.gender.value === '') {
                    genderFeedback.style.display = 'block';
                } else {
                    genderFeedback.style.display = 'none';
                }

                if (form && !form.checkValidity()) {
                    form.classList.add('was-validated');
                    return false;
                }
                return true;
            },
            cbBind(bind, cmd, config) {
                // FormData data preparation
                const form = document.querySelector('.needs-validation')
                const data = new FormData(form);

                for (var i = 0; i < bind.columns.count; i++) {
                    var value = bind.columns[i].value === null ? '' : bind.columns[i].value;
                    data.append(bind.columns[i].name, value);
                }
                config.data = data;
                config.headers = { 'Content-Type': 'multipart/form-data' };

                console.warn('Caution: This is a test submission, data will not be saved.', config);
            },
            cbResult(data, cmd, res) {
                if (data === true) {
                    alert('Form submitted successfully!');
                } else {
                    console.warn('Form submission failed. Please try again.');
                }
            },
            cbEnd(status, cmd, res) {
                console.log('Submission ended with status:', status);
            }
        }
    },
    mapping: {
        names:      { create: ['valid', 'bind'] },
        email:      { create: ['valid', 'bind'] },
        password:   { create: ['valid', 'bind'] },
        state:      { create: ['valid', 'bind'] },
        gender:     { create: ['valid', 'bind'] },
        terms:      { create: ['valid', 'bind'] },
        file:       { create: ['valid', 'bind'] },
        message:    { create: ['valid', 'bind'] }
    }
});

$('#btn_Submit').click(() => bm.cmd['create'].execute());

globalThis.bm = bm; // Make bm globally accessible