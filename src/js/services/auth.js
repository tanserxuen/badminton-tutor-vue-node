import axios from "axios";

async function signup(email, password) {
  try {
    const response = await axios.post("/auth/signup", {
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
    const response = await axios.post("/auth/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    return error;
  }
}

async function logout() {
  try {
    const response = await axios.post("/auth/logout");
    return response;
  } catch (error) {
    return error;
  }
}

async function resetPassword(email) {
  try {
    const response = await axios.post("/auth/reset-password", {
      email,
    });
    return response;
  } catch (error) {
    return error;
  }
}

async function updatePassword(email, password) {
  try {
    const response = await axios.post("/auth/update-password", {
      email,
      password,
    });
    return response;
  } catch (error) {
    return error;
  }
}

async function validateAuth() {
  try {
    const response = await axios.get("/auth/validate-auth");
    return response;
  } catch (error) {
    return error;
  }
}

export default {
  signup,
  signin,
  logout,
  resetPassword,
  updatePassword,
  validateAuth,
};
