import axios from "axios";

async function fetchAll() {
  try {
    const response = await axios.get("/user");
    return response.data;
  } catch (error) {
    return error;
  }
}

async function view(id) {
  try {
    const response = await axios.get(`/user/view/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
}

async function update(id, formdata) {
  try {
    const response = await axios.post(`/user/update/${id}`, formdata);
    return response;
  } catch (error) {
    return error;
  }
}

async function index() {
  try {
    const response = await axios.get(`/user`);
    return response;
  } catch (error) {
    return error;
  }
}

async function getConnects(userId) {
  try {
    const response = await axios.post(`/user/get-connects`, { userId });
    return response;
  } catch (error) {
    return error;
  }
}

async function updateConnects(data) {
  try {
    const response = await axios.post(`/user/update-connects`, data);
    return response;
  } catch (error) {
    return error;
  }
}

async function updateActiveDays() {
  try {
    console.log("updateActiveDays");
    const response = await axios.get(`/user/checkin`);
    return response;
  } catch (error) {
    return error;
  }
}

export default {
  update,
  index,
  getConnects,
  updateConnects,
  view,
  updateActiveDays,
  fetchAll
};
