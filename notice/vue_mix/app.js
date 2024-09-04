import NoticeList from './components/NoticeList.js';
import NoticeForm from './components/NoticeForm.js';
import NoticeAdminService from './service/notice-admin-svc.js'

const { createApp, ref } = Vue

// Vue.devtools = true; // e

const bm = new _L.BindModel(new NoticeAdminService());  

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
    fetchNotices() {
      fetch('/notice/data/list.json')
        .then(response => response.json())
        .then(data => {
          this.notices = data.rows || [];
        });
    },
    selectNotice(notice) {
      this.selectedNotice = notice;
    },
    deselectNotice() {
      this.selectedNotice = null;
    },
    updateNotice(notice) {
      // POINT: 여기서 처리하면 됨
      // bm.
      alert('Notice updated successfully');
      this.deselectNotice();
    },
    deleteNotice() {
      alert('Notice deleted successfully');
      this.deselectNotice();
    }
  },
  mounted() {
    this.fetchNotices();
  },
  components: {
    'notice-list': NoticeList,
    'notice-form': NoticeForm
  }
});

app.mount('#app');