import { useEffect, useState } from "react";
import "../../css/side/locationList.css";
import { useUser } from "../../services/UserContext";
import SearchPostCode from "../../util/SearchPostCode";
import { postData, getData } from "../../services/api";
import { useToast } from "../../util/ToastContext";
import { FaCheckCircle, FaPlus, FaRegCheckCircle } from "react-icons/fa";

const LocationList = ({ onSelectLocation }) => {

    const { user } = useUser();
    const { showToast } = useToast();

    const [ showAddLocation, setShowAddLocation ] = useState(false);
    const [ showPostCode, setShowPostCode ] = useState(false);

    // 인증을 위한 토큰
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    // 입력할 주소 정보
    const [locationInfo, setLocationInfo] = useState({
        useralias: user.useralias,
        address: '',
        zoneCode: '',
        main: false,
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

    const toggleLocationMain = () => {
        setLocationInfo(prev => ({
            ...prev,
            main: !locationInfo.main,
        }));
    }

    const handleSelect = (e, loc) => {
        e.preventDefault();
        if(!onSelectLocation) return;
        onSelectLocation(loc);
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
            <div className={locs[0].main ? "location-list-box-main" : "location-list-box"} onDoubleClick={(e) => handleSelect(e, locs[0])}>
                <label className="location-list-label">
                    <a>{locs[0].label}</a>
                    {locs[0].main && <a className="location-list-label-main">대표 배송지</a>}
                </label>
                <p>{locs[0].useralias}</p>
                <p>{`[${locs[0].zoneCode}] ${locs[0].address}`}</p>
                <p>{locs[0].detail}</p>
                {modify &&
                <div className="location-list-edit">
                    {!locs[0].main &&
                    <>
                    <button className="location-list-main" onClick={(e) => setMainLocation(e, locs[0])}>대표 장소로 설정</button>
                    <a></a>
                    </>
                    }
                    <button className="location-list-delete" onClick={(e) => deleteLocation(e, locs[0])}>삭제</button>
                </div>
                }
            </div>
            </>
        );

        if(locs.length > 1) {
            return (
                <>
                <button 
                    type="button" 
                    className="modify-btn"
                    onClick={() => setModify(prev => !prev)}
                >✐ 편집</button>
                {locs.map((loc, index) => (
                <div key={loc.id || index} className={loc.main ? "location-list-box-main" : "location-list-box"} onDoubleClick={(e) => handleSelect(e, loc)}>
                    <label className="location-list-label">
                        <a>{loc.label}</a>
                        {loc.main && <a className="location-list-label-main">대표 배송지</a>}
                    </label>
                    <p>{loc.useralias}</p>
                    <p>{`[${loc.zoneCode}] ${loc.address}`}</p>
                    <p>{loc.detail}</p>
                    {modify &&
                    <div className="location-list-edit">
                        {!loc.main &&
                        <>
                        <button className="location-list-main" onClick={(e) => setMainLocation(e, loc)}>대표 장소로 설정</button>
                        <a></a>
                        </>
                        }
                        <button className="location-list-delete" onClick={(e) => deleteLocation(e, loc)}>삭제</button>
                    </div>
                    }
                </div>
                ))}
                </>
            )
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            main: locationInfo.main ? 1 : 0,
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

    const setMainLocation = async (e, loc) => {
        e.preventDefault();

        try {
            const response = await postData("/location/set-main", loc, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(response.status === 200) {
                showToast("대표 장소로 설정되었습니다!", "success");
                setLocationChanged(prev => !prev);
            }
        } catch {
            showToast("대표 장소 설정에 실패했습니다...", "error");
        }
    }

    const deleteLocation = async ( e, loc ) => {
        e.preventDefault();

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

    if(!user) return;

    return (
        <>
        {(!showAddLocation && !showPostCode) &&
        <div className="location-list-wrapper">
            <div className="list-add-box" onClick={() => setShowAddLocation(true)}>
                <FaPlus size={15} color="#666" />
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
                <button type="button" className="location-main-btn" onClick={toggleLocationMain}>
                    {locationInfo.main ?
                        <FaCheckCircle size={15} color="#74C0FC" />
                        :
                        <FaRegCheckCircle size={15} color="#74C0FC" />
                    }
                    <p>대표 배송지로 설정</p>
                </button>
                <button 
                    type="button" 
                    className="location-submit-btn"
                    onClick={(e) => handleSubmit(e)}
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