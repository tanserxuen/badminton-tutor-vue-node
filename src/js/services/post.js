import axios from "axios";

async function getUserPosts() {
  try {
    const response = await axios.get("http://localhost:3000/post");
    return response;
  } catch (error) {
    return error;
  }
}

async function createPost(data) {
  try {
    const response = await axios.post(
      "http://localhost:3000/post/create",
      data
    );
    return response;
  } catch (error) {
    return error;
  }
}

async function viewPost({ id, userId }) {
  try {
    const response = await axios.post(`http://localhost:3000/post/view/${id}`, {
      userId,
    });
    return response;
  } catch (error) {
    return error;
  }
}

async function updatePost({ id, ...data }) {
  try {
    const response = await axios.post(
      `http://localhost:3000/post/update/${id}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
}

async function updateLikeComment({
  postId,
  current_user_liked,
  number_of_likes,
  comments,
}) {
  try {
    const response = await axios.post(
      `http://localhost:3000/post/update/${postId}/part`,
      {
        current_user_liked,
        number_of_likes,
        comments,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

async function deletePost({ id, userId }) {
  try {
    const response = await axios.post(
      `http://localhost:3000/post/delete/${id})`,
      {
        userId,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export default {
  createPost,
  viewPost,
  updatePost,
  deletePost,
  getUserPosts,
  updateLikeComment,
};
