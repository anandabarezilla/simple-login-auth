import { useEffect, useState } from "react";
import { getUsername } from "../helper/helper";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

const useFetch = (query) => {
  const [data, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));

        const dataUser = !query ? await getUsername() : "";
        const { userId, username } = dataUser;
        // console.log(username);

        const response = !query ? await axios.get(`/api/user/${userId}`) : await axios.get(`/api/${query}`);
        const { data, status } = response;
        // console.log(data, status);

        if (status === 200) {
          setData((prev) => ({ ...prev, isLoading: false, apiData: data, status: status }));
        }
      } catch (error) {
        setData((prev) => ({ ...prev, isLoading: false, serverError: error }));
      }
    };
    fetchData();
  }, []);

  return [data, setData];
};

export default useFetch;
