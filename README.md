
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

- **Authentication with Kinde** - Google Sign-In
- **Creating Resumes**
- **Editing Resumes**
- **Resume Theme Colors**
- **Resume Thumbnail**
- **Shareable Resume Link**
- **Search Trash Resume**
- **Real-Time Editing**
- **Preview Mode**
- **Download Resume to PDF Format**
- **Resume Generation with Gemini AI**
- **Built with Next.js 14**
- **Styled with TailwindCSS and Shadcn UI**
- **Hono API & Tanstack React Query**
- **Vercel PostgreSQL & Drizzle ORM**
- **Deployed on Vercel**

## 📂 Project Structure

The project is well-organized, with a modular directory structure that supports scalability and maintainability. Here's an overview:

```plaintext
RESUME-BUILDER/
├── app/
│   ├── (home)/
│   │   ├── _components/
│   │   │   ├── common/              # Common components for resume input
│   │   │   └── forms/               # Form components for resume input
│   │   ├── dashboard/               # User dashboard for managing resumes
│   │   └── layout.tsx               # Main layout component for home page
│   ├── (landingPage)/               # Landing page for new users
│   ├── (public)/                    # Public pages for sharing resumes
│   │   ├── _components/             # Components for public pages
│   │   └── preview/                 # Resume preview page 
│   ├── api/
│   │   ├── [[...route]]/            # Dynamic API routes for documents
│   │   └── auth/
│   │       └── kindeAuth/
│   │           └── route.ts         # Kinde authentication API
│   ├── fonts/
│   ├── globals.css                  # Global styles
│   └── layout.tsx                   # Main layout component
├── components/
│   ├── editorEducation/
│   │   └── index.ts                 # Education editor component with AI
│   ├── editorExperience/
│   │   └── index.ts                 # Experience editor component with AI
│   ├── editorProject/
│   │   └── index.ts                 # Project editor component with AI
│   ├── nav-bar/
│   │   └── index.ts                 # Navigation bar component 
│   ├── preview/                     # Resume preview components
│   └── skeleton-loader/             # Skeleton loader components
├── constant/
│   └── colors.ts                    # Theme colors 
├── context/                         # Context providers
├── db/
│   ├── schema/                      # Database schema
│   └── index.ts                     # Database connection
├── drizzle/
├── features/
│   └── document/                    # Document features
├── hooks/                           # Custom hooks
├── lib/                             # Utility functions
├── types/                           # Resume data types
├── .env                             # Environment variables
├── package.json                     # Project dependencies
├── tailwind.config.ts               # Tailwind CSS configuration
└── drizzle.config.ts                # Drizzle ORM configuration
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
POSTGRES_DATABASE="neondb"      #Database name
POSTGRES_HOST=""                #Database host
POSTGRES_PASSWORD=""            #Database password
POSTGRES_PRISMA_URL=""          #Prisma URL
DATABASE_URL=""                 #Database URL
DATABASE_URL_UNPOOLED=""        #Database URL without pooling
PGHOST=""                       #Postgres host
PGHOST_UNPOOLED=""              #Postgres host without pooling
PGUSER=""                       #Postgres user
PGDATABASE=""                   #Postgres database
PGPASSWORD=""                   #Postgres password
POSTGRES_URL=""                 #Postgres URL
POSTGRES_URL_NON_POOLING=""     #Postgres URL without pooling
POSTGRES_URL_NO_SSL=""          #Postgres URL without SSL
POSTGRES_USER=neondb_owner      #Postgres user
KINDE_CLIENT_ID=                #Kinde client ID
KINDE_CLIENT_SECRET=""          #Kinde client secret
KINDE_ISSUER_URL=""             #Kinde issuer URL
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
NEXT_PUBLIC_APP_URL=http://localhost:3000   
NEXT_PUBLIC_GEMINI_API_KEY=     #Gemini API key
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


## 🔄 Deploy to Vercel

To deploy this project to Vercel, follow these steps:

### 1. Add Environment Variables

After deploying, navigate to **Vercel > Project Settings > Environment Variables** and add the necessary environment variables for production.

Replace all occurrences of `localhost` with your Vercel domain URL, as shown below:

```plaintext
KINDE_SITE_URL=https://resume-builder-beta-five.vercel.app/
KINDE_POST_LOGOUT_REDIRECT_URL=https://resume-builder-beta-five.vercel.app/
KINDE_POST_LOGIN_REDIRECT_URL=https://resume-builder-beta-five.vercel.app/dashboard
NEXT_PUBLIC_APP_URL=https://resume-builder-beta-five.vercel.app/
```

These variables ensure that the app functions properly on your Vercel deployment.

### 2. Initialize and Deploy

Run the following command to initialize the deployment:

```bash
vercel
```

This command will prompt you to configure the project for the first time if it hasn't been linked to Vercel.

Once configured, deploy the project to production using:

```bash
vercel --prod
```

This will push your latest changes live on Vercel.
  

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
