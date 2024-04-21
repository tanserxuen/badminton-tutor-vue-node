import axios from "axios";

async function fetchTutorials() {
  try {
    const response = await axios.get("http://localhost:3000/tutorials");
    return response;
  } catch (error) {
    return error;
  }
}

async function createTutorials() {
  try {
    const response = await axios.get("http://localhost:3000/tutorials/create");
    return response;
  } catch (error) {
    return error;
  }
}

async function updateTutorials(data) {
  const { type, name, id, image } = data;
  try {
    const response = await axios.post(
      `http://localhost:3000/tutorials/update/${type}/${name}/${id}`,
      { image }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export default { fetchTutorials, updateTutorials, createTutorials };
