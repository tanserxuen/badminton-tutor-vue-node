import axios from "axios";

async function getUserPosts() {
  try {
    const response = await axios.get("/post");
    return response;
  } catch (error) {
    return error;
  }
}

async function createPost(data) {
  try {
    const response = await axios.post(
      "/post/create",
      data
    );
    return response;
  } catch (error) {
    return error;
  }
}

async function viewPost({ id, userId }) {
  try {
    const response = await axios.post(`/post/view/${id}`, {
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
      `/post/update/${id}`,
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
  comments,
}) {
  try {
    const response = await axios.post(
      `/post/update/${postId}/part`,
      {
        current_user_liked,
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
      `/post/delete/${id})`,
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
