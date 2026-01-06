// src/hooks/useAxios.ts
import axios from 'axios';


const useAxios = () => {

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Địa chỉ API của bạn
  });

  instance.interceptors.request.use(
    (config) => {

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;
