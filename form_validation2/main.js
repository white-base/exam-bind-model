import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';
import FormService from './service.js';

const bm = new BindModel(new FormService());

$('#btn_Submit').click(() => bm.cmd['create'].execute());

globalThis.bm = bm; // Make bm globally accessible