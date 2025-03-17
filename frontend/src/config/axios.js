import axios from 'axios';

export const axiosi = axios.create({
    baseURL: "http://localhost:8000/",  // Ensure this URL is correct
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,  // If using cookies for authentication
});

console.log("BackEnd URL : "+axiosi.defaults.baseURL);
