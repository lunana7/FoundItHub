<template>
  <div class="footer">
    <div class="footer-item">
      <a href="https://twitter.com" target="_blank">
        <p>Twitter</p>
      </a>
    </div>
    <div class="footer-item">
      <a href="https://instagram.com" target="_blank">
        <p>Instagram</p>
      </a>
    </div>
    <div class="footer-item">
      <a href="mailto:contact@yourwebsite.com">
        <p>Contact Us</p>
      </a>
    </div>
    <div class="footer-item">
      <a href="/feedback">
        <p>Feedback</p>
      </a>
    </div>
  </div>
</template>

<style scoped>
.footer {
  height: 80px;
  background-color: #003366; /* Dark blue */
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-item {
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #66ccff; /* Light blue */
}

.footer-item a {
  color: inherit; /* Inherit color from .footer-item */
  text-decoration: none; /* Remove underline */
}

.footer-item a:hover {
  color: #ffffff; /* White */
}

.footer-item i {
  font-size: 24px;
  margin-bottom: 5px;
}

.footer-item p {
  font-size: 14px;
  margin: 0;
}
</style>
