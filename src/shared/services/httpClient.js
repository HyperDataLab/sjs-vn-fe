/**
 * httpClient.js
 * Axios instance dùng chung cho toàn bộ dự án, tuân thủ FRONTEND_STRUCTURE_REVIEW_GUIDE.md.
 * Kế thừa toàn bộ cấu hình Mutex Token Refresh từ api.js.
 */
import api, { publicApi } from './api';

export { publicApi };
export default api;
