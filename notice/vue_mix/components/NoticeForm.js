export default {
    props: ['notice', 'statusOptions', 'bindModel'],
    data() {
      return {
        formData: { ...this.notice }
      };
    },
    emits: ['update-notice', 'delete-notice', 'deselect-notice'],
    template: `
      <div id="class-form">
        <form @submit.prevent="updateClick">
          <div class="form-group">
            <label>날짜</label>
            <p id="create_dt">{{ bindModel.cols.create_dt.value }}</p>
          </div>
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" class="form-control" id="title" v-model="bindModel.cols.title.value" required>
          </div>
          <div class="form-group">
            <label for="contents">Content</label>
            <textarea class="form-control" id="contents" v-model="bindModel.cols.contents.value" rows="3"></textarea>
          </div>
          <div class="row">
            <div class="col">
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="check1" v-model="bindModel.cols.top_yn.value" true-value="Y" false-value="N">
                <label class="form-check-label" for="check1">Top notice</label>
              </div>
            </div>
            <div class="col">
              <div class="form-check" v-for="(label, value) in statusOptions" :key="value">
                <input type="radio" class="form-check-input" :id="\`radio\${value}\`" v-model="bindModel.cols.active_cd.value" :value="value">
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
    created() {
      var _this = this;

      this.bindModel.cmd['update'].cbEnd = function(status, cmd, res) {
        if (res) {
          alert('The post has been modified.');
          _this.$emit('deselect-notice');
        }
      };
      this.bindModel.cmd['delete'].cbEnd = function(status, cmd, res) {
        if (res) {
          alert('The post has been deleted.');
          _this.$emit('deselect-notice');
        }
      };
    },
    methods: {
      updateClick() {
        for (var prop in this.formData) {
          this.bindModel.columns[prop].value = this.formData[prop];
        }
        this.bindModel.cmd.update.execute();
      },
      deleteClick() {
        this.bindModel.cmd.delete.execute();
        

      }

    }
  };