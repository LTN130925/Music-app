const container = document.querySelector('.section-comments');
const songId = container.dataset.songId;
const list = document.getElementById('comment-list');
const form = document.getElementById('comment-form');
const input = document.getElementById('comment-input');

async function loadComments() {
    const res = await fetch(`/api/song/${songId}/comments`);
    const comments = await res.json();
    list.innerHTML = '';
    comments.forEach(c => list.appendChild(renderComment(c)));
}

function renderComment(c, depth = 0) {
    const li = document.createElement('li');
    li.className = 'comment-item';

    li.innerHTML = `
        <div class="comment-header">
          <span class="comment-author">${c.author}</span>
          <span class="comment-time">${new Date(c.createdAt).toLocaleString()}</span>
        </div>
    
        <div class="comment-content">
          ${c.replyTo ? `@<strong>${c.replyTo}</strong> ` : ''}
          ${c.content}
        </div>

        <div class="comment-actions">
          <span class="like-btn ${c.isLiked ? 'active' : ''}" data-id="${c.id}" data-type="like">
            👍 ${c.likesCount}
          </span>
          <span class="dislike-btn ${c.isDisliked ? 'active' : ''}" data-id="${c.id}" data-type="dislike">
            👎 ${c.dislikesCount}
          </span>
          <span class="reply-btn">Phản hồi</span>
        </div>
      `;

    li.querySelector('.reply-btn').onclick = () => showReplyForm(li, c.id);

    li.querySelectorAll('.like-btn, .dislike-btn').forEach(btn => {
        btn.onclick = () => react(btn.dataset.id, btn.dataset.type);
    });

    if (c.replies?.length) {
        const ul = document.createElement('ul');

        ul.className = depth >= 3
            ? 'comment-replies-flat'
            : 'comment-replies';

        c.replies.forEach(r =>
            ul.appendChild(renderComment(r, depth + 1))
        );

        li.appendChild(ul);
    }

    return li;
}

function showReplyForm(parentEl, parentId) {
    if (parentEl.querySelector('.reply-form')) return;

    const form = document.createElement('form');
    form.className = 'reply-form';
    form.innerHTML = `
        <textarea placeholder="Phản hồi..."></textarea>
        <button>Gửi</button>
      `;

    form.onsubmit = async e => {
        e.preventDefault();
        const content = form.querySelector('textarea').value;

        await fetch(`/api/song/${songId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, parentId })
        });

        loadComments();
    };

    parentEl.appendChild(form);
}

async function react(commentId, type) {
    await fetch(`/api/comment/${commentId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
    });
    loadComments();
}

form.onsubmit = async e => {
    e.preventDefault();
    await fetch(`/api/song/${songId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input.value })
    });
    input.value = '';
    loadComments();
};

loadComments();