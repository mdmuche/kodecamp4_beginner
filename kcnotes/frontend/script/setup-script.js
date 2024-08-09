const baseUrl = "http://localhost:3000";

const urlMaker = (url) => {
  return baseUrl + url;
};

const getToken = () => {
  return sessionStorage.getItem("token");
};
