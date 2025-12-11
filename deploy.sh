#!/bin/bash

# -----------------------------
# React App Deployment Script
# -----------------------------

echo "=============================="
echo "   React App Deployment Tool  "
echo "=============================="

# Ask for target environment if not provided
target=$1
if [ -z "$target" ]; then
    echo "Please select the target environment:"
    select target in staging production; do
        if [ "$target" = "staging" ] || [ "$target" = "production" ]; then
            break
        else
            echo "Invalid option. Please select again."
        fi
    done
fi

# Confirm environment
echo "Deploying to: $target"

# Build React app
echo "---------------------------------"
echo "Building React app for $target..."
echo "---------------------------------"
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Exiting."
    exit 1
fi

# Compress the build folder
echo "---------------------------------"
echo "Compressing build folder..."
echo "---------------------------------"
zip -r build.zip build >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Failed to compress build folder."
    exit 1
fi

# Get credentials
echo -n "Enter remote username (default: vms): "
read username
username=${username:-vms}

echo "---------------------------------"
echo "Uploading build.zip to server..."
echo "---------------------------------"
read -s -p "Enter password for $username@172.26.234.148: " password
echo ""

# Ensure sshpass exists
if ! command -v sshpass &>/dev/null; then
    echo "Installing sshpass (requires sudo)..."
    sudo apt-get install -y sshpass
fi

# Upload to remote
sshpass -p "$password" scp -r build.zip $username@172.26.234.148:/var/${target}/frontend/
if [ $? -ne 0 ]; then
    echo "❌ File transfer failed."
    rm -f build.zip
    exit 1
fi

# SSH into server to extract & set permissions with sudo
echo "---------------------------------"
echo "Extracting and setting permissions..."
echo "---------------------------------"

sshpass -p "$password" ssh -t $username@172.26.234.148 <<EOF
cd /var/${target}/frontend/ || exit 1
unzip -o build.zip >/dev/null 2>&1
rm -rf build.zip
chown -R \$USER:\$USER build
find build -type d -exec chmod 755 {} \;
find build -type f -exec chmod 644 {} \;
echo "✅ Deployment to ${target} completed successfully!"
EOF

# Clean up local zip
rm -f build.zip

echo "---------------------------------"
echo "✅ React app deployed successfully to ${target}!"
echo "---------------------------------"
