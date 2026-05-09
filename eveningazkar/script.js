
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.azkar-item').forEach(itemElement => {
        const countElement = itemElement.querySelector('.azkar-count');
        const maxCount = parseInt(countElement.dataset.max, 10);
        let currentCount = 0;

        countElement.textContent = `${currentCount} / ${maxCount}`;

        itemElement.addEventListener('click', () => {
            if (currentCount < maxCount) {
                currentCount++;
                countElement.textContent = `${currentCount} / ${maxCount}`;
            }
        });
    });
});