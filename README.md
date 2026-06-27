# ApexAuto - Next-Gen Dealership

Welcome to **ApexAuto**, a premium, modern, and high-performance car inventory and sales management system. Built with React, Tailwind CSS, and the Gemini API, ApexAuto provides a seamless experience for discovering, configuring, and purchasing premium vehicles.

## 🌟 Features

- **Interactive Discovery:** Search through global inventory using natural language, powered by the Gemini AI and Google Search integration.
- **Custom Configuration:** Build your perfect drive with our intuitive vehicle configurator. Add custom options, view dynamic pricing, and generate exact specifications.
- **Expert Analysis:** Get AI-driven expert comparisons and advice on premium vehicles to help make informed purchasing decisions.
- **Real-time Statistics:** Track dealership performance with interactive charts (revenue over time, popular configurations) using Recharts.
- **Order Management:** View transaction history, generate professional receipts, and print invoices directly from the browser.
- **Persistent Storage:** Your orders and configurations are safely stored locally so you never lose your data.

## 📸 Screenshots

### Discover Your Perfect Drive
![Discover Mode](./public/screenshot1.jpg)

### Vehicle Details & AI Search
![Vehicle Overview](./public/screenshot2.jpg)

### Custom Vehicle Configuration
![Configure Mode](./public/screenshot3.jpg)

*(Note: If viewing on GitHub, ensure the screenshots are uploaded to the `public/` directory with the names `screenshot1.jpg`, `screenshot2.jpg`, and `screenshot3.jpg`!)*

## 🚀 Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Animations:** Motion (Framer Motion)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Backend/AI:** Express.js, Google Gen AI SDK (Gemini 3.1 Pro, Gemini 2.5 Flash)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd apexauto
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**
   Create a \`.env\` file in the root directory and add your Gemini API Key:
   \`\`\`env
   GEMINI_API_KEY=your_api_key_here
   \`\`\`

4. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will be running at \`http://localhost:3000\`.

## 📦 Deployment (Vercel)

ApexAuto is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add your \`GEMINI_API_KEY\` to the Vercel Environment Variables.
4. Deploy! The \`vercel.json\` and \`api/index.ts\` are already set up to handle the Express serverless functions.

## 📄 License

This project is licensed under the MIT License.
