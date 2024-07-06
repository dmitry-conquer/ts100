interface SearchOptions {
    baseUrl: string;
    postTypes: string[];
    showPosts: number;
}

interface Post {
    link: string;
    title: {
        rendered: string;
    };
}

class Search {
    private defaults: SearchOptions;
    private settings: SearchOptions;
    private button: HTMLButtonElement | null;
    private input: HTMLInputElement | null;
    private results: HTMLElement | null;
    private body: HTMLElement | null;
    constructor(options: Partial<SearchOptions> = {}) {
        this.defaults = {
            baseUrl: `https://${window.location.host}/wp-json/wp/v2`,
            postTypes: ['posts'],
            showPosts: 6,
        };
        this.settings = { ...this.defaults, ...options };
        this.button = document.getElementById('wp-search-button') as HTMLButtonElement;
        this.input = document.getElementById('wp-search-input') as HTMLInputElement;
        this.results = document.getElementById('wp-search-results') as HTMLElement;
        this.body = document.getElementById('wp-search-body') as HTMLElement;
    }

    public init() {
        this.addEventListeners();
    }

    async getPostData(type: string, search: string): Promise<Post[]> {
        try {
            const response: Response = await fetch(
                `${this.settings.baseUrl}/${type}/?search=${search}`,
            );
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${type}`);
            }
            return response.json();
        } catch (error) {
            this.showMessage('Search error!');
            console.warn(`Error ${type}:`, error);
            return [];
        }
    }

    private async getData(search: string): Promise<void> {
        this.showMessage('Shearching...');
        const promises: Promise<Post[]>[] = this.settings.postTypes.map(type =>
            this.getPostData(type, search),
        );
        try {
            const content: Post[][] = await Promise.all(promises);
            const allContent: Post[] = content.flat();
            if (allContent.length !== 0) {
                this.render(allContent);
            }
        } catch (error) {
            console.warn('Error:', error);
            this.showMessage('Search error!');
        }
    }

    private render(data: Post[]): void {
        const inputValue = this.input?.value ?? '';
        const filteredData = data
            .filter(post => post.title.rendered.toLowerCase().includes(inputValue.toLowerCase()))
            .slice(0, this.settings.showPosts);
        if (filteredData.length) {
            const template = filteredData
                .map(
                    article =>
                        `<div class="wp-search-item"><a target="_blank" href="${article.link}">${this.highlightResult(article.title.rendered, inputValue)}</a></div>`,
                )
                .join('');
            if (this.results) {
                this.results.innerHTML = template;
            }
        } else {
            this.showMessage('No results found.');
        }
    }

    private highlightResult(string: string, substring: string): string {
        return string.replace(
            new RegExp(substring, 'gi'),
            match => `<b style="color: red;">${match}</b>`,
        );
    }

    private showMessage(message: string): void {
        if (this.results) {
            this.results.innerHTML = `<div class="wp-search-empty">${message}</div>`;
        }
    }

    private isSearchEmpty(): boolean {
        if (this.input) this.input.value === '';
        return false;
    }

    private clearResults(): void {
        if (this.results) this.results.innerHTML = '';
    }

    private toogleSearchForm(): void {
        this.body?.classList.toggle('open');
        this.input?.focus();
    }

    private outClickSearchForm(e: MouseEvent): void {
        if (!(e.target as HTMLElement).closest('#wp-search-body') && e.target !== this.button) {
            this.body?.classList.remove('open');
        }
    }

    private addEventListeners(): void {
        this.input?.addEventListener('input', e => {
            const target = e.target as HTMLInputElement;
            if (!this.isSearchEmpty()) {
                this.getData(target?.value);
            } else {
                this.clearResults();
            }
        });
        this.button?.addEventListener('click', () => this.toogleSearchForm());
        document.addEventListener('click', e => this.outClickSearchForm(e));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const search = new Search({
        baseUrl: `https://mediacomponents.com/wp-json/wp/v2`,
        postTypes: ['posts'],
        showPosts: 3,
    });
    search.init();
});
