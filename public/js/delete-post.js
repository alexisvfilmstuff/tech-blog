async function delButtonHandler(event) {
  event.preventDefault();

// get post and id from the url // 
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

// delete post // 
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  });

// delete redirects to dashboard otherwise show error // 
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector('.delete-post-btn')
  .addEventListener('click', delButtonHandler);
