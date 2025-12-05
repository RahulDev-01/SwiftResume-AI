import axios from "axios";


const API_KEY = import.meta.env.VITE_STRAPI_API_KEY
// Ensure trailing slash so axios concatenates correctly (avoids '/apiuser-resumes')
const base = (import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "") + "/api/";
const axiousClient = axios.create({
    baseURL : base,
    headers :{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${API_KEY}`
    },
    timeout: 30000, // 30 seconds timeout for Vercel serverless functions
})

// Basic logging interceptors
axiousClient.interceptors.response.use(
    (resp)=>resp,
    (error)=>{
        try{
            const cfg = error?.config || {};
            console.error('API Error:', {
                method: cfg.method,
                url: cfg.baseURL + (cfg.url || ''),
                status: error?.response?.status,
                data: error?.response?.data
            });
        }catch{ /* noop */ }
        return Promise.reject(error);
    }
)

const CreateNewResume =(data)=>axiousClient.post('user-resumes',data)

const GetUserResumes =(userEmail)=>axiousClient.get('user-resumes?filters[userEmail][$eq]='+encodeURIComponent(userEmail))
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
        return await axiousClient.put('user-resumes/'+documentId, data, config);
    } catch (err) {
        // Only log errors in development
        if (import.meta.env.DEV) {
            console.error('UpdateResumeByDocumentId failed:', err.response?.data || err.message);
        }
        throw err;
    }
}


const  GetId =(id)=>axiousClient.get('user-resumes/'+id+"?populate=*")
// Delete resume by Strapi documentId
const DeleteResumeByDocumentId = (documentId) => axiousClient.delete('user-resumes/'+documentId)

/**
 * Simple ping to wake up the backend (e.g. Render/Heroku free tier).
 * We use a lightweight request (e.g. fetching 1 item or just the endpoint).
 */
const Ping = () => axiousClient.get('user-resumes?pagination[pageSize]=1');

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