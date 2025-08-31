#!/bin/bash

# Cricket Dashboard Setup Script
echo "🏏 Cricket Dashboard Setup"
echo "=========================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

echo "✓ Python 3 found"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    exit 1
fi

echo "✓ pip3 found"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Create start script
echo "🚀 Creating start script..."
cat > start_dashboard.sh << 'EOF'
#!/bin/bash

echo "🏏 Starting Cricket Dashboard Backend..."
echo "======================================="

cd backend
python3 app.py &
BACKEND_PID=$!

echo "Backend started with PID: $BACKEND_PID"
echo "📊 Dashboard available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"

# Wait for interrupt
trap "echo 'Stopping backend...'; kill $BACKEND_PID; exit" INT
wait $BACKEND_PID
EOF

chmod +x start_dashboard.sh

echo "✓ Setup completed successfully!"
echo ""
echo "🚀 To start the dashboard:"
echo "   ./start_dashboard.sh"
echo ""
echo "🌐 Then open: http://localhost:5000"
echo ""
echo "📝 Example Player IDs:"
echo "   253802 - Virat Kohli"
echo "   28081  - MS Dhoni"
echo "   35320  - Rohit Sharma"
