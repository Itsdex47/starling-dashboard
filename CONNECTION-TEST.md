# 🚀 Dashboard-API Connection Testing Guide

**Your dashboard has been configured and is ready to connect to your API!**

## ✅ **What Was Fixed:**

1. **API URL Configuration** - Updated to include `/api` path
2. **Environment Variables** - Corrected in `.env.local`
3. **Connection Testing** - Added automated testing script
4. **Package Scripts** - Added convenient test commands

---

## 🧪 **Step-by-Step Testing:**

### **Step 1: Test API Connectivity**

First, make sure your API is running and test the connection:

```bash
# Navigate to your dashboard directory
cd starling-dashboard

# Test the API connection
npm run test:connection
```

**Expected Output:**
```
✅ Health Check... PASSED
✅ Payments Endpoint... PASSED  
✅ Exchange Rates... PASSED
🎉 SUCCESS! Your dashboard is properly connected to your API.
```

### **Step 2: Start Both Services**

**Terminal 1 (API):**
```bash
cd starling-remittance-api
npm run dev
# Should show: API running on http://localhost:3001
```

**Terminal 2 (Dashboard):**
```bash
cd starling-dashboard
npm run dev
# Should show: Dashboard running on http://localhost:3000
```

### **Step 3: Verify Dashboard Connection**

1. **Open Dashboard**: Visit `http://localhost:3000`
2. **Check Connection Status**: Look for real data instead of mock data
3. **Test Payment Flow**: Try sending a demo payment
4. **Monitor API Logs**: Check API terminal for incoming requests

---

## 🔍 **Troubleshooting:**

### **❌ If API Test Fails:**

1. **Check API Status:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Verify API Routes:**
   - Make sure your API has `/api` prefix on routes
   - Check that endpoints match the expected paths

3. **Check CORS Settings:**
   Your API should allow requests from `localhost:3000`

### **❌ If Dashboard Shows Mock Data:**

1. **Check Browser Console** for errors
2. **Verify Environment Variables** in `.env.local`
3. **Test API Directly** using the test script

### **❌ Connection Errors:**

1. **Port Conflicts**: Make sure ports 3000 and 3001 are available
2. **Firewall Issues**: Ensure localhost connections are allowed
3. **Process Issues**: Restart both API and dashboard

---

## 📋 **Connection Verification Checklist:**

- [ ] API running on `http://localhost:3001`
- [ ] Dashboard running on `http://localhost:3000`
- [ ] Test script passes: `npm run test:connection`
- [ ] Dashboard shows real data (not mock)
- [ ] Payment flow works end-to-end
- [ ] Browser console shows no errors

---

## 🎯 **Expected API Endpoints:**

Your API should have these endpoints available:

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/health` | GET | Health check |
| `/api/payments` | GET | Payment history |
| `/api/payments/send` | POST | Send payment |
| `/api/exchange-rates` | GET | Exchange rates |
| `/api/auth/login` | POST | Authentication |

---

## 🆘 **Quick Fixes:**

### **Fix 1: Reset Configuration**
```bash
cd starling-dashboard
git pull origin main  # Get latest fixes
npm install           # Update dependencies
```

### **Fix 2: Clean Restart**
```bash
# Kill all Node processes
pkill -f node

# Restart API
cd starling-remittance-api && npm run dev

# Restart Dashboard  
cd starling-dashboard && npm run dev
```

### **Fix 3: Environment Reset**
```bash
cd starling-dashboard
cp .env.example .env.local
# Then edit .env.local with correct API URL
```

---

## 🎉 **Success Indicators:**

**✅ Everything is working when you see:**

1. **Test Script**: All endpoints return ✅ PASSED
2. **Dashboard**: Real payment data loads
3. **API Logs**: Incoming requests from dashboard
4. **Browser**: No CORS or connection errors
5. **Payment Flow**: Demo payments process successfully

---

## 📞 **Need Help?**

If you encounter issues:

1. **Run the test script**: `npm run test:connection`
2. **Check both terminal outputs** for errors
3. **Verify the API endpoints** match the expected format
4. **Test with curl** to isolate issues

**Your integration should now be working perfectly! 🚀**
