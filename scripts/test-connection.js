#!/usr/bin/env node

/**
 * Test script to verify API connection between dashboard and API
 * Run with: node scripts/test-connection.js
 */

const https = require('http');

const API_BASE_URL = 'http://localhost:3001';
const DASHBOARD_URL = 'http://localhost:3000';

console.log('🔄 Testing Starling Dashboard → API Connection...\n');

// Test API endpoints (updated to match your actual API routes)
const testEndpoints = [
  { path: '/health', description: 'Health Check' },
  { path: '/api/status', description: 'API Status' },
  { path: '/api/corridors', description: 'Corridors Endpoint' },
  { path: '/debug/routes', description: 'Routes Debug' }
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
        console.log(`     Response preview: ${result.data.substring(0, 80)}...`);
      }
    } else {
      console.log('❌ FAILED');
      console.log(`     Error: ${result.error || `HTTP ${result.status}`}`);
      allPassed = false;
    }
    console.log('');
  }
  
  console.log('📋 Connection Summary:');
  console.log(`  API Base URL: ${API_BASE_URL}`);
  console.log(`  Dashboard URL: ${DASHBOARD_URL}`);
  console.log(`  Status: ${allPassed ? '✅ All Connected' : '❌ Issues Found'}\n`);
  
  if (allPassed) {
    console.log('🎉 SUCCESS! Your API is running and responding properly.');
    console.log('   Your dashboard should now be able to connect to your API.');
    console.log('   Start your dashboard with: npm run dev');
  } else {
    console.log('🚨 ISSUES DETECTED:');
    console.log('   1. Make sure your API is running on http://localhost:3001');
    console.log('   2. Check API logs for errors');
    console.log('   3. Verify your .env file is properly configured');
    console.log('   4. Try restarting your API server');
  }
  
  console.log('\n🔧 Next Steps:');
  console.log('   1. Start your API: cd starling-remittance-api && npm run dev');
  console.log('   2. Start your dashboard: cd starling-dashboard && npm run dev');
  console.log('   3. Visit http://localhost:3000 to see your connected dashboard');
  console.log('\n📝 Available API Endpoints:');
  console.log('   • GET /health - Health check');
  console.log('   • GET /api/status - API status');
  console.log('   • POST /api/auth/login - User login');
  console.log('   • POST /api/payments/quote - Get payment quote');
  console.log('   • POST /api/payments/demo - Demo payment');
  console.log('   • GET /api/corridors - Supported corridors');
}

// Run the tests
runTests().catch(console.error);
