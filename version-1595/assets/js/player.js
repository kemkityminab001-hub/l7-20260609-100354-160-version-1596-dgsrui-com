(function () {
    const players = Array.from(document.querySelectorAll(".js-player"));

    players.forEach(function (player) {
        const video = player.querySelector("video");
        const cover = player.querySelector(".player-cover");
        const source = player.getAttribute("data-video");
        let ready = false;
        let hls = null;

        if (!video || !source) {
            return;
        }

        const attach = function () {
            if (ready) {
                return;
            }

            ready = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
                return;
            }

            video.src = source;
        };

        const start = function () {
            attach();
            player.classList.add("is-playing");
            video.controls = true;
            const attempt = video.play();

            if (attempt && attempt.catch) {
                attempt.catch(function () {
                    player.classList.remove("is-playing");
                });
            }
        };

        if (cover) {
            cover.addEventListener("click", start);
        }

        video.addEventListener("click", function () {
            if (!ready) {
                start();
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hls && hls.destroy) {
                hls.destroy();
            }
        });
    });
}());
