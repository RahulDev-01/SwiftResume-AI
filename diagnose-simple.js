const axios = require('axios');

// Simple diagnostic script - run with: node diagnose-simple.js
// Make sure to set these environment variables or update them below

const STRAPI_URL = process.env.VITE_BASE_URL || 'http://localhost:1337';
const API_KEY = process.env.VITE_STRAPI_API_KEY || '';

console.log('🔍 Strapi Connection Diagnostic\n');
console.log('Configuration:');
console.log('- STRAPI_URL:', STRAPI_URL);
console.log('- API_KEY:', API_KEY ? '✅ Set' : '❌ Not set');
console.log('\n');

async function runDiagnostics() {
  // Test 1: Check if Strapi is running
  console.log('Test 1: Checking if Strapi is running...');
  try {
    await axios.get(`${STRAPI_URL}/_health`);
    console.log('✅ Strapi is running!\n');
  } catch (error) {
    console.log('❌ Strapi is not responding');
    console.log('   Make sure Strapi is running with: npm run develop\n');
    return;
  }

  // Test 2: Check API connection
  console.log('Test 2: Testing API connection...');
  try {
    const response = await axios.get(`${STRAPI_URL}/api/user-resumes`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    console.log('✅ API connection successful!');
    console.log('   Found', response.data?.data?.length || 0, 'resumes\n');
  } catch (error) {
    console.log('❌ API connection failed');
    if (error.response?.status === 401) {
      console.log('   💡 Authentication error - check your API key\n');
    } else if (error.response?.status === 403) {
      console.log('   💡 Permission error - enable permissions in Strapi admin\n');
    } else {
      console.log('   Error:', error.message, '\n');
    }
    return;
  }

  // Test 3: Try creating a test resume
  console.log('Test 3: Testing resume creation...');
  try {
    const testPayload = {
      data: {
        title: 'Test Resume',
        resumeId: 'test-' + Date.now(),
        userEmail: 'test@example.com',
        userName: 'Test User',
        themeColor: '#FFA500'
      }
    };

    const response = await axios.post(`${STRAPI_URL}/api/user-resumes`, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    console.log('✅ Resume creation successful!');
    const docId = response.data?.data?.documentId;
    console.log('   Created resume with ID:', docId);
    
    // Clean up
    if (docId) {
      await axios.delete(`${STRAPI_URL}/api/user-resumes/${docId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      console.log('   ✅ Test resume cleaned up\n');
    }
  } catch (error) {
    console.log('❌ Resume creation failed');
    if (error.response?.status === 403) {
      console.log('   💡 Enable "create" permission in Strapi admin\n');
    } else {
      console.log('   Error:', error.response?.data || error.message, '\n');
    }
    return;
  }

  console.log('🎉 All tests passed! Your Strapi integration is working correctly.\n');
}

runDiagnostics().catch(console.error);
