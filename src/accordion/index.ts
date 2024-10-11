  class Accordion {
    private accordionTriggers: NodeListOf<HTMLElement>;
    constructor() {
      this.accordionTriggers = document.querySelectorAll('.item-faq__header');
    }
    public init() {
      this.initListeners();
    }
    private initListeners() {
      this.accordionTriggers.forEach(el => {
        el?.addEventListener('click', () => this.handleToggle(el.nextElementSibling as HTMLElement, el as HTMLElement));
      });
    }
    private handleToggle(content: HTMLElement, trigger: HTMLElement) {
      content.style.maxHeight = content.style.maxHeight === '' ? `${content.scrollHeight}px` : '';
      trigger.classList.toggle('_faq-active');
    }
  }
  const accordion = new Accordion();
  accordion.init();