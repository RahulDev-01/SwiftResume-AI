import axios from 'axios';

// Hardcoded for the specific resume ID seen in logs
const documentId = 'ylamymzerppedinr4y013t2r';
const apiKey = '9df68c973f86bab142e153e24752e2323c6411d059ca808f3ab9beb29044f6b06db677ee0de8d450a92b25d0ffd006d80c6c40ba3775a7bef8e0dda39a641268c1fbbda7e495059db739d504de6afcd1f01f8fe899f30edbe80191bdc2c0bc829e286a90e95ef8554efecdb7feb2d2e2976020d25e3c96b4fa1809a8fc423a7b';
const baseUrl = 'https://incredible-feast-a32170c2d4.strapiapp.com/api';

async function debugSchema() {
  try {
    console.log(`Fetching resume ${documentId}...`);
    const url = `${baseUrl}/user-resumes/${documentId}?populate=*`;
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const data = response.data.data;
    
    if (!data) {
      console.log('No data found');
      return;
    }

    const attributes = data; // For documentId endpoint, data is usually the object directly? Or data.attributes?
    // Strapi 5 vs 4... let's inspect whatever we get.
    
    console.log('--- ROOT KEYS ---');
    console.log(Object.keys(data));
    
    console.log('--- ATTRIBUTES/DATA KEYS ---');
    // If it's Strapi v4: data.attributes
    // If it's Document Service: data
    const payload = data.attributes || data;
    console.log('--- ALL KEYS ---');
    console.log(JSON.stringify(Object.keys(payload), null, 2));

    console.log('--- DEEP INSPECTION ---');
    // Look for anything resembling 'project'
    const keys = Object.keys(payload);
    const projectKeys = keys.filter(k => k.toLowerCase().includes('project'));
    const languageKeys = keys.filter(k => k.toLowerCase().includes('language'));
    
    console.log('Project-like keys:', projectKeys);
    console.log('Language-like keys:', languageKeys);

  } catch (error) {
    console.error('Error fetching resume:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

debugSchema();
