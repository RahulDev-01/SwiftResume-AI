# ✨ SwiftResume AI - AI-Powered Resume Builder

<div align="center">

![SwiftResume AI](https://img.shields.io/badge/SwiftResume-AI%20Powered-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.13-38B2AC?style=for-the-badge&logo=tailwind-css)

**Create professional, ATS-friendly resumes in minutes with the power of AI**

[Live Demo](#) • [Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**SwiftResume AI** is a modern, intelligent resume builder that leverages Google's Gemini AI to help job seekers create professional, ATS-optimized resumes effortlessly. With real-time preview, multiple templates, and AI-powered content generation, building your perfect resume has never been easier.

### Why SwiftResume AI?

- 🤖 **AI-Powered**: Generate professional summaries and descriptions with Google Gemini
- ⚡ **Lightning Fast**: Built with Vite for instant hot module replacement
- 🎨 **Customizable**: Multiple templates and theme colors
- 📱 **Responsive**: Perfect on desktop, tablet, and mobile
- 🔒 **Secure**: Enterprise-grade authentication with Clerk
- 📄 **PDF Export**: Download print-ready PDFs with a single click
- 🔗 **Shareable**: Generate unique public links for your resume

---

## ✨ Features

### 🤖 AI-Powered Content Generation
- **Smart Summaries**: Generate professional summaries based on your job title and experience
- **Experience Descriptions**: AI-generated bullet points for your work experience
- **Skill Recommendations**: Get suggestions for relevant skills in your field

### 📝 Comprehensive Resume Builder
- **Personal Details**: Name, contact info, professional links (LinkedIn, GitHub)
- **Professional Summary**: AI-assisted or custom summary section
- **Work Experience**: Detailed work history with AI-generated descriptions
- **Education**: Academic background and certifications
- **Skills**: Technical and soft skills with visual tags
- **Projects**: Showcase your portfolio projects with links
- **Languages**: Multilingual proficiency levels
- **Certifications**: Professional certifications and achievements

### 🎨 Customization Options
- **Multiple Templates**: Choose from modern, professional resume layouts
- **Theme Colors**: Customize accent colors to match your style
- **Font Size Control**: Adjust text size to fit content on one page
- **Real-time Preview**: See changes instantly as you type

### 📊 Dashboard & Management
- **Resume Dashboard**: Manage multiple resumes from one place
- **Create/Edit/Delete**: Full CRUD operations for your resumes
- **Resume Analytics**: Track views and engagement (coming soon)

### 🔗 Sharing & Export
- **PDF Download**: High-quality, print-ready PDF export
- **Single-Page Optimization**: Automatic content fitting for one-page resumes
- **Public Links**: Share your resume with a unique URL
- **Clickable Links**: All URLs in PDF are fully functional

---

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **Vite 7.1.2** - Next-generation frontend tooling
- **TailwindCSS 4.1.13** - Utility-first CSS framework
- **React Router DOM 7.9.1** - Client-side routing

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Shadcn UI** - Custom component implementation
- **React Simple WYSIWYG** - Rich text editor

### Backend & Services
- **Strapi** - Headless CMS for data management
- **Clerk** - Authentication and user management
- **Google Gemini AI** - AI content generation
- **Axios** - HTTP client for API requests

### Development Tools
- **ESLint** - Code linting
- **Vite** - Build tool and dev server
- **tw-animate-css** - Tailwind animations

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

You'll also need accounts for:
- [Google AI Studio](https://aistudio.google.com/) - For Gemini API key
- [Clerk](https://clerk.com/) - For authentication
- [Strapi](https://strapi.io/) - For backend CMS (or use hosted version)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RahulDev-01/SwiftResume-AI.git
   cd SwiftResume-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Google AI API Key
   VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   
   # Strapi Backend
   VITE_BASE_URL=http://localhost:1337
   VITE_STRAPI_API_KEY=your_strapi_api_key_here
   
   # Frontend URL (for sharing)
   VITE_URL=http://localhost:5173
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 🔐 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_GOOGLE_AI_API_KEY` | Google Gemini API key for AI features | Yes | `AIza...` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for auth | Yes | `pk_test_...` |
| `VITE_BASE_URL` | Strapi backend URL | Yes | `http://localhost:1337` |
| `VITE_STRAPI_API_KEY` | Strapi API token | Yes | `abc123...` |
| `VITE_URL` | Frontend URL for sharing links | Yes | `http://localhost:5173` |

### Getting API Keys

**Google AI (Gemini)**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env.local`

**Clerk**
1. Sign up at [Clerk](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the "Publishable Key" from the dashboard
4. Add to your `.env.local`

**Strapi**
1. Set up Strapi backend (local or cloud)
2. Create an API token in Settings → API Tokens
3. Add the token to your `.env.local`

---

## 📁 Project Structure

```
SwiftResume-AI/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── custom/      # Custom components (Header, etc.)
│   │   ├── shared/      # Shared utilities (RWebShare)
│   │   └── ui/          # Shadcn UI components
│   ├── context/         # React Context providers
│   │   └── ResumeInfoContext.jsx
│   ├── Data/            # Static data and dummy content
│   ├── My-resume/       # Public resume view pages
│   │   └── [resumeId]/
│   │       └── View/    # Resume preview and download
│   ├── Pages/           # Application pages
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Dashboard and resume editor
│   │   └── Home/        # Landing page
│   ├── service/         # API services
│   │   ├── AIModal.js   # Google Gemini integration
│   │   └── GlobalApi.js # Strapi API calls
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.jsx         # App entry point
├── .env.local           # Environment variables
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

---

## 💡 Usage

### Creating Your First Resume

1. **Sign Up/Login**
   - Click "Get Started" on the home page
   - Sign up using Clerk authentication

2. **Create New Resume**
   - Click "Create New Resume" from the dashboard
   - Enter a resume title

3. **Fill in Your Information**
   - **Personal Details**: Name, email, phone, address, LinkedIn, GitHub
   - **Summary**: Use AI to generate or write your own
   - **Experience**: Add work history with AI-generated descriptions
   - **Education**: Add your academic background
   - **Skills**: Add technical and soft skills
   - **Projects**: Showcase your portfolio
   - **Languages**: Add language proficiency
   - **Certifications**: Add professional certifications

4. **Customize Appearance**
   - Choose a template (Classic or Modern)
   - Select theme color
   - Adjust font size for optimal fit

5. **Download or Share**
   - Click "Download Resume" for PDF
   - Click "Share Link" to generate public URL

### Using AI Features

**Generate Summary**
1. Enter your job title
2. Click "Generate from AI"
3. Review and edit the generated summary

**Generate Experience Descriptions**
1. Fill in job title and company
2. Click "Generate from AI"
3. AI will create professional bullet points
4. Edit as needed

---

## 🔌 API Integration

### Strapi Backend Setup

The application requires a Strapi backend with the following content types:

**User Resume**
- `title` (String)
- `firstName` (String)
- `lastName` (String)
- `jobTitle` (String)
- `address` (String)
- `phone` (String)
- `email` (String)
- `linkedin` (String)
- `github` (String)
- `themeColor` (String)
- `summary` (Text)
- `templateId` (String)
- `Experience` (Component, repeatable)
- `Education` (Component, repeatable)
- `Skills` (Component, repeatable)
- `Projects` (Component, repeatable)
- `Languages` (Component, repeatable)
- `Certifications` (Component, repeatable)

### API Endpoints

```javascript
// Get all user resumes
GET /api/user-resumes?filters[userEmail][$eq]={email}

// Get single resume
GET /api/user-resumes/{id}?populate=*

// Create resume
POST /api/user-resumes

// Update resume
PUT /api/user-resumes/{id}

// Delete resume
DELETE /api/user-resumes/{id}
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Update Environment Variables**
   - Set `VITE_URL` to your Vercel URL

### Backend Deployment (Strapi Cloud)

1. Deploy Strapi to Strapi Cloud or your preferred hosting
2. Update `VITE_BASE_URL` in your frontend environment variables
3. Ensure CORS is configured to allow your frontend domain

---

## 🐛 Troubleshooting

### Common Issues

**PDF shows blank page**
- Solution: The print CSS now forces proper text rendering. Clear cache and try again.

**Links not clickable in PDF**
- Solution: Ensure URLs include `http://` or `https://` prefix

**Resume spans 2 pages**
- Solution: Use the font size slider to reduce text size (default is 85%)

**AI generation not working**
- Check your Google AI API key is valid
- Ensure you haven't exceeded API quota
- Check browser console for errors

**Authentication issues**
- Verify Clerk publishable key is correct
- Check Clerk dashboard for any issues
- Clear browser cookies and try again

**Data not saving**
- Check Strapi backend is running
- Verify API token is valid
- Check network tab for API errors

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [Clerk](https://clerk.com/) for authentication
- [Strapi](https://strapi.io/) for backend CMS
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

## 📧 Contact

**Savvana Rahul**
- GitHub: [@RahulDev-01](https://github.com/RahulDev-01)
- LinkedIn: [s-rahul-885613312](https://www.linkedin.com/in/s-rahul-885613312/)
- Email: s.rahul5116@gmail.com

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Savvana Rahul](https://github.com/RahulDev-01)

</div>
