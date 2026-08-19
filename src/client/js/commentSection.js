const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const deleteBtn = document.getElementById("comment-delete");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = `    ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/video/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
    }),
  });
  textarea.value = "";
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (e) => {
  const parentElement = e.target.parentElement;
  const videoId = videoContainer.dataset.id;
  const commentId = parentElement.dataset.id;

  const response = await fetch(`/api/video/${commentId}/commentDelete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commentId: commentId,
      videoId: videoId,
    }),
  });
  if (response.status === 200) {
    parentElement.remove();
  }
};

btn.addEventListener("click", handleSubmit);
deleteBtn.addEventListener("click", handleDelete);
