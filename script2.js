/*
Program name: script2.js
Author: Xander Vanoven
Date created: 06/29/2026
Date last edited: 06/29/2026
Version: 1.0
Description: Javascript for Homework 2 review, field validation, and dynamic slider updates.
*/

function formatDateForReview(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function setLiveDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('live-date').textContent = `Today is: ${today.toLocaleDateString(undefined, options)}`;
  document.getElementById('footer-year').textContent = today.getFullYear();
}

function setDateLimits() {
  const today = new Date();
  const maxDob = today;
  const minDob = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  const dobField = document.getElementById('dob');
  const futureField = document.getElementById('future-date');

  dobField.min = minDob.toISOString().slice(0, 10);
  dobField.max = maxDob.toISOString().slice(0, 10);
  futureField.min = today.toISOString().slice(0, 10);
}

function updateHealthValue() {
  const slider = document.getElementById('health-rating');
  const output = document.getElementById('health-value');
  output.textContent = slider.value;
}

function clearError(fieldId) {
  const errorSpan = document.getElementById(`${fieldId}-error`);
  if (errorSpan) {
    errorSpan.textContent = '';
  }
}

function setError(fieldId, message) {
  const errorSpan = document.getElementById(`${fieldId}-error`);
  if (errorSpan) {
    errorSpan.textContent = message;
  }
}

function lowerCaseUserId() {
  const userId = document.getElementById('user-id');
  if (userId.value) {
    userId.value = userId.value.toLowerCase();
  }
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function validatePassword(password, confirmValue, userId, nameParts) {
  const errors = [];
  if (password.length < 8 || password.length > 30) {
    errors.push('Password must be 8-30 characters.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password needs at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password needs at least one lowercase letter.');
  }
  if (!/\d/.test(password)) {
    errors.push('Password needs at least one digit.');
  }
  if (!/[!@#%^&*()\-_=+\\/<>.,`~]/.test(password)) {
    errors.push('Password needs at least one special character.');
  }
  if (/"/.test(password)) {
    errors.push('Password cannot contain quotes.');
  }
  if (userId && password.toLowerCase().includes(userId.toLowerCase())) {
    errors.push('Password cannot contain your user ID.');
  }
  nameParts.forEach(part => {
    if (part && part.length > 2 && password.toLowerCase().includes(part.toLowerCase())) {
      errors.push('Password cannot include your name.');
    }
  });
  if (confirmValue && password !== confirmValue) {
    errors.push('Passwords must match.');
  }
  return errors;
}

function validateForm() {
  let isValid = true;
  const form = document.getElementById('registration-form');
  const fields = ['first-name', 'middle-initial', 'last-name', 'dob', 'future-date', 'id-number', 'addr1', 'addr2', 'city', 'state', 'zip', 'email', 'phone', 'symptoms', 'user-id', 'password', 'password-confirm'];

  fields.forEach(fieldId => clearError(fieldId));

  if (!form.checkValidity()) {
    isValid = false;
  }

  const firstName = document.getElementById('first-name').value.trim();
  const middleInitial = document.getElementById('middle-initial').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const dobValue = document.getElementById('dob').value;
  const futureDateValue = document.getElementById('future-date').value;
  const zipValue = document.getElementById('zip').value.trim();
  const phoneValue = document.getElementById('phone').value.trim();
  const userId = document.getElementById('user-id').value.trim();
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;

  if (firstName && !/^[A-Za-z'\-]{1,30}$/.test(firstName)) {
    setError('first-name', 'Enter 1-30 letters, apostrophes, or dashes only.');
    isValid = false;
  }
  if (middleInitial && !/^[A-Za-z]$/.test(middleInitial)) {
    setError('middle-initial', 'Enter a single letter only.');
    isValid = false;
  }
  if (lastName && !/^[A-Za-z][A-Za-z'\-2-5]{0,29}$/.test(lastName)) {
    setError('last-name', 'Enter 1-30 characters; digits allowed only 2-5, plus apostrophes and dashes.');
    isValid = false;
  }

  if (dobValue) {
    const dobDate = new Date(dobValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const earliest = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    if (dobDate > today || dobDate < earliest) {
      setError('dob', 'Date of birth must be between today and 120 years ago.');
      isValid = false;
    }
  }

  if (futureDateValue) {
    const futureDate = new Date(futureDateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (futureDate < today) {
      setError('future-date', 'Please choose a future visit date.');
      isValid = false;
    }
  }

  if (zipValue && !/^\d{5}(?:-\d{4})?$/.test(zipValue)) {
    setError('zip', 'ZIP code must be 5 digits or ZIP+4.');
    isValid = false;
  }

  if (phoneValue && !/^\d{3}-\d{3}-\d{4}$/.test(phoneValue)) {
    setError('phone', 'Phone must be in 000-000-0000 format.');
    isValid = false;
  }

  const symptomsValue = document.getElementById('symptoms').value;
  if (symptomsValue && /"/.test(symptomsValue)) {
    setError('symptoms', 'Quotes are not allowed in the notes field.');
    isValid = false;
  }

  if (userId && !/^[A-Za-z][A-Za-z0-9_-]{4,29}$/.test(userId)) {
    setError('user-id', 'User ID must be 5-30 chars, start with a letter, no spaces, underscore or dash allowed.');
    isValid = false;
  }

  const nameParts = [firstName, middleInitial, lastName].filter(Boolean);
  const passwordErrors = validatePassword(password, passwordConfirm, userId, nameParts);
  if (passwordErrors.length > 0) {
    setError('password', passwordErrors[0]);
    if (passwordErrors.includes('Passwords must match.')) {
      setError('password-confirm', 'Passwords do not match.');
    }
    isValid = false;
  }

  if (!form.reportValidity()) {
    isValid = false;
  }

  return isValid;
}

function getStateLabel(value) {
  const option = document.querySelector(`#state option[value="${value}"]`);
  return option ? option.textContent : '';
}

function truncateZip(zipValue) {
  return zipValue.length > 5 ? zipValue.slice(0, 5) : zipValue;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createReviewRow(label, value) {
  return `
    <div class="review-label">${label}</div>
    <div class="review-value">${value || '<em>Not provided</em>'}</div>
  `;
}

function toggleSubmitButton(isVisible) {
  const submitButton = document.getElementById('submit-btn');
  if (submitButton) {
    submitButton.classList.toggle('hidden', !isVisible);
  }
}

function getTemporaryDataRows() {
  const historyLabels = {
    chicken_pox: 'Chicken Pox',
    measles: 'Measles',
    covid19: 'COVID-19',
    mumps: 'Mumps',
    heart_disease: 'Heart Disease',
    diabetic: 'Diabetic'
  };

  const history = Array.from(document.querySelectorAll('input[name="history"]:checked')).map(item => historyLabels[item.value] || item.value);
  const housing = document.querySelector('input[name="housing"]:checked')?.value || '(not selected)';
  const vaccinated = document.querySelector('input[name="vaccinated"]:checked')?.value || '(not selected)';
  const passwordValue = document.getElementById('password').value;

  return [
    { label: 'First Name', value: document.getElementById('first-name').value.trim() || '(empty)' },
    { label: 'Middle Initial', value: document.getElementById('middle-initial').value.trim() || '(empty)' },
    { label: 'Last Name', value: document.getElementById('last-name').value.trim() || '(empty)' },
    { label: 'Date of Birth', value: document.getElementById('dob').value || '(empty)' },
    { label: 'Preferred Visit Date', value: document.getElementById('future-date').value || '(empty)' },
    { label: 'ID Number', value: document.getElementById('id-number').value || '(empty)' },
    { label: 'Address Line 1', value: document.getElementById('addr1').value.trim() || '(empty)' },
    { label: 'Address Line 2', value: document.getElementById('addr2').value.trim() || '(empty)' },
    { label: 'City', value: document.getElementById('city').value.trim() || '(empty)' },
    { label: 'State', value: document.getElementById('state').value || '(empty)' },
    { label: 'Zip', value: document.getElementById('zip').value.trim() || '(empty)' },
    { label: 'Email', value: document.getElementById('email').value.trim() || '(empty)' },
    { label: 'Phone', value: document.getElementById('phone').value.trim() || '(empty)' },
    { label: 'Medical History', value: history.length ? history.join(', ') : '(none selected)' },
    { label: 'Living Situation', value: housing },
    { label: 'Vaccinated', value: vaccinated },
    { label: 'Health Rating', value: document.getElementById('health-rating').value },
    { label: 'Notes', value: document.getElementById('symptoms').value.trim() || '(empty)' },
    { label: 'User ID', value: document.getElementById('user-id').value.trim() || '(empty)' },
    { label: 'Password', value: passwordValue ? '*'.repeat(passwordValue.length) : '(empty)' }
  ];
}

function updateTemporaryDataView() {
  const panel = document.getElementById('temporary-data-panel');
  const button = document.getElementById('view-data-btn');
  if (!panel || !button) {
    return;
  }

  const rows = getTemporaryDataRows()
    .map(entry => `<tr><th>${escapeHtml(entry.label)}</th><td>${escapeHtml(entry.value)}</td></tr>`)
    .join('');

  document.getElementById('temporary-data-body').innerHTML = rows;
  if (!panel.classList.contains('hidden')) {
    button.textContent = 'Hide Data';
  }
}

function toggleTemporaryDataView() {
  const panel = document.getElementById('temporary-data-panel');
  const button = document.getElementById('view-data-btn');
  if (!panel || !button) {
    return;
  }

  panel.classList.toggle('hidden');
  button.textContent = panel.classList.contains('hidden') ? 'View Data' : 'Hide Data';
  if (!panel.classList.contains('hidden')) {
    updateTemporaryDataView();
  }
}

function showReview() {
  lowerCaseUserId();

  const firstName = document.getElementById('first-name').value.trim();
  const middleInitial = document.getElementById('middle-initial').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const dobValue = formatDateForReview(document.getElementById('dob').value);
  const futureDateValue = formatDateForReview(document.getElementById('future-date').value);
  const idNumber = document.getElementById('id-number').value.replace(/.(?=.{4})/g, '*');
  const addr1 = document.getElementById('addr1').value.trim();
  const addr2 = document.getElementById('addr2').value.trim();
  const city = document.getElementById('city').value.trim();
  const state = getStateLabel(document.getElementById('state').value);
  const zip = truncateZip(document.getElementById('zip').value.trim());
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const history = getCheckedValues('history');
  const housing = document.querySelector('input[name="housing"]:checked')?.value || '';
  const vaccinated = document.querySelector('input[name="vaccinated"]:checked')?.value || '';
  const healthRating = document.getElementById('health-rating').value;
  const symptoms = document.getElementById('symptoms').value.trim();
  const userId = document.getElementById('user-id').value.trim();
  const passwordMasked = document.getElementById('password').value.replace(/./g, '*');

  const reviewItems = [
    createReviewRow('Full Name', `${firstName} ${middleInitial ? middleInitial + ' ' : ''}${lastName}`),
    createReviewRow('Date of Birth', dobValue),
    createReviewRow('Preferred Visit Date', futureDateValue),
    createReviewRow('ID Number', idNumber),
    createReviewRow('Email', email),
    createReviewRow('Phone', phone),
    createReviewRow('Address', `${addr1}${addr2 ? '\n' + addr2 : ''}\n${city}, ${state} ${zip}`),
    createReviewRow('Medical History', history.length ? history.join(', ') : 'None selected'),
    createReviewRow('Living situation', housing),
    createReviewRow('Vaccination status', vaccinated),
    createReviewRow('Health rating', `${healthRating} of 10`),
    createReviewRow('Additional notes', symptoms),
    createReviewRow('User ID', userId),
    createReviewRow('Password', passwordMasked)
  ];

  document.getElementById('review-content').innerHTML = `<div class="review-grid">${reviewItems.join('')}</div>`;
  document.getElementById('review-summary').classList.remove('hidden');
}

function initForm() {
  setLiveDate();
  setDateLimits();
  updateHealthValue();
  toggleSubmitButton(false);

  const panel = document.getElementById('temporary-data-panel');
  const button = document.getElementById('view-data-btn');
  if (panel) {
    panel.classList.remove('hidden');
  }
  if (button) {
    button.textContent = 'Hide Data';
  }
  updateTemporaryDataView();

  document.getElementById('health-rating').addEventListener('input', updateHealthValue);
  document.getElementById('user-id').addEventListener('blur', lowerCaseUserId);
  document.getElementById('view-data-btn').addEventListener('click', toggleTemporaryDataView);
  document.getElementById('review-btn').addEventListener('click', function () {
    const valid = validateForm();
    showReview();
    toggleSubmitButton(valid);
    return valid;
  });

  const form = document.getElementById('registration-form');
  form.addEventListener('input', function () {
    toggleSubmitButton(false);
    updateTemporaryDataView();
  });
  form.addEventListener('change', function () {
    toggleSubmitButton(false);
    updateTemporaryDataView();
  });

  form.addEventListener('submit', function (event) {
    if (!validateForm()) {
      event.preventDefault();
      showReview();
      toggleSubmitButton(false);
    }
  });

  form.addEventListener('reset', function () {
    setTimeout(function () {
      document.getElementById('review-summary').classList.add('hidden');
      document.getElementById('review-content').innerHTML = '';
      const errors = document.querySelectorAll('.field-error');
      errors.forEach(error => error.textContent = '');
      updateHealthValue();
      toggleSubmitButton(false);
      updateTemporaryDataView();
    }, 0);
  });
}

window.addEventListener('load', initForm);
