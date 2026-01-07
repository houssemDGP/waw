import axios from 'axios';

const BASE_URL = 'http://102.211.209.131:3011/api/business'; // change to your production IP if needed

// 🔹 Get all businesses
export const getAllBusinesses = async () => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

// 🔹 Get business by ID
export const getBusinessById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// 🔹 Create new business (without image)
export const createBusiness = async (business) => {
  const response = await axios.post(`${BASE_URL}`, business);
  return response.data;
};

// 🔹 Create business with image (multipart)
export const createBusinessWithImage = async (business, imageFile) => {
  const formData = new FormData();
  formData.append(
    'business',
    new Blob([JSON.stringify(business)], { type: 'application/json' })
  );
  formData.append('image', imageFile);

  const response = await axios.post(`${BASE_URL}/create-with-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

// 🔹 Upload image for existing business by ID
export const uploadBusinessImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(`${BASE_URL}/${id}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

// 🔹 Login business
export const loginBusiness = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

// 🔹 Delete business
export const deleteBusiness = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
