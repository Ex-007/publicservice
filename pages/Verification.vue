<template>
    <div class="verification-container">
      <div class="verification-header">
        <h2>Get Verified</h2>
        <p>Increase trust and credibility by verifying your identity.</p>
      </div>
      
      <div class="verification-reasons">
        <h3>Why Get Verified?</h3>
        <ul>
          <li>Gain trust from potential customers.</li>
          <li>Improve your chances of getting hired.</li>
          <li>Stand out from unverified service providers.</li>
          <li>Ensure compliance with our platform’s policies.</li>
        </ul>
      </div>
  
      <div class="verification-form">
        <h3>Submit Your Documents</h3>
        <form>
          <label for="nin">National Identification Number (NIN)</label>
          <input type="text" id="nin" placeholder="Enter your NIN" />
          
          <label for="certificate">Certificate of Registration</label>
          <input type="file" id="certificate" />
          
          <label for="permit">Government Permit</label>
          <input type="file" id="permit" />
          
          <button type="submit" class="submit-btn">Submit for Verification</button>
        </form>
      </div>
    </div>
  </template>
  
  <style scoped>
  .verification-container {
    padding: 20px;
    max-width: 600px;
    margin: auto;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .verification-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .verification-reasons ul {
    list-style: none;
    padding: 0;
  }
  
  .verification-reasons li {
    padding: 5px 0;
  }
  
  .verification-form label {
    display: block;
    margin-top: 10px;
    font-weight: bold;
  }
  
  .verification-form input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
  }
  
  .submit-btn:hover {
    background: #0056b3;
  }
  </style>
  