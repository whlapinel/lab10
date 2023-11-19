const id = new URLSearchParams(window.location.search).get("id");
console.log(id);
let review;
const url = `http://localhost:3000/reviews?id=${id}`;

const form = document.querySelector("form");
const ratingBox = form.querySelector("#rating");
const feedbackBox = form.querySelector("#feedback");
const submitBtn = form.querySelector("button");

window.addEventListener("DOMContentLoaded", fetchReview);

async function fetchReview(id) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw Error(
        `Error: URL: ${response.url}\nStatus text: ${response.statusText}`
      );
    }
    review = await response.json();
    console.log(review);
    populateForm();
  } catch (err) {
    console.log(err);
  }
}

function populateForm() {
  ratingBox.value = review[0].rating;
  feedbackBox.value = review[0].feedback;
}

submitBtn.addEventListener("click", updateReview);

async function updateReview(e) {
  if (form.reportValidity()) {
    e.preventDefault();
    review[0].rating = parseInt(ratingBox.value);
    review[0].feedback = feedbackBox.value;
    try {
      const response = await fetch(`http://localhost:3000/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review[0]),
      });
      if (!response.ok) {
        throw Error(
          `Error: ${response.url}\nStatus Text: ${response.statusText}`
        );
      }      
      location.assign('./index.html');

    } catch (err) {
      console.log(err.message);
    }
  }
}
