<template>
    <section class="how-it-works">
      <div class="container">
        <h2>How It Works</h2>
        <p class="description">Find professionals for your needs in just a few steps.</p>
  
        <div class="steps">
          <div class="step">
            <div class="icon">
              <i class="fa fa-search"></i>
            </div>
            <h3>Search for a Service Provider</h3>
            <p>Enter the service you need, and we’ll locate professionals near you.</p>
          </div>
  
          <div class="step">
            <div class="icon">
              <i class="fa fa-user"></i>
            </div>
            <h3>Choose the Best Match</h3>
            <p>Check provider details, ratings, and distance before making a choice.</p>
          </div>
  
          <div class="step">
            <div class="icon">
              <i class="fa fa-thumbs-up"></i>
            </div>
            <h3>Get the Service</h3>
            <p>Contact the provider and get your service done quickly and efficiently.</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>

</script>
  <style scoped>
  .how-it-works {
    padding: 80px 20px;
    background: #f8f9fa;
    text-align: center;
  }
  
  .container {
    max-width: 900px;
    margin: auto;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  .description {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 30px;
  }
  
  /* Responsive Grid Layout */
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .step {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
  }
  
  .step:hover {
    transform: translateY(-5px);
  }
  
  .icon {
    font-size: 2.5rem;
    color: #007bff;
    margin-bottom: 15px;
  }
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
  }
  
  /* Media Query for Mobile */
  @media (max-width: 768px) {
    .steps {
      grid-template-columns: 1fr;
    }
  }
  </style>
  