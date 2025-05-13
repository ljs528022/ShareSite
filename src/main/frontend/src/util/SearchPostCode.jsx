import { useEffect, useRef, useState } from "react";
import "../css/side/locationList.css";

const SearchPostCode = ({ onComplete }) => {

    const [ scriptLoaded, setScriptLoaded ] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if(!scriptLoaded || !window.daum?.Postcode) return;

        new window.daum.Postcode({
            oncomplete: function (data) {
                onComplete({
                    address: data.address,
                    zoneCode: data.zonecode
                });
            },
            width: '100%',
        }).embed(elementRef.current);
    }, [scriptLoaded]);

    return <div ref={elementRef} style={{ width: '100%', marginTop: 10, marginBottom: 10 }} />
}

export default SearchPostCode;