import NoticeList from './components/NoticeList.js';
import NoticeForm from './components/NoticeForm.js';
import NoticeAdminService from './service/notice-admin-svc.js'

// import * as j from 'https://cdn.skypack.dev/jquery'

const { createApp} = Vue;
const bm = new _L.BindModel(new NoticeAdminService());  

bm.url =' /notice/data/list.json';

const app = createApp({
  data() {
    return {
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
    selectNotice(idx) {
      this.selectedNotice = idx;
    },
    deselectNotice() {
      this.selectedNotice = null;
    },
    updateNoticeList() {
      this.$refs.noticeList.listClick();
    }
  },
  components: {
    'notice-list': NoticeList,
    'notice-form': NoticeForm
  }
});

app.mount('#app');