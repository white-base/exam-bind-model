export default {
    props: ['notice', 'statusOptions'],
    data() {
      return {
        formData: { ...this.notice }
      };
    },
    emits: ['update-notice', 'delete-notice', 'deselect-notice'],
    template: `
      <div id="class-form">
        <form @submit.prevent="update">
        <input type="hidden" id="ntc_idx" value="{{ notice.ntc_idx }}">
          <div class="form-group">
            <label for="create_dt">날짜</label>
            <p id="create_dt">{{ notice.create_dt }}</p>
          </div>
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" class="form-control" id="title" v-model="formData.title" required>
          </div>
          <div class="form-group">
            <label for="contents">Content</label>
            <textarea class="form-control" id="contents" v-model="formData.contents" rows="3"></textarea>
          </div>
          <div class="row">
            <div class="col">
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="check1" v-model="formData.top_yn">
                <label class="form-check-label" for="check1">Top notice</label>
              </div>
            </div>
            <div class="col">
              <div class="form-check" v-for="(label, value) in statusOptions" :key="value">
                <input type="radio" class="form-check-input" :id="\`radio\${value}\`" v-model="formData.active_cd" :value="value">
                <label class="form-check-label" :for="\`radio\${value}\`">{{ label }}</label>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-3">Update</button>
          <button type="button" class="btn btn-danger mt-3" @click="deleteClick">Delete</button>
          <button type="button" class="btn btn-secondary mt-3" @click="$emit('deselect-notice')">List</button>
        </form>
      </div>
    `,
    methods: {
      update() {
        if (!this.formData.title) {
          alert('Title is required.');
          return;
        }
        this.$emit('update-notice', this.formData);
      },
      deleteClick() {
        if (!this.formData.ntc_idx) {
          alert('ntc_idx is required.');
          return;
        }
        this.$emit('delete-notice', this.formData.ntc_idx);
      }
    }
  };