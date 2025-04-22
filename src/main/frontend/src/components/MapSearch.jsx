import { useState, useEffect, useRef } from "react"
import { useToast } from "../components/ToastContext";
import useKakaoLoader from "../hook/useKakaoLoader";
import "./css/mapSearch.css";

const MapSearch = ({ isOpen, onClose, itemData, setItemData }) => {

    const kakaoLoaded = useKakaoLoader();
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const mapInstance = useRef(null);

    const { showToast } = useToast();

    useEffect(() => {
        if(isOpen && kakaoLoaded && mapRef.current) {
            mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
                center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                level: 3
            });
        }
    }, [isOpen, kakaoLoaded]);

    const handleSearch = () => {
        if(!keyword.trim) return;

        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setSearchResults(data);
                displayMarkers(data);
            }
        });
    }

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


    const handleSelectLocation = (place) => {
        if(itemData.location.length >= 3) {
            showToast("최대 3개의 장소만 저장할 수 있어요!");
            return;
        }

        if(itemData.location.some(loc => loc.id === place.id)) {
            showToast("이미 선택하신 장소입니다!");
            return;
        }

        if(!itemData.location.some(loc => loc.id === place.id)) {
            const formattedPlace = {
                id: place.id,
                placeName: place.place_name,
                addrName: place.address_name,
                addrDetail: place.road_address_name || "",
            }

            setItemData(prev => ({
                ...prev,
                location: [...prev.location, formattedPlace]
            }));
        }

        showToast("장소를 추가했습니다!");
    }

    const moveToLocation = (place) => {
        if(!mapInstance.current) return;

        const {x, y} = place;
        const latlng = new window.kakao.maps.LatLng(y, x);

        mapInstance.current.setCenter(latlng);

        if(mapInstance.current.marker) {
            mapInstance.current.marker.setMap(null);
        }

        const marker = new window.kakao.maps.Marker({
            map: mapInstance.current,
            position: latlng,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="width:200xp; padding:5px; font-size:12px;">${place.place_name}</div>`,
        });

        marker.addListener("click", () => {
            infowindow.open(mapInstance.current, marker);

            setTimeout(() => {
                infowindow.close();
            }, 2000);
        });

        mapInstance.current.marker = marker;
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    }

    if (!isOpen || !kakaoLoaded) return null;

    return (
        <div className="search-panel">
            <div className="search-header">
                <input
                    type="text"
                    placeholder="도로명, 건물명 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button type="button" onClick={handleSearch}>검색</button>
            </div>
            <div className="search-map" ref={mapRef} style={{ width: "100%", height: "300px" }}></div>
            <ul className="search-results">
                {searchResults.map((place) => (
                    <li key={place.id} onClick={() => moveToLocation(place)}>
                        <strong>{place.place_name}</strong>
                        <div>{place.address_name}</div>
                        <button type="button" onClick={(e) => {
                            e.stopPropagation();
                            handleSelectLocation(place)}}>선택</button>
                    </li>
                ))}
            </ul>
            <button className="close" onClick={onClose}>닫기</button>
        </div>
    )
}

export default MapSearch;