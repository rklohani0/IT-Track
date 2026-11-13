"""
╔══════════════════════════════════════════════╗
║   IT TRACK — Computer Center Web Server     ║
║   Python HTTP Server                         ║
║   Run: python server.py                      ║
║   Visit: http://localhost:8000               ║
╚══════════════════════════════════════════════╝
"""

import http.server
import socketserver
import os
import json
import webbrowser
from datetime import datetime

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class ITTrackHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for IT Track website."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        """Handle contact form submissions."""
        if self.path == '/api/contact':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode('utf-8'))
                # Log the contact form submission
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                log_entry = f"[{timestamp}] New Contact: {data.get('name', 'N/A')} | {data.get('email', 'N/A')} | Course: {data.get('course', 'N/A')}\n"

                log_path = os.path.join(DIRECTORY, 'contacts.log')
                with open(log_path, 'a', encoding='utf-8') as f:
                    f.write(log_entry)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = json.dumps({'status': 'success', 'message': 'Thank you! We will contact you soon.'})
                self.wfile.write(response.encode('utf-8'))

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps({'status': 'error', 'message': str(e)})
                self.wfile.write(response.encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        """Custom log formatting."""
        print(f"  ✦ {self.address_string()} — {format % args}")


def main():
    print()
    print("  ╔══════════════════════════════════════════════╗")
    print("  ║                                              ║")
    print("  ║       🚀  IT TRACK — Computer Center         ║")
    print("  ║          Web Server Running                  ║")
    print("  ║                                              ║")
    print(f"  ║    🌐  http://localhost:{PORT}                  ║")
    print("  ║    📁  Serving from:", DIRECTORY[:22], "      ║")
    print("  ║                                              ║")
    print("  ║    Press Ctrl+C to stop                      ║")
    print("  ║                                              ║")
    print("  ╚══════════════════════════════════════════════╝")
    print()

    with socketserver.TCPServer(("", PORT), ITTrackHandler) as httpd:
        # Open browser automatically
        webbrowser.open(f"http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  👋 Server stopped. Goodbye!")
            httpd.shutdown()


if __name__ == "__main__":
    main()
