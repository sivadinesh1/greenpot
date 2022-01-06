import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
// import { useSelector } from "react-redux";

const YoutubePlayer = () => {
    // const videoPlayer = useSelector(state => state.layout.videoPlayer);

    // if (!videoPlayer.visible) {
    //     return null;
    // }

    return (
        <div className="custom-youtube-player">

            <iframe
                id="player"
                type="text/html"
                style={{ width: "100%", height: "100%" }}
                src={`http://www.youtube.com/embed/M7lc1UVf-VE?`}
                frameborder="0">
            </iframe>
            <div
                className="close d-flex justify-content-center"
            >
                <CloseIcon />
            </div>
            <div className="handle d-flex justify-content-center">
                <ZoomOutMapIcon />
            </div>
        </div>
    )

};

export default YoutubePlayer;