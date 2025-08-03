# RealityCanvas - Property Management Platform

A modern property management platform built with Next.js 15, Prisma, and Supabase.

## Features

- 🏠 Property listings with rich descriptions
- 📸 Image upload and gallery management
- ✏️ Rich text editor for property descriptions
- 🎨 Modern, responsive UI with dark mode support
- 📱 Mobile-friendly design
- 🔍 Property search and filtering
- 📞 Contact forms for property inquiries

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Supabase for image uploads
- **Styling**: Tailwind CSS
- **Editor**: React Quill with table support
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Supabase account (for image storage)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/realitycanvas"
DIRECT_URL="postgresql://username:password@localhost:5432/realitycanvas"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Run database migrations:
```bash
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment on Vercel

### Prerequisites

1. **Database**: Set up a PostgreSQL database (recommended: Supabase, Neon, or Railway)
2. **Supabase**: Create a Supabase project for image storage

### Environment Variables for Vercel

Add these environment variables in your Vercel project settings:

- `DATABASE_URL`: Your PostgreSQL connection string
- `DIRECT_URL`: Your direct PostgreSQL connection string (same as DATABASE_URL for most providers)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### Deployment Steps

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and use the build configuration
3. The build process will:
   - Install dependencies
   - Generate Prisma client
   - Build the Next.js application

### Build Configuration

The project includes:
- `vercel.json`: Vercel-specific configuration
- Updated `package.json` scripts for Prisma generation
- Optimized Prisma client setup for serverless environments

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── properties/        # Property-related pages
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── lib/                   # Utility libraries (Prisma, Supabase)
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## API Routes

- `GET /api/properties` - Fetch all properties
- `POST /api/properties` - Create a new property
- `GET /api/properties/[id]` - Fetch a specific property
- `PUT /api/properties/[id]` - Update a property
- `DELETE /api/properties/[id]` - Delete a property
- `POST /api/upload` - Upload images to Supabase storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
