# 🚀 Starling Labs Dashboard

Real-time dashboard for monitoring cross-border payments powered by blockchain technology.

## Features

### 🎯 **Core Functionality**
- **Real-time Payment Monitoring** - Track payments through every step
- **Quick Send Interface** - Send demo payments with one click
- **Payment Timeline** - Detailed step-by-step progress tracking
- **Statistics Dashboard** - Overview of payment volumes and success rates
- **Responsive Design** - Works on desktop and mobile

### 🛠 **Technical Stack**
- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS with custom Starling theme
- **Components:** Headless UI for modals and menus
- **Icons:** Heroicons for consistent iconography
- **API Integration:** Axios with interceptors
- **Charts:** Recharts for data visualization

## Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/Itsdex47/starling-dashboard.git
cd starling-dashboard
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Configure Environment**
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
STARLING_API_URL=http://localhost:3001
DEMO_JWT_TOKEN=your_jwt_token_from_api_login
NEXT_PUBLIC_DEMO_MODE=true
```

### 4. **Start Development Server**
```bash
npm run dev
```

### 5. **Open in Browser**
Visit [http://localhost:3000](http://localhost:3000)

## 🎮 Demo Mode

The dashboard comes with demo mode enabled by default. This allows you to:
- Send demo payments without real money
- View simulated blockchain transactions
- Experience the full payment flow
- Test all dashboard features

## 🔗 API Integration

The dashboard connects to your Starling Remittance API:

### **Required API Endpoints:**
- `POST /api/payments/demo` - Send demo payments
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/status/:id` - Get payment details
- `GET /health` - System health check

### **Authentication:**
Uses JWT tokens for API authentication. Get your token by:
1. Register/login to your Starling API
2. Copy the JWT token
3. Add it to your `.env` file

## 📱 Dashboard Components

### **Payment Stats**
- Total volume sent
- Payments in progress
- Completed payments
- Failed payments

### **Quick Send**
- Simple payment form
- Real-time fee calculation
- Exchange rate display
- Instant payment submission

### **Payments List**
- Recent payment history
- Status indicators
- Payment details modal
- Real-time updates

### **Payment Detail Modal**
- Step-by-step timeline
- Progress tracking
- Transaction hashes
- Fee breakdown
- Auto-refresh for active payments

## 🎨 Customization

### **Theming**
Custom Starling theme defined in `tailwind.config.js`:
```js
colors: {
  starling: {
    50: '#f0f9ff',
    500: '#0ea5e9',
    600: '#0284c7',
    // ... full color palette
  }
}
```

### **Styling**
Tailwind utility classes with custom components in `globals.css`:
- `.card` - Consistent card styling
- `.btn-primary` - Primary button style
- `.status-*` - Status badge variants

## 🚀 Production Deployment

### **Build for Production**
```bash
npm run build
npm start
```

### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Environment Variables**
Set in your deployment platform:
- `STARLING_API_URL` - Your production API URL
- `DEMO_JWT_TOKEN` - Production JWT token
- `NEXT_PUBLIC_DEMO_MODE` - Set to `false` for production

## 🔧 Development

### **Project Structure**
```
├── app/                 # Next.js 13+ app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Dashboard homepage
├── components/         # React components
│   ├── Header.tsx      # Navigation header
│   ├── PaymentStats.tsx
│   ├── QuickSend.tsx
│   ├── PaymentsList.tsx
│   └── PaymentDetailModal.tsx
├── lib/                # Utilities
│   └── api.ts          # API integration
└── public/             # Static assets
```

### **Adding New Features**
1. Create component in `components/`
2. Add API methods to `lib/api.ts`
3. Import and use in pages
4. Style with Tailwind classes

### **API Integration**
All API calls go through `lib/api.ts` with:
- Automatic JWT authentication
- Request/response logging
- Error handling
- TypeScript interfaces

## 🌟 Key Features

### **Real-time Updates**
- Auto-refresh payment status every 30 seconds
- Real-time progress tracking
- Live transaction monitoring

### **Professional UI**
- Clean, modern design
- Responsive layout
- Loading states
- Error handling
- Success notifications

### **Developer Experience**
- TypeScript throughout
- ESLint configuration
- Hot reloading
- Component isolation
- API debugging

## 🎯 Next Steps

### **Week 4 Goals:**
1. ✅ Dashboard foundation
2. 🔄 Real blockchain integration
3. 🔄 Circle API setup
4. 🔄 Live transaction testing

### **Future Enhancements:**
- User authentication system
- Multiple corridor support
- Advanced analytics
- Mobile app
- Admin panel

---

**Built with ❤️ by Starling Labs - The future of cross-border payments**
