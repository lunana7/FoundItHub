<template>
  <div class="contact-container">
    <div class="container">
      <div class="custom-contact-header">
        <h1>Contact Us</h1>
        <p>
          If you have any questions or comments, please don't hesitate to
          contact us.
        </p>
      </div>

      <div class="custom-contact-info">
        <h2>Our Contact Details</h2>
        <p>Email: example@example.com</p>
        <p>Phone: 123-456-7890</p>
      </div>

      <div class="custom-contact-form">
        <h2>Send Us a Message</h2>
        <form @submit.prevent="submitForm">
          <div class="custom-form-group">
            <label for="name">Name:</label>
            <input id="name" v-model="name" required />
          </div>

          <div class="custom-form-group">
            <label for="email">Email:</label>
            <input id="email" v-model="email" required />
          </div>

          <div class="custom-form-group">
            <label for="subject">Subject:</label>
            <input id="subject" v-model="subject" required />
          </div>

          <div class="custom-form-group">
            <label for="message">Message:</label>
            <textarea id="message" v-model="message" required></textarea>
          </div>

          <button :style="buttonStyle" type="submit">
            {{ submitButtonText }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      subject: "",
      message: "",
      isSubmitting: false,
    };
  },
  computed: {
    buttonStyle() {
      return {};
    },
    submitButtonText() {
      return this.isSubmitting ? "Submitting..." : "Submit";
    },
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true;
      try {
        const response = await fetch("http://localhost:3007/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            subject: this.subject,
            message: this.message,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error sending email");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
<style scoped>
.contact-container {
  font-family: "Roboto";
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 50px;
}

.container {
  width: 90%;
  max-width: 600px;
  padding: 20px;
  background-color: #ffffff; /* This is a blue color */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* Increased blur and spread distance */
  border-radius: 8px;
}

.custom-contact-header h1,
.custom-contact-info h2,
.custom-contact-form h2 {
  color: #333;
}

.custom-contact-header p,
.custom-contact-info p,
.custom-form-group label {
  color: #666;
}

.custom-form-group {
  margin-bottom: 15px;
}

.custom-form-group input,
.custom-form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.custom-form-group textarea {
  min-height: 100px;
}

button {
  background-color: #0056b3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #004494;
}
</style>
