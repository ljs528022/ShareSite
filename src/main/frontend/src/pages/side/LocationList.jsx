import { useEffect, useState } from "react";
import "../../css/side/locationList.css";
import { useUser } from "../../services/UserContext";
import SearchPostCode from "../../util/SearchPostCode";
import { postData, getData } from "../../services/api";
import { useToast } from "../../util/ToastContext";

const LocationList = () => {

    const { user } = useUser();
    const { showToast } = useToast();

    const [ showAddLocation, setShowAddLocation ] = useState(false);
    const [ showPostCode, setShowPostCode ] = useState(false);

    // 인증을 위한 토큰큰
    const token = sessionStorage.getItem("token");

    // 입력할 주소 정보
    const [locationInfo, setLocationInfo] = useState({
        useralias: user.useralias,
        address: '',
        zoneCode: '',
        detail: '',
        label: ''
    });

    // 받아온 주소 정보들
    const [ userLocations, setUserLocations ] = useState(null);
    const [ locationChanged, setLocationChanged ] = useState(false);
    const [ modify, setModify ] = useState(false);

    const handleComplete = ({ address, zoneCode }) => {
        setLocationInfo((prev) => ({
            ...prev,
            address,
            zoneCode
        }));
        setShowPostCode(false);
    }

    useEffect(() => {
        const getUserLocations = async () => {
            try {
                const response = await getData(`/location/${user.userKey}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if(response.status === 200) {
                    setUserLocations(response.data);
                }
            } catch (err) {
                showToast("통신 장애가 발생했습니다!", "error");
                console.log(err);
            }
        }
        getUserLocations();
    }, [locationChanged])

    const fetchUserLocation = (locs) => {
        if(!locs || locs.length === 0) return;

        if(locs.length === 1) return (
            <>
            <button 
                type="button" 
                className="modify-btn"
                onClick={() => setModify(prev => !prev)}
            >✐ 편집</button>
            <div className="location-list-box">
                <label>{locs[0].label}</label>
                <p>{locs[0].useralias}</p>
                <p>{`[${locs[0].zoneCode}] ${locs[0].address}`}</p>
                <p>{locs[0].detail}</p>
                {modify &&
                <button onClick={() => deleteLocation(locs[0])}>삭제</button>
                }
            </div>
            </>
        );

        if(locs.length > 1) {
            return (
                <>
                {locs.map((loc, index) => (
                <>
                <button 
                    type="button" 
                    className="modify-btn"
                    onClick={() => setModify(prev => !prev)}
                >✐ 편집</button>
                <div key={index} className="location-list-box">
                    <label>{loc.label}</label>
                    <p>{loc.useralias}</p>
                    <p>{`[${loc.zoneCode}] ${loc.address}`}</p>
                    <p>{loc.detail}</p>
                    {modify &&
                    <button onClick={() => deleteLocation(loc)}>삭제</button>
                    }
                </div>
                </>
                ))}
                </>
            )
        }
    }

    const deleteLocation = async ( loc ) => {
        try {
            const response = await postData("/location/delete", loc, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(response.status === 200) {
                showToast("해당 장소를 삭제했습니다!", "success");
                setLocationChanged(prev => !prev);
            }
        } catch (err) {
            showToast("장소를 삭제하는 데에 실패했습니다...", "error");
            console.log(err);
        }

    }

    const handleSubmit = async () => {
        if(!locationInfo && !userLocations) return;

        if(userLocations.length > 5) {
            showToast("장소 등록은 최대 5개까지만 가능합니다!", "error");
            return;
        }

        const addLocation = {
            userKey: user.userKey,
            itemKey: '',
            useralias: user.useralias,
            address: locationInfo.address,
            zoneCode: locationInfo.zoneCode,
            detail: locationInfo.detail || '',
            label: locationInfo.label
        }
        
        if(addLocation.address === '') {
            showToast("주소를 검색해주세요!", "error");
            return;
        } else if(addLocation.label === '') {
            showToast("배송지명이 입력되지 않았습니다!", "error");
            return;
        }

        try {
            const response = await postData("/user/location", addLocation, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(response.status === 200) {
                showToast( "입력하신 장소가 등록되었습니다!", "success");
                setShowAddLocation(false);
                setLocationInfo({
                    address: '',
                    zoneCode: '',
                    detail: '',
                    label: ''
                })
                setLocationChanged(prev => !prev);
            }
        } catch (err) {
            if(err.status === 400) {
                showToast("이미 등록된 주소입니다! 다른 주소를 등록해주세요", "error");
                setLocationInfo({
                    address: '',
                    zoneCode: '',
                    detail: '',
                    label: ''
                });
            } else {
                showToast("통신 장애가 발생했습니다!", "error");
                console.log(err);
            }
        }
    }

    if(!user) return;

    return (
        <>
        {(!showAddLocation && !showPostCode) &&
        <div className="location-list-wrapper">
            <div className="list-add-box" onClick={() => setShowAddLocation(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="17" width="20" viewBox="0 0 448 512">
                    <path fill="#6e6e6e" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
                </svg>
                <label>배송지 추가</label>
            </div>
        </div>
        }
        {(showAddLocation && !showPostCode) ?
        <div className="location-list-wrapper">
            <div className="list-add-input">
                <input 
                    type="text" 
                    className="location-input" 
                    placeholder="배송지명"
                    autoComplete="off"
                    value={locationInfo.label}
                    onChange={(e) => {
                        setLocationInfo(prev => ({ ...prev, label: e.target.value }))
                    }}
                />
                <input type="text" className="location-input" disabled value={user.useralias} />
                <button 
                    type="button" 
                    className="location-button"
                    onClick={() => setShowPostCode(true)}
                >주소 검색</button>
                {locationInfo.address &&
                <>
                <input 
                    type="text" 
                    className="location-input" 
                    disabled 
                    value={locationInfo.zoneCode ? `[${locationInfo.zoneCode}] ${locationInfo.address}` : ''}
                />
                <input 
                    type="text" 
                    className="location-input" 
                    placeholder="상세주소(ex: 101동 102호)"
                    autoComplete="off"
                    value={locationInfo.detail}
                    onChange={(e) => 
                        setLocationInfo(prev => ({ ...prev, detail: e.target.value }))
                    }
                />
                </>
                }
                <button 
                    type="button" 
                    className="location-submit-btn"
                    onClick={() => handleSubmit()}
                >완료</button>
            </div>
            <button 
                className="location-back-btn"
                onClick={() => setShowAddLocation(false)}
            >돌아가기</button>
        </div>
        :
        <div className="location-list-wrapper">
            {(userLocations && !showPostCode) && 
            <>
                {fetchUserLocation(userLocations)}
            </>
            }    
        </div>
        }
        {showPostCode && (
            <>
                <SearchPostCode onComplete={handleComplete} />
                <button 
                    className="location-back-btn"
                    onClick={() => setShowPostCode(false)}
                >돌아가기</button>
            </>
        )}
        </>
    )
}

export default LocationList;