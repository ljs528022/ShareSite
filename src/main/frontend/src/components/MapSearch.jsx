import { useState, useEffect, useRef } from "react"
import useKakaoLoader from "../hook/useKakaoLoader";
import "./css/mapSearch.css";

const MapSearch = ({ isOpen, onClose, itemData, setItemData }) => {

    const kakaoLoaded = useKakaoLoader();
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if(isOpen && kakaoLoaded && mapRef.current) {
            mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
                center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                level: 3
            });
        }
    }, [isOpen, kakaoLoaded]);

    const handleSearch = () => {
        if(!kakaoLoaded) return;

        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setSearchResults(data);

                const firstPlace = data[0];
                const latLng = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);
                mapInstance.current.setCenter(latLng);
            }
        });
    }


    const handleSelectLocation = (place) => {
        if(!itemData.location.some(loc => loc.id === place.id)) {
            setItemData(prev => ({
                ...prev,
                location: [...prev.location, place]
            }));
        }
    }

    if (!isOpen || !kakaoLoaded) return null;

    return (
        <div className="search-panel">
            <div className="search-header">
                <input
                    type="text"
                    placeholder="도로명, 건물명, 지번, 초성검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="button" onClick={handleSearch}>검색</button>
            </div>
            <div className="search-map" ref={mapRef} style={{ width: "100%", height: "300px" }}></div>
            <ul className="search-results">
                {searchResults.map((place) => (
                    <li key={place.id} onClick={() => handleSelectLocation(place)}>
                        <strong>{place.place_name}</strong>
                        <div>{place.address_name}</div>
                    </li>
                ))}
            </ul>
            <button className="close" onClick={onClose}>닫기</button>
        </div>
    )
}

export default MapSearch;