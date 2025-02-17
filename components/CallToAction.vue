<template>
    <section class="call-to-action">
      <div class="container">
        <h2>Quick Service</h2>
        <p class="description">Join Thousands of Service Providers or Request For a Service.</p>
  
        <div class="steps">
          <div class="step">
            <div class="icon">
              <i class="fa fa-user"></i>
            </div>
            <button class="primary-btn">Join</button>
          </div>
  
          <div class="step">
            <div class="icon">
              <i class="fa fa-user"></i>
            </div>
            <button class="primary-btn">Search</button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>

</script>
  <style scoped>
  .call-to-action {
    padding: 80px 20px;
    background: #f8f9fa;
    text-align: center;
    margin-top: -100px;
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

  .primary-btn, .secondary-btn{
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease-in-out;
    }
    .primary-btn{
        background-color: #007bff;
        color: white;
    }
    .secondary-btn{
        background-color: transparent;
        color: white;
        border: 2px solid white;
    }
    .primary-btn:hover{
        background-color: #0056b3;
    }
    .secondary-btn:hover{
        background-color: white;
        color: #007bff;
    }
  </style>
  