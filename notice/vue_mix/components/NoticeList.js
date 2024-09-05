export default {
    props: ['notices', 'bindModel'],
    emits: ['select-notice'],
    template: `
      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="bindModel.cmd.list.output.rows.length === 0">
            <td colspan="3">There is no content.</td>
          </tr>
          <tr v-for="(notice, index) in bindModel.cmd.list.output.rows" :key="notice.ntc_idx">
            <td><a href="#" @click.prevent="$emit('select-notice', index)">{{ notice.title }}</a></td>
            <td>{{ notice.active_cd }}</td>
            <td>{{ notice.create_dt }}</td>
          </tr>
        </tbody>
      </table>
    `,
    async created() {     
      await this.bindModel.cmd['list'].execute();
    },
  };