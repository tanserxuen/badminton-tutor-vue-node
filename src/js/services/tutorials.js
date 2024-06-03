import axios from "axios";

async function fetchTutorials() {
  try {
    const response = await axios.get("/tutorials");
    return response;
  } catch (error) {
    return error;
  }
}

async function createTutorials() {
  try {
    const response = await axios.get("/tutorials/create");
    return response;
  } catch (error) {
    return error;
  }
}

async function updateTutorials(data) {
  const { type, name, id, image, img } = data;
  try {
    const response = await axios.post(
      `/tutorials/update/${type}/${name}/${img}/${id}`,
      { image }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export default { fetchTutorials, updateTutorials, createTutorials };
