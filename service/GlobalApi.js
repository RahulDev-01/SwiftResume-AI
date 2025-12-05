import axios from "axios";


const API_KEY = import.meta.env.VITE_STRAPI_API_KEY
// Ensure trailing slash so axios concatenates correctly (avoids '/apiuser-resumes')
const base = (import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "") + "/api/";

// Check if backend is on Render (free tier has slow cold starts)
const isRenderBackend = base.includes('render.com') || base.includes('onrender.com');

const axiousClient = axios.create({
    baseURL : base,
    headers :{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${API_KEY}`
    },
    timeout: isRenderBackend ? 60000 : 30000, // 60s for Render (cold starts), 30s for others
})

// Request interceptor - add retry logic for timeouts
axiousClient.interceptors.request.use(
    (config) => {
        // Mark requests that should be retried
        config._retryCount = config._retryCount || 0;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors gracefully
axiousClient.interceptors.response.use(
    (resp)=>resp,
    async (error) => {
        const cfg = error?.config || {};
        const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
        const isNetworkError = !error.response && error.request;
        
        // Only log errors in development or if they're not timeouts
        if (import.meta.env.DEV || (!isTimeout && !isNetworkError)) {
            try {
                console.error('API Error:', {
                    method: cfg.method,
                    url: cfg.baseURL + (cfg.url || ''),
                    status: error?.response?.status,
                    data: error?.response?.data
                });
            } catch { /* noop */ }
        }
        
        // Retry timeout/network errors automatically (max 2 retries)
        if ((isTimeout || isNetworkError) && cfg._retryCount < 2 && !cfg._skipRetry) {
            cfg._retryCount = (cfg._retryCount || 0) + 1;
            const delay = Math.pow(2, cfg._retryCount - 1) * 1000; // 1s, 2s
            await new Promise(resolve => setTimeout(resolve, delay));
            return axiousClient(cfg);
        }
        
        return Promise.reject(error);
    }
)

const CreateNewResume =(data)=>axiousClient.post('user-resumes',data)

const GetUserResumes = async (userEmail) => {
    try {
        return await axiousClient.get('user-resumes?filters[userEmail][$eq]='+encodeURIComponent(userEmail));
    } catch (error) {
        // If timeout on Render, try once more with longer timeout
        if (error.code === 'ECONNABORTED' && isRenderBackend && !error.config?._skipRetry) {
            const retryClient = axios.create({
                baseURL: base,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                timeout: 90000, // 90 seconds for retry
            });
            return await retryClient.get('user-resumes?filters[userEmail][$eq]='+encodeURIComponent(userEmail));
        }
        throw error;
    }
}
const GetResumeById =(id)=>axiousClient.get('user-resumes/'+id+'?populate=*')
const  UpdateResumeDetail =(id,data)=>axiousClient.put('user-resumes/'+id,data)
const  UpdateResumeDetailWithLocale =(id,data,locale)=>{
    const config = locale ? { params: { locale } } : undefined;
    return axiousClient.put('user-resumes/'+id,data,config)
}

// Fetch resume by Strapi documentId (direct endpoint for v5)
const GetResumeByDocumentId = async (documentId) => {
    return await axiousClient.get('user-resumes/'+documentId+'?populate=*');
}

// Alternate: fetch by custom resumeId field
const GetResumeByResumeId = (resumeId) =>
    axiousClient.get('user-resumes?filters[resumeId][$eq]='+resumeId)

// Update resume by Strapi documentId
const UpdateResumeByDocumentId = async (documentId, data) => {
    try {
        // In Strapi v5, documentId can be used directly in the URL
        const locale = data?.data?.locale;
        const config = locale ? { params: { locale } } : undefined;
        
        // Log the payload being sent (for debugging Projects/Languages issues)
        if (data?.data?.Projects || data?.data?.Languages) {
            console.log('[UpdateResumeByDocumentId] Sending payload with components:', {
                hasProjects: !!data?.data?.Projects,
                ProjectsCount: data?.data?.Projects?.length,
                hasLanguages: !!data?.data?.Languages,
                LanguagesCount: data?.data?.Languages?.length,
                payloadKeys: Object.keys(data?.data || {}),
                firstProject: data?.data?.Projects?.[0],
                firstLanguage: data?.data?.Languages?.[0]
            });
        }
        
        return await axiousClient.put('user-resumes/'+documentId, data, config);
    } catch (err) {
        // Always log errors for debugging
        console.error('[UpdateResumeByDocumentId] Failed:', {
            documentId,
            error: err.response?.data || err.message,
            status: err.response?.status,
            statusText: err.response?.statusText
        });
        throw err;
    }
}


const  GetId =(id)=>axiousClient.get('user-resumes/'+id+"?populate=*")
// Delete resume by Strapi documentId
const DeleteResumeByDocumentId = (documentId) => axiousClient.delete('user-resumes/'+documentId)

/**
 * Simple ping to wake up the backend (e.g. Render/Heroku free tier).
 * Uses a lightweight request with shorter timeout and no retries.
 */
const Ping = async () => {
    try {
        // Use a shorter timeout for ping (10s) - if it times out, backend is waking up
        const pingClient = axios.create({
            ...axiousClient.defaults,
            timeout: 10000,
        });
        await pingClient.get('user-resumes?pagination[pageSize]=1');
    } catch (error) {
        // Silently fail - ping is just to wake up the backend
        // Timeout is expected on first request to Render free tier
        if (import.meta.env.DEV) {
            console.log('Backend ping timeout (expected on cold start)');
        }
    }
};

export default{
    CreateNewResume,
    GetUserResumes,
    GetResumeById,
    UpdateResumeDetail,
    UpdateResumeDetailWithLocale,
    GetResumeByDocumentId,
    GetResumeByResumeId,
    UpdateResumeByDocumentId,
    GetId,
    DeleteResumeByDocumentId,
    Ping,
}