# Starling Dashboard API Integration Setup

This guide will help you connect the Starling Dashboard to the Starling Remittance API.

## Prerequisites

1. **Starling Remittance API** should be running (typically on port 3001)
2. **Node.js** and **npm/pnpm** installed
3. **Git** for version control

## Quick Setup

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Starling Remittance API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
STARLING_API_URL=http://localhost:3001/api

# Development Environment
NODE_ENV=development

# CORS Origin (for API to allow dashboard)
NEXT_PUBLIC_CORS_ORIGIN=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Start the Dashboard

```bash
npm run dev
# or
pnpm dev
```

The dashboard will be available at `http://localhost:3000`

## API Connection Details

### Default Configuration

- **Dashboard**: `http://localhost:3000`
- **API**: `http://localhost:3001/api`
- **Auto-fallback**: If API is unavailable, dashboard uses mock data

### API Endpoints Expected

The dashboard expects these endpoints from your `starling-remittance-api`:

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/health` | GET | Health check |
| `/api/payments` | GET | Get payment history |
| `/api/payments/send` | POST | Send a payment |
| `/api/payments/receive` | POST | Create payment request |
| `/api/payments/status/:id` | GET | Get payment status |
| `/api/exchange-rates` | GET | Get exchange rates |
| `/api/auth/login` | POST | User authentication |
| `/api/auth/logout` | POST | User logout |

### API Response Formats

#### Payment Object
```typescript
{
  id: string
  recipient: string
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  type: 'sent' | 'received'
  timestamp: string
  reference?: string
  description?: string
}
```

#### Exchange Rate Object
```typescript
{
  from: string
  to: string
  rate: number
  timestamp: string
}
```

## Advanced Configuration

### Custom API URL

For production or different environments:

```env
NEXT_PUBLIC_API_URL=https://api.starlingremittance.com/v1
```

### Authentication Setup

If your API requires authentication:

```env
STARLING_API_KEY=your_api_key_here
STARLING_JWT_SECRET=your_jwt_secret_here
```

### Database Configuration

If you need to configure database connections:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/starling_remittance
REDIS_URL=redis://localhost:6379
```

## CORS Configuration

### For API Server

Your `starling-remittance-api` should allow requests from the dashboard:

```javascript
// In your API server (Express example)
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-dashboard-domain.com'],
  credentials: true
}))
```

### For Production

Update your environment variables for production:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_CORS_ORIGIN=https://your-dashboard-domain.com
```

## Troubleshooting

### Dashboard shows mock data

1. Check if API is running: `curl http://localhost:3001/api/health`
2. Verify CORS settings in your API
3. Check network connectivity
4. Review browser console for errors

### API connection errors

1. Verify API URL in `.env.local`
2. Check if API server is running
3. Ensure firewall/security groups allow connections
4. Test API endpoints directly

### Authentication issues

1. Verify JWT tokens are valid
2. Check API key configuration
3. Ensure proper CORS headers for authentication

## Development vs Production

### Development Mode
- Uses mock data fallback
- Detailed error logging
- Hot reload enabled

### Production Mode
- Requires working API connection
- Optimized builds
- Error reporting/monitoring

## Testing the Connection

### Manual Testing

1. **Health Check**:
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Get Payments**:
   ```bash
   curl http://localhost:3001/api/payments
   ```

3. **Send Payment**:
   ```bash
   curl -X POST http://localhost:3001/api/payments/send \
     -H "Content-Type: application/json" \
     -d '{"recipient":"John Doe","amount":100,"currency":"GBP"}'
   ```

### Dashboard Testing

1. Open dashboard at `http://localhost:3000`
2. Check if real data loads (vs mock data)
3. Try sending a payment
4. Verify payment history updates

## Support

If you encounter issues:

1. Check the console logs in your browser
2. Verify API server logs
3. Ensure all environment variables are set correctly
4. Test API endpoints independently

For detailed API documentation, refer to your `starling-remittance-api` documentation. 