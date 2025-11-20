import axios from 'axios';

// Diagnostic script to check Strapi connection and permissions
// Run this in your frontend project with: node diagnose-strapi.js

const STRAPI_URL = import.meta.env?.VITE_BASE_URL || process.env.VITE_BASE_URL || 'http://localhost:1337';
const API_KEY = import.meta.env?.VITE_STRAPI_API_KEY || process.env.VITE_STRAPI_API_KEY;

console.log('🔍 Strapi Connection Diagnostic\n');
console.log('Configuration:');
console.log('- STRAPI_URL:', STRAPI_URL);
console.log('- API_KEY:', API_KEY ? '✅ Set (length: ' + API_KEY.length + ')' : '❌ Not set');
console.log('\n');

async function runDiagnostics() {
  // Test 1: Check if Strapi is running
  console.log('Test 1: Checking if Strapi is running...');
  try {
    const healthCheck = await axios.get(`${STRAPI_URL}/_health`);
    console.log('✅ Strapi is running!', healthCheck.data);
  } catch (error) {
    console.log('❌ Strapi is not responding');
    console.log('   Make sure Strapi is running with: npm run develop');
    return;
  }

  console.log('\n');

  // Test 2: Check API connection
  console.log('Test 2: Testing API connection...');
  try {
    const apiClient = axios.create({
      baseURL: `${STRAPI_URL}/api/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    const response = await apiClient.get('user-resumes');
    console.log('✅ API connection successful!');
    console.log('   Found', response.data?.data?.length || 0, 'resumes');
  } catch (error) {
    console.log('❌ API connection failed');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n   💡 This is an authentication error.');
        console.log('   Check your VITE_STRAPI_API_KEY in .env file');
      } else if (error.response.status === 403) {
        console.log('\n   💡 This is a permissions error.');
        console.log('   Go to Strapi admin → Settings → Users & Permissions → Roles → Public');
        console.log('   Enable permissions for User-resume: find, findOne, create, update, delete');
      }
    } else {
      console.log('   Error:', error.message);
    }
    return;
  }

  console.log('\n');

  // Test 3: Try creating a test resume
  console.log('Test 3: Testing resume creation...');
  try {
    const apiClient = axios.create({
      baseURL: `${STRAPI_URL}/api/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    const testPayload = {
      data: {
        title: 'Diagnostic Test Resume',
        resumeId: 'test-' + Date.now(),
        userEmail: 'test@example.com',
        userName: 'Test User',
        themeColor: '#FFA500'
      }
    };

    const response = await apiClient.post('user-resumes', testPayload);
    console.log('✅ Resume creation successful!');
    console.log('   Created resume with ID:', response.data?.data?.documentId);
    
    // Clean up - delete the test resume
    if (response.data?.data?.documentId) {
      await apiClient.delete(`user-resumes/${response.data.data.documentId}`);
      console.log('   ✅ Test resume cleaned up');
    }
  } catch (error) {
    console.log('❌ Resume creation failed');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 403) {
        console.log('\n   💡 Permission denied for creating resumes.');
        console.log('   Go to Strapi admin → Settings → Users & Permissions → Roles → Public');
        console.log('   Enable "create" permission for User-resume');
      }
    } else {
      console.log('   Error:', error.message);
    }
    return;
  }

  console.log('\n');
  console.log('🎉 All tests passed! Your Strapi integration is working correctly.');
  console.log('\nIf you\'re still having issues:');
  console.log('1. Check browser console for errors when creating a resume');
  console.log('2. Check Strapi logs for errors');
  console.log('3. Verify Clerk user data is being passed correctly');
}

runDiagnostics().catch(console.error);
