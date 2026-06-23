import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function updateVersionJsonPlugin() {
  return {
    name: 'update-version-json',
    buildStart() {
      // 1. Get your version (e.g., generating a Git hash)
      const gitHash = execSync('git rev-parse --short HEAD').toString().trim();
      
      // 2. Define the path to your public/version.json
      const filePath = path.resolve(__dirname, 'public/version.json');
      
      // 3. Create the JSON content
      const content = JSON.stringify({ version: gitHash }, null, 2);
      
      // 4. Write it to the file
      fs.writeFileSync(filePath, content);
      console.log(`\n✏️ Updated public/version.json with version: ${gitHash}`);
    }
  };
}

const gitHash = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
  base: '/stuff/',
  plugins: [updateVersionJsonPlugin()],    
  define: {
    __APP_VERSION__: JSON.stringify(gitHash), 
  },
  build: {
    rollupOptions: {
      output: {
        // This controls the main entry point filename
        entryFileNames: 'assets/[name]-[hash].js',
        
        // This controls code-splitted chunks filenames
        chunkFileNames: 'assets/[name]-[hash].js',
        
        // (Optional) This controls CSS and asset filenames
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});