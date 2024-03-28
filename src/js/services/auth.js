import axios from "axios";

async function signup(email, password) {
  console.log("try register");
  try {
    const response = await axios.post("http://localhost:3000/auth/signup", {
      email,
      password,
    });
    await logout();
    return response;
  } catch (error) {
    return error;
  }
}

async function signin(email, password) {
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function logout() {
  try {
    const response = await axios.post("http://localhost:3000/auth/logout");
    return response;
  } catch (error) {
    return error;
  }
}

async function resetPassword(email) {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/reset-password",
      {
        email,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

async function updatePassword(email, password) {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/update-password",
      {
        email,
        password,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export { signup, signin, logout, resetPassword, updatePassword };
