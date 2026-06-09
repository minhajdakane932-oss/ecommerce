document.addEventListener('DOMContentLoaded', () => {
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const row = event.target.closest('tr');
      const input = row.querySelector('input[name^="quantity"]');
      if (input) {
        input.value = 0;
        row.closest('form').submit();
      }
    });
  });
});
