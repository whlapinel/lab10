let reviews = [];
const baseUrl = 'http://localhost:3000/reviews'

const totalSpan = document.querySelector(".total");
const scaleSpan = document.querySelector(".scale");
const averageDiv = document.querySelector(".average");
const middleSection = document.querySelector(".middle-section");
const reviewContainer = document.querySelector(".review-container");
const form = document.querySelector('form');
const ratingBox = form.querySelector('#rating');
const feedbackBox = form.querySelector('#feedback');
const submitBtn = form.querySelector('button');
const sortBox = document.querySelector('select#order');
sortBox.addEventListener('change', fetchReviews);
window.addEventListener("DOMContentLoaded", fetchReviews);

async function fetchReviews() {
  const sortUrl = `${baseUrl}?_sort=rating&_order=${sortBox.value}`;
  try {
    const response = await fetch(sortUrl);
    if (!response.ok) {
      throw Error(
        `Error: URL: ${response.url}\nStatus text: ${response.statusText}`
      );
    }
    reviews = await response.json();
    console.log(reviews);
    loadStats();
    appendReviewElements();
  } catch (err) {
    console.log(err.message);
  }
}

function loadStats() {
    let numberOfReviews = reviews.length;
    let total = reviews.reduce((accumulator, review) => accumulator + parseInt(review.rating), 0);
    console.log(total);
    let average = (total / numberOfReviews).toFixed(1);
    let scale;
    if (average >= 4.5) {
        scale = 'Excellent';
    } else if (average >= 4) {
        scale = 'Good';
    } else if (average >= 3) {
        scale = 'Fair';
    } else if (average >= 2) {
        scale = 'Poor';
    } else if (average >= 1) {
        scale = 'Awful';
    }
    totalSpan.textContent = `${numberOfReviews} Reviews`;
    averageDiv.textContent = average;
    scaleSpan.textContent = scale;

    if (middleSection.classList.contains('hidden')) {
        middleSection.classList.remove('hidden');
    }
}

function appendReviewElements () {
  const fragment = document.createDocumentFragment();
  reviews.forEach(review=>fragment.append(generateReviewElement(review)));
  reviewContainer.innerHTML = ''; // delete old fragment
  reviewContainer.append(fragment); // append new fragment
}

//generate DOM Element for the review

function generateReviewElement(review) {
    const container = document.createElement('div');
    container.classList.add('review-item', 'card', 'flex');
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('btn-container');
    const editBtn = document.createElement('a');
    editBtn.classList.add('btn', 'edit');
    editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    editBtn.href = `./edit.html?id=${review.id}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'delete');
    deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteBtn.addEventListener('click', async ()=>{deleteReview(review.id)})
    buttonContainer.append(editBtn, deleteBtn);

    const starContainer = document.createElement('div');
    starContainer.classList.add('star-container');

    for (let i=0; i<review.rating; i++) {
      const star = document.createElement('i');
      star.classList.add('fa-solid', 'fa-star');
      starContainer.append(star);
    }

    for (let i=review.rating; i<5; i++) {
      const star = document.createElement('i');
      star.classList.add('fa-regular', 'fa-star');
      starContainer.append(star);
    }

    const feedbackContainer = document.createElement('div');
    feedbackContainer.classList.add('feedback');
    feedbackContainer.textContent = review.feedback;
  
    container.append(buttonContainer, starContainer, feedbackContainer);

    return container;
}

submitBtn.addEventListener('click', submitReview);

async function submitReview(e) {
  if (form.reportValidity()) {
    e.preventDefault();
    let rating = parseInt(ratingBox.value);
    let feedback = feedbackBox.value;
    ratingBox.value = '';
    feedbackBox.value = '';

    let review = {rating, feedback};
    review = JSON.stringify(review);
    
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: review,
      });
      if (!response.ok) {
        throw Error(`Error: ${response.url}\nStatus Text: ${response.statusText}`);
      }  
      review = await response.json();
      reviews.push(review);
      sortReviews();
      appendReviewElements();
      loadStats();
    } catch (err) {
      console.log(err.message);
    }
  }
}

async function deleteReview(id) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  });
  if(!response.ok) {
    throw Error(`Error: ${response.url}\nStatus Text: ${response.statusText}`);
  }
  let index = reviews.findIndex(element=>element.id === id);
  if(index !== -1) {
    reviews.splice(index, 1);
    loadStats();
    appendReviewElements();
  }
}