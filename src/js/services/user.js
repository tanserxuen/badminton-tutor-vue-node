import axios from "axios";

// async function view(id){
//   try {
//     const response = await axios.get(`http://localhost:3000/user/view/${id}}`);
//     return response;
//   } catch (error) {
//     return error;
//   }
// }

// class UserService {
async function update(id, formdata) {
  try {
    const response = await axios.post(
      `http://localhost:3000/user/update/${id}`,
      formdata
    );
    return response;
  } catch (error) {
    return error;
  }
}
// }

export default { update };
