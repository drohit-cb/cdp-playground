# CDP Playground

A Next.js application for interacting with Coinbase's CDP API.

## Directory Structure


src/
├── app/
│ ├── api/ # Backend API routes
│ │ ├── lib/ # Backend utilities
│ │ │ └── jwt.ts # JWT generation
│ │ ├── config.ts # Backend configuration
│ │ └── wallets/ # Wallet endpoints
│ │ └── route.ts
│ │
│ ├── components/ # Frontend React components
│ │ ├── Canvas.tsx
│ │ ├── Toolbar.tsx
│ │ └── WalletComponent.tsx
│ │
│ ├── services/ # Frontend services
│ │ └── cdp/
│ │ └── CdpApiService.ts
│ │
│ ├── types/ # Shared TypeScript types
│ │ └── wallet.ts
│ │
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout
│ └── page.tsx # Main page


## Setup

1. Clone the repository

```bash
git clone <repository-url>
cd cdp-playground
```

2. Install dependencies

```bash
npm install
```


3. Create environment variables

```bash
CDP_KEY_NAME=your_key_name
CDP_KEY_SECRET=your_key_secret
```


4. Start development server

```bash
yarn dev
```


## Testing

### Backend Testing

1. Using cURL:

```bash
curl -X POST -H "Content-Type: application/json" http://localhost:3000/api/wallets -d \
'{
  "wallet": {
    "network_id": "base-sepolia",
    "use_server_signer": false
  }
}'
```

### Frontend Testing

1. Open http://localhost:3000 in your browser
2. Use the UI to:
   - Drag wallet component onto canvas
   - Configure wallet settings
   - Create new wallet
   - View response

## Key Features

- **Backend**:
  - JWT generation for CDP API
  - Wallet creation endpoint
  - Error handling
  - Environment configuration

- **Frontend**:
  - Draggable components
  - Canvas layout
  - Wallet creation form
  - Real-time feedback

## Development

- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn start`: Start production server
- `yarn lint`: Run linter
- `yarn lint:fix`: Fix linting issues

## Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request