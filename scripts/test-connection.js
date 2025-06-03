#!/usr/bin/env node

/**
 * Test script to verify API connection between dashboard and API
 * Run with: node scripts/test-connection.js
 */

const https = require('http');

const API_BASE_URL = 'http://localhost:3001/api';
const DASHBOARD_URL = 'http://localhost:3000';

console.log('🔄 Testing Starling Dashboard → API Connection...\n');

// Test API endpoints
const testEndpoints = [
  { path: '/health', description: 'Health Check' },
  { path: '/payments', description: 'Payments Endpoint' },
  { path: '/exchange-rates', description: 'Exchange Rates' }
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${API_BASE_URL}${endpoint.path}`;
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          success: res.statusCode < 400,
          status: res.statusCode,
          data: data.slice(0, 200) + (data.length > 200 ? '...' : '')
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function runTests() {
  console.log('📡 Testing API Endpoints:\n');
  
  let allPassed = true;
  
  for (const endpoint of testEndpoints) {
    process.stdout.write(`  ${endpoint.description}... `);
    
    const result = await testEndpoint(endpoint);
    
    if (result.success) {
      console.log('✅ PASSED');
      if (result.data) {
        console.log(`     Response: ${result.data.substring(0, 80)}...`);
      }
    } else {
      console.log('❌ FAILED');
      console.log(`     Error: ${result.error || `HTTP ${result.status}`}`);
      allPassed = false;
    }
    console.log('');
  }
  
  console.log('📋 Connection Summary:');
  console.log(`  API URL: ${API_BASE_URL}`);
  console.log(`  Dashboard URL: ${DASHBOARD_URL}`);
  console.log(`  Status: ${allPassed ? '✅ All Connected' : '❌ Issues Found'}\n`);
  
  if (allPassed) {
    console.log('🎉 SUCCESS! Your dashboard is properly connected to your API.');
    console.log('   You can now start your dashboard with: npm run dev');
  } else {
    console.log('🚨 ISSUES DETECTED:');
    console.log('   1. Make sure your API is running on http://localhost:3001');
    console.log('   2. Check if your API has /api routes configured');
    console.log('   3. Verify CORS settings allow localhost:3000');
    console.log('   4. Check your .env.local file configuration');
  }
  
  console.log('\n🔧 Next Steps:');
  console.log('   1. Start your API: cd starling-remittance-api && npm run dev');
  console.log('   2. Start your dashboard: cd starling-dashboard && npm run dev');
  console.log('   3. Visit http://localhost:3000 to see your connected dashboard');
}

// Run the tests
runTests().catch(console.error);
