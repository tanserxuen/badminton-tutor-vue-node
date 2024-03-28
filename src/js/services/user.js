import axios from "axios";

async function view(id){
  try {
    const response = await axios.get(`http://localhost:3000/user/view/${id}}`);
    return response;
  } catch (error) {
    return error;
  }
}

async function update(){
  try {
    const response = await axios.post("http://localhost:3000/user/update");
    return response;
  } catch (error) {
    return error;
  }
}

export { view, update };