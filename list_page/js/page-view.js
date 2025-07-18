// page-view.js
/**
 * PageView 클래스 - 페이징 모듈 개선 버전 (ESM)
 */

function renderTemplate(template, values) {
  return template.replace(/{{(\w+)}}/g, function (_, key) {
    return values[key] !== undefined ? values[key] : '';
  });
}

export class PageView {
  constructor(
    selector,
    pageSize = 10,
    pageGroup = 5,
    isOuterBlock = true,
    isNextBlock = true
  ) {
    this.container =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!this.container) {
      throw new Error('Pagination container not found');
    }

    this.page_size = pageSize;
    this.page_group = pageGroup;
    this.page_count = 1;
    this.row_total = -1;
    
    /**
     * Callback function called when page is moved
     * Define row_total settings and associated actions.
     * @typedef {function} PageViewCallback
     * @param {number} [pageCount] Select page
     * @returns {Promise<void>}
     */
    this.callback = null;

    this.isOuterBlock = isOuterBlock;
    this.isNextBlock = isNextBlock;

    this.bindEvents();

    this.templates = {
      wrapperStart: "<ul class='pagination justify-content-center'>",
      wrapperEnd: '</ul>',
      first:
        "<li class='page-item'><a class='page-link' data-page='{{PAGE_COUNT}}'><span>처음</span></a></li>",
      last: "<li class='page-item'><a class='page-link' data-page='{{PAGE_COUNT}}'><span>마지막</span></a></li>",
      blockPrev:
        "<li class='page-item'><a class='page-link' data-page='{{PAGE_COUNT}}'><span>이전페이지</span></a></li>",
      blockNext:
        "<li class='page-item'><a class='page-link' data-page='{{PAGE_COUNT}}'><span>다음페이지</span></a></li>",
      pagePrev:
        "<li class='page-item'><a class='page-link' data-page='{{PAGE_COUNT}}'><span>이전</span></a></li>",
      pageNext:
        "<li class='page-item'><a class='page-link' data-page='{{PAGE_COUNT}}'><span>다음</span></a></li>",
      active:
        "<li class='page-item active'><a class='page-link' href='#'><span>{{PAGE_COUNT}}</span></a></li>",
      normal:
        "<li class='page-item'><a class='page-link' data-page='{{PAGE_COUNT}}'><span>{{PAGE_COUNT}}</span></a></li>",
    };
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const target = e.target.closest('.page-link');
      if (target && target.dataset.page) {
        const page = parseInt(target.dataset.page, 10);
        if (!isNaN(page)) {
          this.move(page);
        }
      }
    });
  }
  /**
   * row_total 설정 및 연결되는 처리를 정의합니다.
   * @param {number} [pageCount] 선택 페이지
   * @override
   */
  async move(pageCount) {
    if (typeof this.callback === 'function')
      await this.callback.call(this, pageCount);
    const html = this.parser(pageCount);
    this.container.innerHTML = html;
  }

  /**
   * 페이징 파서
   * @param {number} [pageCount] 선택 페이지
   * @param {number} [rowTotal] 전체 게시물 갯수
   */
  parser(pageCount, rowTotal) {
    this.page_count = pageCount || this.page_count;
    this.row_total = rowTotal || this.row_total;

    if (this.row_total <= 0) {
      this.page_count = 1;
      return '';
    }

    const totalPage = Math.ceil(this.row_total / this.page_size);
    const blockStart =
      Math.floor((this.page_count - 1) / this.page_group) * this.page_group + 1;
    const blockEnd = Math.min(totalPage, blockStart + this.page_group);

    const ctx = this.templates;
    let html = ctx.wrapperStart;

    if (this.page_count > 1 && this.isOuterBlock) {
      html += renderTemplate(ctx.first, { PAGE_COUNT: 1 });
    }

    if (blockStart > this.page_group) {
      html += renderTemplate(ctx.blockPrev, {
        PAGE_COUNT: blockStart - 1,
      });
    }

    if (this.page_count > 1 && this.isNextBlock) {
      html += renderTemplate(ctx.pagePrev, {
        PAGE_COUNT: this.page_count - 1,
      });
    }

    for (let i = blockStart; i < blockEnd; i++) {
      if (i === this.page_count) {
        html += renderTemplate(ctx.active, { PAGE_COUNT: i });
      } else {
        html += renderTemplate(ctx.normal, { PAGE_COUNT: i });
      }
    }

    if (this.page_count < totalPage && this.isNextBlock) {
      html += renderTemplate(ctx.pageNext, {
        PAGE_COUNT: this.page_count + 1,
      });
    }

    if (blockEnd <= totalPage - 1) {
      html += renderTemplate(ctx.blockNext, { PAGE_COUNT: blockEnd });
    }

    if (this.page_count < totalPage && this.isOuterBlock) {
      html += renderTemplate(ctx.last, { PAGE_COUNT: totalPage });
    }

    html += ctx.wrapperEnd;
    return html;
  }
}
