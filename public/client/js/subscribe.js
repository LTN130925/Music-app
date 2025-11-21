const btnRegisterSinger = document.querySelectorAll('.button-register-singer');

if (btnRegisterSinger.length > 0) {
    btnRegisterSinger.forEach(btn => {
        btn.addEventListener('click', async () => {

            const span = btn.querySelector('span[data-id]');
            const singerId = span.getAttribute('data-id');

            const isActive = btn.classList.contains('active');
            const type = isActive ? 'unsubscribe' : 'subscribe';

            const link = `/singer/${type}/${singerId}`;

            try {
                const res = await fetch(link, { method: 'PATCH' });
                const data = await res.json();

                if (data.message !== 'success') return;

                // toggle class
                btn.classList.toggle('active');

                // icon animation
                const icon = btn.querySelector('i');
                icon.style.animation = 'none';
                icon.offsetHeight; // reset
                icon.style.animation = '';

                const metaSpan = btn.closest('.artist-info').querySelector('.meta span');
                if (metaSpan) {
                    metaSpan.innerHTML = `<i class="fas fa-id-card"></i> ${data.data} đăng ký`;
                }

            } catch (e) {
                console.error('Lỗi đăng ký ca sĩ:');
            }
        });
    });
}
