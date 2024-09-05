import NoticeList from './components/NoticeList.js';
import NoticeForm from './components/NoticeForm.js';
import NoticeAdminService from './service/notice-admin-svc.js'

const { createApp, ref } = Vue
const bm = new _L.BindModel(new NoticeAdminService());  

bm.url =' /notice/data/list.json';

const app = createApp({
  data() {
    return {
      notices: [],
      selectedNotice: null,
      statusOptions: {
        'D': 'Standby',
        'A': 'Activation',
        'H': 'Hidden'
      },
      bindModel: bm,
    };
  },
  methods: {
    async selectNotice(idx) {
      bm.cmd['read'].outputOption.index = Number(idx);
      await bm.command['read'].execute();
      this.selectedNotice = idx;
    },
    deselectNotice() {
      this.selectedNotice = null;
    },
  },
  components: {
    'notice-list': NoticeList,
    'notice-form': NoticeForm
  }
});

app.mount('#app');