# ✨ SwiftResume AI 📝

SwiftResume AI is a modern, AI-powered resume builder application built with React, Vite, and Tailwind CSS. It leverages Google's Gemini AI 🤖 to help users generate professional resume summaries and content, making the resume creation process faster and more effective. ⚡

## 🎯 Features

- **🤖 AI-Powered Content Generation**: Uses Google Gemini AI to generate professional summaries and experience descriptions based on your job title and history.
- **📋 Interactive Resume Builder**: Easy-to-use forms for Personal Details, Education, Experience, and Skills.
- **👁️ Real-time Preview**: See your resume updates instantly as you type.
- **🎨 Theme Customization**: Change the accent color of your resume to match your style.
- **🔐 Authentication**: Secure user authentication powered by Clerk.
- **📊 Dashboard**: Manage multiple resumes from a central dashboard.
- **🔗 Share & Download**: Generate a unique public link for your resume or download/print it as a PDF.
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: ⚛️ React, ⚡ Vite, 🎨 Tailwind CSS
- **Authentication**: 🔐 Clerk
- **AI Integration**: 🤖 Google Gemini (via `@google/genai`)
- **Backend/CMS**: 📦 Strapi (Headless CMS)
- **Icons**: 🎯 Lucide React
- **UI Components**: 🧩 Radix UI, Shadcn UI (custom implementation)

## 🚀 Setup & Installation

1.  **📥 Clone the repository:**
    ```bash
    git clone <repository-url>
    cd SwiftResume AI
    ```

2.  **📦 Install dependencies:**
    ```bash
    npm install
    ```

3.  **⚙️ Environment Configuration:**
    Create a `.env.local` file in the root directory and add the following environment variables (see `env.example`):

    ```env
    # 🤖 Google AI API Key (Get from https://aistudio.google.com/app/apikey)
    VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key

    # 🔐 Clerk Authentication (Get from https://dashboard.clerk.com/)
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

    # 📦 Strapi API Configuration
    VITE_BASE_URL=http://localhost:1337 # Or your Strapi URL
    VITE_STRAPI_API_KEY=your_strapi_api_key

    # 🌐 Frontend URL (for sharing links)
    VITE_URL=http://localhost:5173 # Or your deployed URL
    ```

4.  **🏃 Run the development server:**
    ```bash
    npm run dev
    ```

5.  **🏗️ Build for production:**
    ```bash
    npm run build
    ```

## 📁 Project Structure

- 📄 `src/Pages`: Application pages (Home, Dashboard, Resume Editor, Auth).
- 🧩 `src/components`: Reusable UI components.
- 🔄 `src/context`: React Context for state management (e.g., `ResumeInfoContext`).
- 🔌 `src/service`: API services (`GlobalApi.js`) and AI integration (`AIModal.js`).
- 👀 `src/My-resume`: Public view for shared resumes.

## 🤝 Contributing

Contributions are welcome! 🎉 Please feel free to submit a Pull Request. 💪
