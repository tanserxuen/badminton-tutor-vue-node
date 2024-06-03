import axios from "axios";

async function fetchFeedback(id) {
  try {
    const response = await axios.post("/feedback", { id });
    return response;
  } catch (error) {
    return error;
  }
}

export default { fetchFeedback };
