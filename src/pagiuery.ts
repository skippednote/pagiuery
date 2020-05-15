type noop = () => void;

interface ViewportOptions {
  default: number;
  increment: number;
  width: number;
}

interface ButtonOptions {
  text: string;
  class: string;
}

const enum Viewports {
  desktop = 'desktop',
  tablet = 'tablet',
  mobile = 'mobile',
}

interface PagiueryOptions {
  items?: string;
  [Viewports.desktop]: ViewportOptions;
  [Viewports.tablet]: ViewportOptions;
  [Viewports.mobile]: ViewportOptions;
  showLess: boolean;
  more: ButtonOptions;
  less: ButtonOptions;
  count: boolean;
  totalRemaining: boolean;
}

interface JQuery {
  pagiuery: (customOptions?: PagiueryOptions) => JQuery;
}

jQuery.fn.pagiuery = function pagiuery(customOptions) {
  const defaultOptions: PagiueryOptions = {
    items: 'li',
    [Viewports.desktop]: {
      default: 3,
      increment: 3,
      width: 1025,
    },
    tablet: {
      default: 2,
      increment: 2,
      width: 768,
    },
    mobile: {
      default: 1,
      increment: 1,
      width: 0,
    },
    showLess: true,
    more: {
      text: 'Show more',
      class: '',
    },
    less: {
      text: 'Show less',
      class: '',
    },
    count: true,
    totalRemaining: false,
  };

  const options = {
    ...defaultOptions,
    ...customOptions,
  };

  let items: JQuery<HTMLElement>;
  let buttonMore: JQuery<HTMLElement>;
  let buttonLess: JQuery<HTMLElement>;
  let viewport: Viewports;

  const addButtons = (
    count: number,
    showMoreItems: noop,
    showLessItems: noop,
  ) => {
    const buttonContainer = jQuery('<div class="btn-container"></div>');
    buttonMore = jQuery(
      `<button class="show-more__btn ${options.more.class}">${options.more.text}&nbsp;<span class="count-wrapper">(<span class="count">${count}</span>)</span></button>`,
    );
    if (items.length <= options[viewport].default) {
      buttonMore.hide();
    }
    buttonLess = jQuery(
      `<button class="show-less__btn ${options.less.class}">${options.less.text}</button>`,
    ).hide();
    buttonMore.click(showMoreItems);
    if (!options.count) {
      buttonMore.find('.count-wrapper').hide();
    }
    buttonLess.click(showLessItems);
    buttonContainer.append(buttonMore);
    buttonContainer.append(buttonLess);
    jQuery(this).append(buttonContainer);
  };

  const updateButtonCount = (val: number) => {
    buttonMore.find('.count').text(val);
  };

  const showMoreItems = () => {
    const status = jQuery.data(this, 'status');
    const visible = status.visible + options[viewport].increment;
    if (status.visible <= status.total) {
      items.slice(status.visible, visible).show();
      jQuery.data(this, 'status', {
        ...status,
        visible,
      });
    }
    if (visible >= status.total) {
      buttonMore.hide();
      if (options.showLess) {
        buttonLess.show();
      }
    } else {
      const diff = status.total - visible;
      const newVal =
        diff > options[viewport].increment ? options[viewport].increment : diff;
      updateButtonCount(options.totalRemaining ? diff : newVal);
    }
  };

  const showLessItems = () => {
    const status = jQuery.data(this, 'status');
    if (status.visible <= options[viewport].default) {
      buttonLess.hide();
      buttonMore.show();
    } else {
      items.slice(options[viewport].default).hide();
      jQuery.data(this, 'status', {
        ...status,
        visible: options[viewport].default,
      });
      buttonLess.hide();
      buttonMore.show();
      const diff = status.total - options[viewport].default;
      const newVal =
        diff > options[viewport].increment ? options[viewport].increment : diff;
      updateButtonCount(options.totalRemaining ? diff : newVal);
    }
  };

  const init = () => {
    const windowWidth = jQuery(window).width();
    if (windowWidth) {
      if (windowWidth > 1199) {
        viewport = Viewports.desktop;
      } else if (windowWidth > 767) {
        viewport = Viewports.tablet;
      } else {
        viewport = Viewports.mobile;
      }
      items = jQuery(this).find(`${options.items}`);
      let count;
      if (options.totalRemaining) {
        count = items.length - options[viewport].default;
      } else {
        count =
          items.length - options[viewport].default > options[viewport].increment
            ? options[viewport].increment
            : items.length - options[viewport].default;
      }
      items.slice(options[viewport].default).hide();
      jQuery.data(this, 'status', {
        total: items.length,
        visible: options[viewport].default,
      });
      addButtons(count, showMoreItems, showLessItems);
    }
  };

  init();

  return this;
};
