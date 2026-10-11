
// import axios from "axios";

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL ,
//     withCredentials: true,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// export default api;




import axios from "axios";

const api = axios.create({
    // Local development uses the local backend.
    // Production uses the frontend domain as an API proxy.
    baseURL: import.meta.env.DEV
        ? (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
        : "/api",

    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
