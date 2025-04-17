import { useState } from "react"

const LocationPicker = () => {
    const [ address, setAddress ] = useState('');
    const [ showMap, setShowMap ] = useState(false);
    const [ coords, setCoords ] = useState({lat: null, lng: null});

    const handleAdressSearch = () => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, function(result, status) {
            if(status === window.kakao.maps.services.Status.OK) {
                const { x, y } = result[0];
                setCoords({ lat: y, lng: x });
                setShowMap(true);
            } else {
                alert("주소를 찾을 수 없어요!");
            }
        })
    }

    return (
        <div>
            <input 
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="주소 입력"
            />
            <button onClick={handleAdressSearch}>주소확인</button>

            {showMap && (
                <div className="map-modal">
                    <div id="map" style={{ width: "100%", height: "300px" }}></div>
                    <button onClick={() => setShowMap(false)}>닫기</button>
                </div>
            )}
        </div>
    )
}

export default LocationPicker;