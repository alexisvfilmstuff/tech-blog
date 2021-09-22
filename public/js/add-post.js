const newFormHandler = async (event) => {
  event.preventDefault();

// get query data for post text and title // 
  const title = document.querySelector('input[name="post-title"]').value.trim();
  const post_text = document
    .querySelector('textarea[name="post-text"]')
    .value.trim();

// add new post route creates post into session with id //
  const response = await fetch(`/api/posts`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      content: post_text,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

// reload with new post rendered into dashboard // 
  if (response.ok) {
    document.location.replace('/dashboard');
    // otherwise, display the error
  } else {
    alert(response.statusText);
  }
};

// event listener for submit post // 
document
  .querySelector('.create-form')
  .addEventListener('submit', newFormHandler);
