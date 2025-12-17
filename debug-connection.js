const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('Checking .env.local at:', envPath);

try {
    if (!fs.existsSync(envPath)) {
        console.error('.env.local file not found!');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    // Simple parse for OPENIDDICT_ISSUER
    const match = envContent.match(/^OPENIDDICT_ISSUER=(.*)$/m);

    if (match) {
        let issuer = match[1].trim();
        // Remove quotes if present
        if ((issuer.startsWith('"') && issuer.endsWith('"')) || (issuer.startsWith("'") && issuer.endsWith("'"))) {
            issuer = issuer.slice(1, -1);
        }

        console.log('Found ISSUER URL:', issuer);

        // Construct discovery URL
        const configUrl = issuer.replace(/\/$/, '') + '/.well-known/openid-configuration';
        console.log('Attempting to fetch:', configUrl);

        // Set a timeout to avoid hanging indefinitely
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        fetch(configUrl, { signal: controller.signal })
            .then(res => {
                console.log('Response Status:', res.status);
                console.log('Response Headers:', JSON.stringify([...res.headers]));
                return res.text();
            })
            .then(text => {
                console.log('Response Body Preview:', text.substring(0, 200));
                console.log('✅ Connection Successful!');
            })
            .catch(err => {
                console.error('❌ Fetch Error:', err.message);
                if (err.cause) console.error('Error Cause:', err.cause);
                if (err.name === 'AbortError') console.error('Request timed out');
            })
            .finally(() => clearTimeout(timeout));

    } else {
        console.log('OPENIDDICT_ISSUER not found in .env.local');
    }
} catch (e) {
    console.error('Error executing debug script:', e.message);
}
