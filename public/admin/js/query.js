document.addEventListener('DOMContentLoaded', () => {
    const searchForms = document.querySelectorAll('form.search-box');
    const filterForms = document.querySelectorAll('form.filter-form');
    const selects = document.querySelectorAll('.filter-select');

    // Giữ query hiện tại khi submit form search hoặc filter
    function preserveQuery(form) {
        const params = new URLSearchParams(window.location.search);
        for (const [key, value] of params.entries()) {
            if (!form.querySelector(`[name="${key}"]`)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            }
        }
    }

    // Khi submit form search → giữ filter
    searchForms.forEach(form => {
        form.addEventListener('submit', () => preserveQuery(form));
    });

    // Khi đổi filter → giữ search
    filterForms.forEach(form => {
        form.addEventListener('submit', () => preserveQuery(form));
    });

    // Khi đổi select filter → tự submit
    selects.forEach(select => {
        select.addEventListener('change', e => {
            const form = e.target.closest('form');
            preserveQuery(form);
            form.submit();
        });
    });

    // Giữ query khi click phân trang
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const url = new URL(link.href);
            const params = new URLSearchParams(window.location.search);
            for (const [key, value] of params.entries()) {
                if (!url.searchParams.has(key)) {
                    url.searchParams.set(key, value);
                }
            }
            window.location.href = url.toString();
        });
    });
});
