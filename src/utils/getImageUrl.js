const API_URL = "http://127.0.0.1:8000";
const getImageUrl = (src) => {
    if (!src) return "";
    const value = String(src).replace(/\\/g, "/");
    if (/^(https?:|data:|blob:)/i.test(value)) {
        return value;
    }
    return `${API_URL}/${value}`.replace(/([^:]\/)\/+/g, "$1");
};
export { getImageUrl };
export default getImageUrl;