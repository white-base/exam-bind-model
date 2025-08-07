class FormService {
    
    items = {
        _form:      { selector: { key: '.needs-validation' } },
        _overlay:   { selector: { key: '#screen-overlay' } },
        _gender_fb: { selector: { key: '#gender-feedback' } },
        names:      { selector: '#inputName',   required: true },
        terms:      { selector: '#termsCheck',  required: true },
        file:       { selector: '#formFile',    required: true },
        message:    { selector: '#message',     required: true },
        state:      { selector: '#inputState',  required: true },
        email:      { 
            selector: '#inputEmail', required: true,
            constraints: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: '유효한 이메일 주소를 입력하세요.' }
        },
        password:   { 
            selector: '#inputPassword', required: true,
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

    };

    // Global, show screen overlay before execution
    onExecute = (model, cmd) => {
        model.cols['_overlay'].element.style.display = 'flex';
    };
    // Global, hide screen overlay after execution
    onExecuted = (model, cmd) => {
        model.cols['_overlay'].element.style.display = 'none';
    };

    command = {
        create: {
            url: './data/success',
            config: { method: 'POST' },
            cbValid(valid, cmd) {
                const form      = cmd._model.cols['_form'].element;
                const genderFB  = cmd._model.cols['_gender_fb'].element;

                if (valid.cols.gender.value === '') {
                    genderFB.style.display = 'block';
                } else {
                    genderFB.style.display = 'none';
                }

                if (form && !form.checkValidity()) {
                    form.classList.add('was-validated');
                    return false;
                }
                return true;
            },
            cbBind(bind, cmd, config) {
                // FormData data preparation
                const form = cmd._model.cols['_form'].element;
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
    };

    mapping = {
        _form:      { create: 'misc' },
        _overlay:   { create: 'misc' },
        _gender_fb: { create: 'misc' },
        names:      { create: ['valid', 'bind'] },
        email:      { create: ['valid', 'bind'] },
        password:   { create: ['valid', 'bind'] },
        state:      { create: ['valid', 'bind'] },
        gender:     { create: ['valid', 'bind'] },
        terms:      { create: ['valid', 'bind'] },
        file:       { create: ['valid', 'bind'] },
        message:    { create: ['valid', 'bind'] }
    };
}

export {
    FormService as default,
    FormService
}