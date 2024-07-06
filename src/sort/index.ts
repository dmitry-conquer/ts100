class Sort {
    private buttons: NodeListOf<HTMLInputElement>;
    private slides: NodeListOf<HTMLElement>;
    constructor() {
        this.buttons = document.querySelectorAll('.sort-button') as NodeListOf<HTMLInputElement>;
        this.slides = document.querySelectorAll('[data-cat]') as NodeListOf<HTMLElement>;
        this.init();
    }
    public init(): void {
        this.addListeners();
        this.hideSliders();
    }
    private addListeners(): void {
        this.buttons.forEach(b => {
            b.addEventListener('change', e => this.sort(e));
        });
    }

    private hideSliders(): void {
        setTimeout(() => {
              this.slides.forEach(s => {
                  const parent = s.parentNode as HTMLElement;
                  if (parent.classList.contains('pre-hidden-sliders')) {
                      parent.classList.add('invisible-slider');
                  }
              });
        }, 700);
    }

    private sort(e: Event): void {
        const target = e.target as HTMLInputElement | null;
        const cat: string | undefined = target?.value;
        if (cat) {
            this.slides.forEach(s => {
                const parent = s.parentNode as HTMLElement;
                if (s && parent) {
                    parent.classList.remove('invisible-slider');
                    if (s.dataset.cat !== cat) {
                        parent.classList.add('invisible-slider');
                    }
                }
            });
        }
    }
}

const sort = new Sort();
sort.init();
