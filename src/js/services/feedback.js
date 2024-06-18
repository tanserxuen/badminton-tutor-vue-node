import axios from "axios";

async function fetchFeedback(id) {
  try {
    const response = await axios.post("/history", { id });
    return response;
  } catch (error) {
    return error;
  }
}

export default { fetchFeedback };
