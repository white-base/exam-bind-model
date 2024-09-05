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
      axios.get('/notice/data/list.json')
      .then(response => {
        // 서버로부터 목록을 가져와서 필요한 필드만 매핑
        this.notices = response.data.rows.map(row => ({
          ntc_idx: row.ntc_idx,  // 'read' 에 해당
          title: row.title,      // 'read' 에 해당
          contents: row.contents, // 'read' 에 해당
          top_yn: row.top_yn,    // 'read' 에 해당
          active_cd: row.active_cd,  // 'read' 에 해당
          create_dt: row.create_dt   // 'read' 에 해당
        })) || [];
      })
      .catch(error => {
        console.error('Error fetching notices:', error);
      });

      // fetch('/notice/data/list.json')
      //   .then(response => response.json())
      //   .then(data => {
      //     this.notices = data.rows || [];
      //   });
    },
    selectNotice(notice) {
      this.selectedNotice = notice;
      axios.get(`/notice/data/list.json`)  // RESTful : `/notice/data/${ntc_idx}.json`
        .then(response => {
          const notice = response.data;
          this.selectedNotice = {
            ntc_idx: notice.ntc_idx,
            title: notice.title,
            contents: notice.contents, 
            top_yn: notice.top_yn,
            active_cd: notice.active_cd,
            create_dt: notice.create_dt
          };
        })
        .catch(error => {
          console.error('Error reading notice:', error);
        });
    },
    deselectNotice() {
      this.selectedNotice = null;
    },
    updateNotice(notice) {
      const isValid = this.validateNotice(notice);

      if (isValid) {
        axios.put(`/notice/data/list.json`, notice) // RESTful : '/notice/update/${notice.ntc_idx}`
          .then(() => {
            console.warn('Caution: Send to the test server, but the data is not reflected.', notice);
            this.deselectNotice();
          })
          .catch(error => {
            console.error('Error updating notice:', error);
          });
      } else {
        alert('Validation failed');
      }
    },
    deleteNotice(idx) {
      const deleteNotice = {
        ntc_idx: idx
      };
      if (confirm('Are you sure you want to delete it?')){
        axios.delete(`/notice/data/list.json`, deleteNotice)  // RESTful : `/notice/delete/${ntc_idx}`
          .then(() => {
            console.warn('Caution: Send to the test server, but the data is not reflected.', deleteNotice);
            this.deselectNotice();
            // 삭제 후 공지사항 목록을 다시 불러옴
            this.fetchNotices();
          })
          .catch(error => {
            console.error('Error deleting notice:', error);
          });
      }
    },
    validateNotice(notice) {
      let isValid = true;
      if (!notice.title || notice.title === '') {
        isValid = false;
      }
      if (!notice.top_yn || (notice.top_yn !== 'Y' && notice.top_yn !== 'N')) {
        isValid = false;
      }
      if (!notice.active_cd || (notice.active_cd !== 'D' && notice.active_cd !== 'A' && notice.active_cd !== 'H')) {
        isValid = false;
      }
      return isValid;
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