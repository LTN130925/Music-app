function convertHtmlToLrc(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    let text = temp.innerHTML;

    text = text.replace(/<\/?div[^>]*>/g, "");
    text = text.replace(/<\/?pre[^>]*>/g, "");
    text = text.replace(/<br\s*\/?>/gi, "\n");

    text = text.replace(/\r/g, "")
        .replace(/\n+/g, "\n")
        .trim();

    return text;
}

const getId = document.getElementById('aplayer');

if (getId) {
    const getDataId = JSON.parse(getId.getAttribute('data'));
    console.log(convertHtmlToLrc(getDataId.lyrics));

    const ap = new APlayer({
        container: getId,
        autoplay: true,
        fixed: false,
        mini: false,
        lrcType: 1,
        audio: [{
            name: getDataId.title,
            artist: getDataId.singerId.fullName,
            url: getDataId.audio,
            cover: getDataId.avatar,
            lrc: convertHtmlToLrc(getDataId.lyrics),
        }]
    });

    const avatar = document.querySelector('.cover');

    ap.on('play', () => avatar.style.animationPlayState = 'running');
    ap.on('pause', () => avatar.style.animationPlayState = 'paused');
}
