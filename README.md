
# Resume Builder

**Resume Builder** is a professional **Next.js** application designed to simplify the process of creating resumes. With customizable themes and PDF download capabilities, this application enables users to input, organize, and showcase their personal information, educational background, work experiences, and projects efficiently.

## 🚀 Features

-  **User-Friendly Interface**: Simplified data entry process.
-  **Customizable Themes**: Select from various design options.
-  **High-Quality PDF Export**: Download polished resumes as PDFs.
-  **Real-Time Preview**: Instantly view updates as you make changes.
-  **Comprehensive Management**: Manage education, work experiences, and projects.
-  **Responsive Design**: Optimized for both mobile and desktop devices.

## 🔧 Technology Stack

-  **Next.js**: React-based framework for building web applications.
-  **TypeScript**: For static type checking.
-  **Tailwind CSS**: Rapid UI development.
-  **Drizzle ORM**: Modern ORM for data management.
-  **Vercel**: For live deployment.
-  **Gemini API**: For AI-powered resume generation.

## 📂 Project Structure

The project is well-organized, with a modular directory structure that supports scalability and maintainability. Here's an overview:

```
RESUME-BUILDER/
├──	app/
│	├── (home)
│	│   ├── _components/
│	│   │   ├── common/ // Common components for resume input headers
│	│   │   │   ├── Download.tsx
│	│   │   │   ├── Header.tsx
│	│   │   │   ├── MoreOption.tsx
│	│   │   │   ├── ResumeItem.tsx
│	│   │   │   ├── ResumeTitle.tsx
│	│   │   │   ├── Share.tsx
│	│   │   │   ├── ThemeColor.tsx
│	│   │   │   └── TopSection.tsx
│	│   │   └── forms/ // Form components for resume input
│	│   │       ├── CertificateForm.tsx
│	│   │       ├── EducationForm.tsx
│	│   │       ├── ExperienceForm.tsx
│	│   │       ├── PersonalInfoForm.tsx
│	│   │       ├── ProjectForm.tsx
│	│   │       ├── SummaryForm.tsx
│	│   │       ├── AddResume.tsx
│	│   │       ├── EditResume.tsx
│	│   │       ├── PreviewModal.tsx
│	│   │       ├── ResumeForm.tsx
│	│   │       ├── ResumeList.tsx
│	│   │       ├── ResumePreview.tsx
│	│   │       └── TrashListBox.tsx
│	│	├── dashboard/ // User dashboard for managing resumes
│	│	│	├── document/
│	│	│	│   └── [documentId]/edit/page.ts
│	│	│   └── document.ts
│	│	└── layout.tsx 
│	├── (landingPage)/ // Landing page for new users
│	│   ├── Layout.tsx 
│	│   └── page.tsx 
│	├── (public)/ // Public pages for sharing resumes
│	│	│── _components/ 
│	│	│   ├── Error.tsx 
│	│	│   └── PreviewResume.tsx 
│	│	│── preview/ // Resume preview page
│	│	│   └── [documentId]/resume/page.tsx 
│	├── api/
│	│   ├── [[...route]]/ // Dynamic API routes for documents
│	│	│   ├── document.tsx 
│	│   │   └── route.ts 
│	│   └── auth/kindeAuth/route.ts // Kinde authentication API
│	├── fonts/
│	├── globals.css // Global styles
│	└── layout.tsx // Main layout component
├── components/
│   ├── editorEducation/ index.ts // Education editor component with ai
│   ├── editorExperience/ index.ts // Experience editor component with ai 
│   ├── editorProject/ index.ts // Project editor component with ai 
│   ├── nav-bar/ index.ts // Navigation bar component 
│   ├── preview/
│	│   ├── CertificatesPreview.tsx // Certificates preview component
│	│   ├── EducationPreview.tsx // Education preview component
│	│   ├── ExperiencePreview.tsx // Experience preview component 
│	│   ├── PersonalInfo.tsx // Personal info preview component
│	│   ├── ProjectsPreview.tsx // Projects preview component
│	│   └── SummaryPreview.tsx // Summary preview component 
│   ├── skeleton-loader/
│	│   ├── index.tsx // Skeleton loader for resume preview
│	│   └── personal-info-loader.tsx // Skeleton loader for personal info
├── constant/ colors.ts // Theme colors 
├── context/
│   ├── query-provider.tsx  // Query context provider
│   ├── resume-info-provider.tsx  // Resume context provider 
│   └── theme-provider.tsx // Theme context provider
├── db/
│	│── schema/
│	│   ├── certificates.ts // Certificate schema
│	│   ├── document.ts     // Document schema
│	│   ├── education.ts   // Education schema
│	│   ├── experience.ts // Experience schema
│	│   ├── index.ts // Database connection
│	│   ├── personal-info.ts // Personal info schema
│	│   └── project.ts // Project schema
│   └── index.ts // Database connection
├── drizzle/
├── features/document/
│   ├── use-create-document.ts // Create a new document 
│   ├── use-get-document-by-id.ts // Get document by ID
│   ├── use-get-documents.ts // Get all documents 
│   ├── use-restore-documents.ts // Restore deleted documents
│   └── use-update-document.ts // Update document data 
├── hooks/
│   ├── use-debounce.ts // Debounce input changes 
│   ├── use-origin.ts // Get the origin of the request 
│   └── use-toast.ts
├── lib/
│   ├── dummy.ts // Dummy data for testing purposes 
│   ├── google-ai-model.ts // Google AI Model API
│   ├── helper.ts // Helper functions for API calls and data manipulation
│   ├── hono-rpc.ts // Hono RPC API
│   ├── kinde.ts // Kinde API
│   └── utils.ts // Utility functions
├── types/
│   └── resume.types.ts // Resume Data Types
└── .env // Environment variables
└── package.json // Project dependencies
└── tailwind.config.ts // Tailwind CSS configuration
└── drizzle.config.ts // Drizzle ORM configuration
```

## 🌐 Getting Started

### Prerequisites

-  **Node.js** (v14 or later)

-  **npm** or **yarn**

### Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/kemalcalak/Resume-Builder.git
```

2. Navigate to the project directory:

```bash
cd Resume-Builder
```

3. Configure environment variables:

Update the `.env` file with your credentials. For example:

```bash
POSTGRES_DATABASE="neondb" #Database name
POSTGRES_HOST=""       #Database host
POSTGRES_PASSWORD=""    #Database password
POSTGRES_PRISMA_URL=""  #Prisma URL
DATABASE_URL=""        #Database URL
DATABASE_URL_UNPOOLED=""    #Database URL without pooling
PGHOST=""           #Postgres host
PGHOST_UNPOOLED=""  #Postgres host without pooling
PGUSER=""        #Postgres user
PGDATABASE=""   #Postgres database
PGPASSWORD=""   #Postgres password
POSTGRES_URL="" #Postgres URL
POSTGRES_URL_NON_POOLING="" #Postgres URL without pooling
POSTGRES_URL_NO_SSL=""  #Postgres URL without SSL
POSTGRES_USER=neondb_owner  #Postgres user
KINDE_CLIENT_ID=    #Kinde client ID
KINDE_CLIENT_SECRET=""  #Kinde client secret
KINDE_ISSUER_URL="" #Kinde issuer URL
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
NEXT_PUBLIC_APP_URL=http://localhost:3000   
NEXT_PUBLIC_GEMINI_API_KEY= #Gemini API key
```

>  **Note**: For Kinde configurations, register at [Kinde.com](https://kinde.com). For NeonDB, register at [Vercel.com](https://vercel.com).

4. Install dependencies:

```bash
npm install
```

or

```bash
yarn install
```

5. Start the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

6. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

  

## 📜 Usage

1.  **Home Page**: Input personal information and organize categories.

2.  **Preview Resume**: View your inputs in real-time.

3.  **AI-Powered Assistance**: Leverage Gemini AI for quick resume generation.

4.  **Download as PDF**: Export your resume in a polished PDF format.

## 🛠 Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.

2. Create a new feature branch:

```bash
git checkout -b feature/my-new-feature
```

3. Commit your changes:

```bash
git commit -m 'Add some feature'
```

4. Push your branch:

```bash
git push origin feature/my-new-feature
```

5. Open a pull request for review.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

## ✨ Contact
  
For inquiries or support, feel free to reach out through [kemalcalak.com](https://kemalcalak.com/contact).