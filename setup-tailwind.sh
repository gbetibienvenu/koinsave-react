# 1) show whether the tailwind binary exists
echo "Checking for tailwind binary..."
ls -la node_modules/.bin | grep tailwindcss || true

# 2) try to run the installed binary (POSIX path for Git Bash)
echo "Attempting to run local tailwind binary..."
if ./node_modules/.bin/tailwindcss init -p 2>/dev/null; then
  echo "✅ tailwind initialized with CLI."
else
  echo "⚠️ CLI not available — creating config files manually..."

  # 3) create tailwind.config.cjs
  cat > tailwind.config.cjs <<'EOF'
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

  # 4) create postcss.config.cjs
  cat > postcss.config.cjs <<'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
EOF

  # 5) create src/index.css (Tailwind directives)
  mkdir -p src
  cat > src/index.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

  echo "✅ Config files created: tailwind.config.cjs, postcss.config.cjs, src/index.css"
  echo
  echo "Next: make sure your React entry imports the CSS (example below)."
fi

# 6) show helpful reminder what to add in your entry file
cat <<'MSG'

--- Reminders (do these if not already set) ---

1) In your React entry file (commonly src/main.jsx or src/main.js) add:
   import './index.css';

2) Ensure package.json has dev scripts (example):
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview"
   }

3) Start dev server:
   npm run dev

If the CLI worked above, you are ready. If we created files manually, running the dev server will still build Tailwind via PostCSS.

If you want, paste the output of the "ls -la node_modules/.bin | grep tailwindcss" command shown above — if the CLI exists we can try to run it directly. If something errors when you run `npm run dev`, paste that error and I’ll fix it.

MSG

