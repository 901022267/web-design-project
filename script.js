document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

  // Booking enquiry form: browser validation plus clear success/error messages.
  const form = document.getElementById('bookingForm');
  if (form) {
    const message = document.getElementById('formMessage');
    const textarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const dateField = document.getElementById('travelDate');

    if (dateField) {
      const today = new Date();
      const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateField.min = localToday;
    }
    if (textarea && charCount) textarea.addEventListener('input', () => charCount.textContent = textarea.value.length);

    form.addEventListener('submit', event => {
      event.preventDefault();
      message.textContent = '';
      message.className = 'mt-3';
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        message.classList.add('alert', 'alert-danger');
        message.textContent = 'Please check the highlighted fields and correct the information.';
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (dateField.value && dateField.value < dateField.min) {
        dateField.setCustomValidity('Please choose today or a future date.');
        dateField.reportValidity();
        dateField.setCustomValidity('');
        return;
      }
      form.classList.remove('was-validated');
      message.classList.add('alert', 'alert-success');
      message.textContent = `Thank you, ${form.fullName.value.trim()}! Your demo enquiry has passed validation. No booking was sent or saved.`;
      form.reset();
      if (charCount) charCount.textContent = '0';
    });

    form.addEventListener('reset', () => {
      form.classList.remove('was-validated');
      message.textContent = '';
      message.className = 'mt-3';
      if (charCount) charCount.textContent = '0';
    });
  }

  // Interactive gallery with image preview and previous/next controls.
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const modalElement = document.getElementById('photoModal');
  if (galleryItems.length && modalElement && window.bootstrap) {
    const modal = new bootstrap.Modal(modalElement);
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalTitle = document.getElementById('photoModalLabel');
    let currentIndex = 0;

    function showPhoto(index) {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[currentIndex];
      modalImage.src = item.dataset.full;
      modalImage.alt = item.querySelector('img').alt;
      modalCaption.textContent = item.dataset.caption;
      modalTitle.textContent = `Photo ${currentIndex + 1} of ${galleryItems.length}`;
    }
    galleryItems.forEach((item, index) => item.addEventListener('click', () => {
      showPhoto(index);
      modal.show();
    }));
    document.getElementById('prevPhoto').addEventListener('click', () => showPhoto(currentIndex - 1));
    document.getElementById('nextPhoto').addEventListener('click', () => showPhoto(currentIndex + 1));
    document.addEventListener('keydown', event => {
      if (!modalElement.classList.contains('show')) return;
      if (event.key === 'ArrowLeft') showPhoto(currentIndex - 1);
      if (event.key === 'ArrowRight') showPhoto(currentIndex + 1);
    });
  }
});
