# Contributing to GitHub Wrapped

First off, thank you for considering contributing to GitHub Wrapped! 🎉

## Table of Contents

- [Contributing to GitHub Wrapped](#contributing-to-github-wrapped)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [How Can I Contribute?](#how-can-i-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Features](#suggesting-features)
    - [Pull Requests](#pull-requests)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Style Guidelines](#style-guidelines)
    - [TypeScript](#typescript)
    - [React](#react)
    - [CSS/Tailwind](#csstailwind)
    - [Code Formatting](#code-formatting)
  - [Commit Messages](#commit-messages)
  - [Questions?](#questions)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs what actually happened
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node.js version)

### Suggesting Features

Feature suggestions are welcome! Please include:

- **Clear description** of the feature
- **Use case** explaining why this would be useful
- **Possible implementation** ideas (optional)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 20+ 
- npm or yarn
- GitHub OAuth App credentials

### Installation

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/gitwrapped.git
   cd gitwrapped
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your credentials:
   ```env
   GITHUB_ID=your_github_oauth_app_id
   GITHUB_SECRET=your_github_oauth_app_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

The project follows a standard Next.js App Router structure:

- `src/app`: Application routes and pages
  - `api/`: Backend API routes (Auth, GitHub stats)
  - `wrapped/`: The main "Wrapped" result page
- `src/components`: React components
  - `wrapped/`: Components specific to the Wrapped presentation (slides, charts)
  - `wrapped/story/`: Individual slide components for the Story Mode
- `src/lib`: Utility functions
  - `github.ts`: GitHub GraphQL API client and queries
  - `auth.ts`: NextAuth configuration
- `public`: Static assets

## Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces for props and data
- Avoid `any` type when possible

### React

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Keep consistent spacing and color schemes

### Code Formatting

This project uses ESLint and Prettier. Run before committing:

```bash
npm run lint
```

## Commit Messages

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add contribution streak animation
fix: resolve language chart color issue
docs: update README with setup instructions
```

## Questions?

Feel free to open an issue for any questions or concerns. We're happy to help!

---

Thank you for contributing! 🚀
