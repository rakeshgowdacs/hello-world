# 🚨 **Troubleshooting Guide - Space SMS Framework**

## 🚨 **Common Errors & Solutions**

### **❌ Error: "Your configFile threw an error from: cypress.config.js"**

#### **🔍 Problem Analysis**
This error typically occurs when:
1. **File system operations** fail during configuration loading
2. **Plugin initialization** fails
3. **Environment variables** are not loaded properly
4. **Dependencies** are missing or corrupted

#### **✅ Solution 1: Use Simple Configuration**
```bash
# Rename the simple config to use it
mv cypress.config.js cypress.config.js.backup
mv cypress.config.simple.js cypress.config.js

# Test Cypress
npx cypress verify
```

#### **✅ Solution 2: Fix Dependencies**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Verify Cypress
npx cypress verify
```

#### **✅ Solution 3: Check Environment Files**
```bash
# Create environment files if missing
echo "NODE_ENV=dev" > .env.dev
echo "BASE_URL=https://smsqa.service.dev/" >> .env.dev

# Test with environment
NODE_ENV=dev npx cypress verify
```

---

## 🔧 **Step-by-Step Fix**

### **🚀 Step 1: Quick Fix (Recommended)**
```bash
# 1. Use the simple configuration
mv cypress.config.js cypress.config.simple.js cypress.config.js

# 2. Test Cypress
npx cypress verify

# 3. Run a simple test
npm run cypress:run --spec "cypress/e2e/login/login.feature"
```

### **🚀 Step 2: Full Fix (If Simple Config Works)**
```bash
# 1. Restore the advanced configuration
mv cypress.config.js cypress.config.simple.js
mv cypress.config.js.backup cypress.config.js

# 2. Test again
npx cypress verify
```

### **🚀 Step 3: Dependency Fix (If Still Failing)**
```bash
# 1. Check Node.js version
node --version  # Should be 16+ or 18+ or 20+

# 2. Check npm version
npm --version   # Should be 8+ or 9+

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Test Cypress
npx cypress verify
```

---

## 🔍 **Diagnostic Commands**

### **📊 Check System Status**
```bash
# Check Node.js and npm
node --version
npm --version

# Check Cypress installation
npx cypress --version

# Check Allure installation
allure --version

# Check project structure
ls -la
ls -la cypress/
```

### **📦 Check Dependencies**
```bash
# Check installed packages
npm list --depth=0

# Check for missing dependencies
npm audit

# Check package.json
cat package.json
```

### **🔧 Check Configuration**
```bash
# Test Cypress configuration
npx cypress verify

# Check configuration file
cat cypress.config.js | head -20

# Check environment variables
echo "NODE_ENV: $NODE_ENV"
echo "BASE_URL: $BASE_URL"
```

---

## 🎯 **Configuration Options**

### **🚀 Option 1: Simple Configuration (Recommended for Troubleshooting)**
```javascript
// cypress.config.simple.js
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV || "dev"}` });

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || "https://smsqa.service.dev/",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents: async (on, config) => {
      await addCucumberPreprocessorPlugin(on, config);
      on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)]
      }));
      allureWriter(on, config);
      return config;
    }
  }
});
```

### **🚀 Option 2: Advanced Configuration (With Timestamped Reports)**
```javascript
// cypress.config.js (current)
// This includes timestamped directories and advanced features
```

---

## 🚨 **Emergency Fixes**

### **🚨 If Nothing Works: Minimal Configuration**
```bash
# Create minimal config
cat > cypress.config.js << 'EOF'
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://smsqa.service.dev/",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.js"
  }
});
EOF

# Test basic functionality
npx cypress verify
```

### **🚨 If Still Failing: Check System**
```bash
# Check disk space
df -h

# Check file permissions
ls -la cypress.config.js

# Check if in correct directory
pwd
ls -la
```

---

## 📋 **Troubleshooting Checklist**

- [ ] **Use simple configuration** first
- [ ] **Check Node.js version** (16+)
- [ ] **Check npm version** (8+)
- [ ] **Verify dependencies** are installed
- [ ] **Check environment files** exist
- [ ] **Test Cypress verification**
- [ ] **Check file permissions**
- [ ] **Verify project structure**

---

## 🎯 **Quick Recovery Steps**

1. **🚀 Use simple config**: `mv cypress.config.simple.js cypress.config.js`
2. **🧪 Test basic functionality**: `npx cypress verify`
3. **📊 Run simple test**: `npm run cypress:run`
4. **🔧 Fix dependencies** if needed: `npm install`
5. **🚀 Restore advanced config** once working

---

## 🎉 **Success Indicators**

- ✅ **`npx cypress verify`** passes without errors
- ✅ **`npm run cypress:open`** opens Cypress UI
- ✅ **`npm run cypress:run`** executes tests
- ✅ **No configuration errors** in console

---

## 🆘 **Still Having Issues?**

If you're still experiencing problems:

1. **Check the error message** carefully
2. **Use the simple configuration** first
3. **Verify all dependencies** are installed
4. **Check system requirements** (Node.js, npm)
5. **Try on a different machine** to isolate the issue

**Your framework will work once we resolve the configuration issue!** 🎯✨