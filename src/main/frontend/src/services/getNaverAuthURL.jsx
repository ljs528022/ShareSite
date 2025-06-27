export const getNaverAuthURL = () => {
    const baseURL = "https://nid.naver.com/oauth2.0/authorize";
    const clientId = "BrUMPDx5cFHxILSg8pRM";
    const redirectURI = encodeURIComponent("http://localhost:5178/user/naver-login");
    const state = generateRandomState();

    localStorage.setItem("naver_auth_state", state);

    return `${baseURL}?response_type=code&client_id=${clientId}&redirect_uri=${redirectURI}&state=${state}`;
}

const generateRandomState = () => {
    return Math.random().toString(36).substring(2, 15);
}