document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    const project = form.closest(".project-block").querySelector("h4").textContent.trim();
    const commentsList = form.closest(".project-block").querySelector(".comments ul");

    // Load existing comments
    fetch(`/comments?project=${encodeURIComponent(project)}`)
      .then(res => res.json())
      .then(comments => {
        comments.forEach(comment => {
          const li = document.createElement("li");
          li.textContent = `${comment.name}: ${comment.text}`;
          commentsList.appendChild(li);
        });
      });

    // Handle submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector('input[name="name"]').value;
      const text = form.querySelector('textarea[name="comment"]').value;

      fetch("/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text, project })
      })
        .then(res => {
          if (res.ok) {
            const li = document.createElement("li");
            li.textContent = `${name}: ${text}`;
            commentsList.prepend(li);
            form.reset();
          } else {
            alert("Error submitting comment.");
          }
        });
    });
  });
});
