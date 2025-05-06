import { useEffect, useRef, useState } from "react";
import useKakaoLoader from "../../hook/useKakaoLoader";

const MapShow = ({ isOpen, className, data }) => {

    const kakaoLoaded = useKakaoLoader();
    const [ locationInfo, setLocationInfo ] = useState(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const mapInstance = useRef(null);
      
    
    useEffect(() => {
        if (isOpen && kakaoLoaded && mapRef.current && !mapInstance.current) {
            mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
                center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                level: 3,
            });
        }
    }, [isOpen, kakaoLoaded]);

    useEffect(() => {
        if (data && kakaoLoaded && isOpen && mapInstance.current) {
            const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(data, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                displayMarkers(result);
                if (!locationInfo || locationInfo.id !== result[0].id) {
                setLocationInfo(result[0]);
                }

                const latLng = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                mapInstance.current.setCenter(latLng);
            }})
        };
    }, [data, kakaoLoaded, isOpen]);
    
    const displayMarkers = (places) => {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        const bounds = new window.kakao.maps.LatLngBounds();

        places.forEach((place) => {
            const position = new window.kakao.maps.LatLng(place.y, place.x);
            const marker = new window.kakao.maps.Marker({
                map: mapInstance.current,
                position,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px; font-size:12px;">${place.place_name}</div>`,
            });

            marker.addListener("click", () => {
                infowindow.open(mapInstance.current, marker);

                setTimeout(() => {
                    infowindow.close();
                }, 2000);
            });

            markersRef.current.push(marker);
            bounds.extend(position);
        });

        mapInstance.current.setBounds(bounds);
    }

    useEffect(() => {
        if(!isOpen) {
            markersRef.current.forEach((marker) => marker.setMap(null));
            markersRef.current = [];
            mapInstance.current = null;
        }
    }, [isOpen]);

    if (!isOpen || !kakaoLoaded) return null;

    return (
        <div 
            className={className} 
            ref={mapRef}
            style={{ width: "100%", height: "710px" }}
        ></div>
    )

}

export default MapShow;