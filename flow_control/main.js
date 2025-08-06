import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';

const bm = new BindModel({
    items: {
        u_name:      { selector: '#inputName' },
        email:      { selector: '#inputEmail' },
    },
    // global execute event
    onExecute: (model, cmd) => {
        console.log('1 step : onExecute(global)');
    },
    onExecuted: (model, cmd) => {
        console.log('5 step : onExecuted(global)');
    },

    cbBaseBegin(model, cmd) {
        console.log('3-1 step : cbBaseBegin');
    },
    cbBaseValid(valid, cmd) {
        console.log('3-2 step : cbBaseValid');
        return true;
    },
    cbBaseBind(bind, cmd, config) {
        console.log('3-3 step : cbBaseBind');
    },
    cbBaseResult(data, cmd, res) {
        console.log('3-4 step : cbBaseResult');
    },
    cbBaseOutput(outputs, cmd, res) {
        console.log('3-5 step : cbBaseOutput, option == ("VIEW", "ALL", "PICK")');
    },
    cbBaseEnd(status, cmd, res) {
        console.log('3-6 step : cbBaseEnd');
    },

    command: {
        cmd1: {
            // command execute event
            onExecute: (model, cmd) => {
                console.log('2 step : onExecute');
            },
            onExecuted: (model, cmd) => {
                console.log('4 step : onExecuted');
            },
            
            cbBegin(model, cmd) {
                console.log('3-1 step : cbBegin');
            },
            cbValid(valid, cmd) {
                console.log('3-2 step : cbValid');
                return true;
            },
            cbBind(bind, cmd, config) {
                console.log('3-3 step : cbBind');
            },
            cbResult(data, cmd, res) {
                console.log('3-4 step : cbResult');
            },
            cbOutput(outputs, cmd, res) {
                console.log('3-5 step : cbOutput, option == ("VIEW", "ALL", "PICK")');
            },
            cbEnd(status, cmd, res) {
                console.log('3-6 step : cbEnd');
            },

        },
        cmd2: {
            onExecute: (model, cmd) => {
                console.log('2 step : onExecute');
            },
            onExecuted: (model, cmd) => {
                console.log('4 step : onExecuted');
            },
        },
        cmd3: {
            onExecute: (model, cmd) => {
                console.log('2 step : onExecute');
            },
            onExecuted: (model, cmd) => {
                console.log('4 step : onExecuted');
            },

            cbBegin(model, cmd) {
                console.log('3-1 step : cbBegin');
            },
            cbValid(valid, cmd) {
                console.log('3-2 step : cbValid');
                return true;
            },
        }

    },

    mapping: {
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