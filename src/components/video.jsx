import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// plugins
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";

videojs.options.svgIcons = true;

export const VideoJS = ({ options, onReady }) => {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);

    React.useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video");

            videoElement.classList.add("video-js", "vjs-big-play-centered");

            videoRef.current.appendChild(videoElement);

            // ✅ use SVG icons instead of font icons
            videojs.options.svgIcons = true;

            const player = (playerRef.current = videojs(videoElement, options, () => {
                videojs.log("player is ready");

                if (player.hlsQualitySelector) {
                    player.hlsQualitySelector({
                        displayCurrentQuality: true,
                    });
                }

                if (onReady) onReady(player);
            }));
        } else {
            const player = playerRef.current;
            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [options]);

    React.useEffect(() => {
        const player = playerRef.current;
        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div data-vjs-player>
            <div ref={videoRef} />
        </div>
    );
};
