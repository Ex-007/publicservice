<template>
    <div class="support-page">
      <!-- Header Section -->
      <div class="support-header">
        <h1>Support Center</h1>
        <p>We're here to help you with any questions or issues you may have.</p>
      </div>
  
      <!-- FAQs Section -->
      <div class="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
          <h3 @click="toggleFAQ(index)">{{ faq.question }}</h3>
          <p v-if="faq.open">{{ faq.answer }}</p>
        </div>
      </div>
  
      <!-- Contact Support Section -->
      <div class="contact-support">
        <h2>Contact Support</h2>
        <p>For urgent issues, reach out to us via:</p>
        <ul>
          <li>📧 Email: <a href="mailto:support@example.com">support@example.com</a></li>
          <li>📞 Phone: <a href="tel:+123456789">+123 456 789</a></li>
          <li>💬 Live Chat: Available during business hours</li>
        </ul>
      </div>
  
      <!-- Troubleshooting Section -->
      <div class="troubleshooting">
        <h2>Troubleshooting & Common Issues</h2>
        <ul>
          <li v-for="issue in troubleshootingTips" :key="issue.id">{{ issue.tip }}</li>
        </ul>
      </div>
  
      <!-- User Guides Section -->
      <div class="user-guides">
        <h2>Guides & Resources</h2>
        <p>Learn how to use our platform with step-by-step tutorials.</p>
        <ul>
          <li><a href="#">How to create an account</a></li>
          <li><a href="#">Booking a service provider</a></li>
          <li><a href="#">Managing your requests</a></li>
          <li><a href="#">Understanding the premium features</a></li>
        </ul>
      </div>
  
      <!-- Feedback Section -->
      <div class="feedback-section">
        <h2>Feedback & Suggestions</h2>
        <p>We value your feedback. Share your thoughts with us!</p>
        <textarea v-model="feedback" placeholder="Write your feedback here..."></textarea>
        <button @click="submitFeedback">Submit Feedback</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const faqs = ref([
    { question: "How do I register?", answer: "Click on 'Sign Up' and fill in your details.", open: false },
    { question: "How do I book a service provider?", answer: "Search for a provider, view their profile, and click 'Book Now'.", open: false },
    { question: "How can I contact customer support?", answer: "Email us at support@example.com or call +123 456 789.", open: false }
  ]);
  
  const troubleshootingTips = ref([
    { id: 1, tip: "Ensure you have a stable internet connection." },
    { id: 2, tip: "Try clearing your browser cache and refreshing the page." },
    { id: 3, tip: "Make sure you're using the latest version of the app." }
  ]);
  
  const feedback = ref('');
  
  const toggleFAQ = (index) => {
    faqs.value[index].open = !faqs.value[index].open;
  };
  
  const submitFeedback = () => {
    if (feedback.value.trim()) {
      alert("Thank you for your feedback!");
      feedback.value = '';
    }
  };
  </script>
  
  <style scoped>
  .support-page {
    padding: 20px;
    max-width: 800px;
    margin: auto;
  }
  
  .support-header {
    text-align: center;
    background: #007bff;
    color: white;
    padding: 20px;
    border-radius: 10px;
  }
  
  h2 {
    color: #007bff;
  }
  
  .faq-item h3 {
    cursor: pointer;
    color: #333;
  }
  
  .contact-support, .troubleshooting, .user-guides, .feedback-section {
    margin-top: 20px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 10px;
  }
  
  .feedback-section textarea {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
  }
  
  button {
    background: #007bff;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
  }
  </style>
  