import axios from "axios";

async function fetchFeedback(id) {
  try {
    const response = await axios.post("http://localhost:3000/feedback", { id });
    return response;
  } catch (error) {
    return error;
  }
}

export default { fetchFeedback };
