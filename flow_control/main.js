import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';

const bm = new BindModel({
    items: {
        _results:    { selector: '#cbResult' },
        u_name:     { selector: '#inputName' },
        email:      { selector: '#inputEmail' },
    },
    // model execute event
    onExecute: (model, cmd) => {
        const msg = `1 step : onExecute(global)\n`;
        cmd._model.cols['_results'].value = msg;
        cmd._model.cols['u_name'].value = '';
        cmd._model.cols['email'].value = '';
        console.clear();
        console.log(msg);
    },
    onExecuted: (model, cmd) => {
        const msg = `5 step : onExecuted(global)\n`;
        cmd._model.cols['_results'].value += msg;
        console.log(msg);
    },

    // model execute callback
    cbBaseBegin(model, cmd) {
        const msg = '3-1 step : cbBaseBegin\n';
        cmd._model.cols['_results'].value += msg;
        console.log(msg);
    },
    cbBaseValid(valid, cmd) {
        const msg = '3-2 step : cbBaseValid\n';
        cmd._model.cols['_results'].value += msg;
        console.log(msg);
        return true;
    },
    cbBaseBind(bind, cmd, config) {
        const msg = '3-3 step : cbBaseBind\n';
        cmd._model.cols['_results'].value += msg;
        console.log(msg);
    },
    cbBaseResult(data, cmd, res) {
        const msg = '3-4 step : cbBaseResult\n';
        cmd._model.cols['_results'].value += msg;
        console.log(msg);
    },
    cbBaseOutput(outputs, cmd, res) {
        const msg = '3-5 step : cbBaseOutput, option == ("VIEW", "ALL", "PICK")\n';
        cmd._model.cols['_results'].value += msg;
        console.log(msg);
    },
    cbBaseEnd(status, cmd, res) {
        const msg = '3-6 step : cbBaseEnd\n';
        cmd._model.cols['_results'].value += msg;
        console.log(msg);
    },

    command: {
        cmd1: {
            // command execute event
            onExecute: (model, cmd) => {
                const msg = '2 step : onExecute\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
            onExecuted: (model, cmd) => {
                const msg = '4 step : onExecuted\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
            
            // command execute callback
            cbBegin(model, cmd) {
                const msg = '3-1 step : cbBegin\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
            cbValid(valid, cmd) {
                const msg = '3-2 step : cbValid\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
                return true;
            },
            cbBind(bind, cmd, config) {
                const msg = '3-3 step : cbBind\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
            cbResult(data, cmd, res) {
                const msg = '3-4 step : cbResult\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
            cbOutput(outputs, cmd, res) {
                const msg = '3-5 step : cbOutput, option == ("VIEW", "ALL", "PICK")\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
            cbEnd(status, cmd, res) {
                const msg = '3-6 step : cbEnd\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },

        },
        cmd2: {
            // command execute event
            onExecute: (model, cmd) => {
                const msg = '2 step : onExecute\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
            onExecuted: (model, cmd) => {
                const msg = '4 step : onExecuted\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
        },
        cmd3: {
            // command execute event
            onExecute: (model, cmd) => {
                const msg = '2 step : onExecute\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
            onExecuted: (model, cmd) => {
                const msg = '4 step : onExecuted\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
            
            // command execute event
            cbBegin(model, cmd) {
                const msg = '3-1 step : cbBegin\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
            },
            cbValid(valid, cmd) {
                const msg = '3-2 step : cbValid\n';
                cmd._model.cols['_results'].value += msg;
                console.log(msg);
                return true;
            },
        }
    },

    mapping: {
        _results: { 
            $all: 'misc'
        },
        u_name:     { 
            cmd1: '$all',
            cmd2: '$all',
            cmd3: '$all',
        },
        email:      { 
            cmd1: ['valid', 'bind', 'output'], 
            cmd2: ['valid', 'bind', 'output'],
            cmd3: ['valid', 'bind', 'output'] 
        },
    }
});

$('#btn_Submit1').click(() => bm.cmd['cmd1'].execute('SEND', './data/1'));
$('#btn_Submit2').click(() => bm.cmd['cmd1'].execute('VIEW', './data/1'));
$('#btn_Submit3').click(() => bm.cmd['cmd1'].execute('ALL', './data/1'));
$('#btn_Submit4').click(() => bm.cmd['cmd1'].execute('PICK', './data/1'));

$('#btn_Submit5').click(() => bm.cmd['cmd2'].execute('SEND', './data/1'));
$('#btn_Submit6').click(() => bm.cmd['cmd2'].execute('VIEW', './data/1'));
$('#btn_Submit7').click(() => bm.cmd['cmd2'].execute('ALL', './data/1'));
$('#btn_Submit8').click(() => bm.cmd['cmd2'].execute('PICK', './data/1'));

$('#btn_Submit9').click(() => bm.cmd['cmd3'].execute('SEND', './data/1'));
$('#btn_Submit10').click(() => bm.cmd['cmd3'].execute('VIEW', './data/1'));
$('#btn_Submit11').click(() => bm.cmd['cmd3'].execute('ALL', './data/1'));
$('#btn_Submit12').click(() => bm.cmd['cmd3'].execute('PICK', './data/1'));


globalThis.bm = bm; // Make bm globally accessible