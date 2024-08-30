import NoticeList from './components/NoticeList.js';
import NoticeForm from './components/NoticeForm.js';

const { createApp, ref } = Vue

const app = createApp({
  data() {
    return {
      notices: [],
      selectedNotice: null,
      statusOptions: {
        'D': 'Standby',
        'A': 'Activation',
        'H': 'Hidden'
      }
    };
  },
  methods: {
    fetchNotices() {
      fetch('../data/list.json')
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