const cards: NodeListOf<HTMLElement> = document.querySelectorAll(
    '.person-card',
) as NodeListOf<HTMLElement>;

const toggleLang = (card: HTMLElement): void => {
    const langs = card.querySelectorAll('.lang');
    langs.forEach(lang => {
        if (lang.classList.contains('hidden-lang')) {
            lang.classList.remove('hidden-lang');
        } else {
            lang.classList.add('hidden-lang');
        }
    });
};

cards.forEach(card => {
    if (card) {
        const button = card.querySelector('.toggle-lang') as HTMLButtonElement;
        button?.addEventListener('click', () => toggleLang(card));
    }
});
