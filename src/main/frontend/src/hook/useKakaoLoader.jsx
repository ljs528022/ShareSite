import { useEffect, useState } from "react";

const useKakaoLoader = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(window.kakao && window.kakao.maps) {
            setLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=cb0181e262f186a81ea419d7f7468de6&libraries=services&autoload=false`;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                setLoaded(true);
            })
        }
        document.head.appendChild(script);
    }, []);

    return loaded;
}

export default useKakaoLoader;