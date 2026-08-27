# Contributing to IEEE SREC Web Platform

Thank you for your interest in contributing to the **IEEE Student Branch SREC Web Ecosystem**! We welcome contributions from student branch members, developers, and open-source contributors.

---

## 🧭 Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure an inclusive, respectful, and collaborative environment.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+) or `bun` / `pnpm`
- **Git**: Latest version

### Getting Started

1. **Fork & Clone**
   ```bash
   git clone https://github.com/Surya-Narayanan-K-S/SRECIEEESB.git
   cd SRECIEEESB
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) (or the port specified in terminal) in your browser.

---

## 🌿 Git Branching Strategy

- `main`: Production-ready, stable codebase. Deploys directly to production via CI/CD.
- `feature/<feature-name>`: For new features and enhancements.
- `fix/<bug-name>`: For bug fixes and hotfixes.
- `chore/<task-name>`: For maintenance, refactoring, dependencies, and documentation updates.

### Branch Creation Example:
```bash
git checkout -b feature/society-events-filtering
```

---

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

- `feat:` A new feature for the user or system
- `fix:` A bug fix
- `docs:` Documentation changes only
- `style:` Formatting, missing semi-colons, whitespace fixes (no logic change)
- `refactor:` Code restructuring without changing external behavior
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance, build configs, package updates

**Example:**
```bash
git commit -m "feat: add PDF membership card preview generator"
```

---

## 🧪 Testing & Verification

Before submitting a Pull Request, verify that all automated quality checks pass:

```bash
# Run TypeScript Type Checker
npm run typecheck

# Run Linter
npm run lint

# Run Unit & Integration Tests
npm run test

# Run Production Build
npm run build
```

---

## 🚀 Submitting a Pull Request (PR)

1. Ensure your branch is rebased on the latest `main`.
2. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a Pull Request on GitHub using our [PR Template](.github/pull_request_template.md).
4. Fill in the description, link any relevant issues, and verify all checklist items.
5. A repository maintainer will review your code.

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
