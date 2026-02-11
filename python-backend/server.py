import cv2
import os
import time
from flask import Flask, Response, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create a directory for captured images if it doesn't exist
CAPTURE_DIR = os.path.join(os.path.dirname(__file__), 'captured_images')
if not os.path.exists(CAPTURE_DIR):
    os.makedirs(CAPTURE_DIR)

camera = cv2.VideoCapture(0)

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/capture')
def capture():
    success, frame = camera.read()
    if success:
        timestamp = int(time.time())
        filename = f'capture_{timestamp}.jpg'
        filepath = os.path.join(CAPTURE_DIR, filename)
        
        cv2.imwrite(filepath, frame)
        
        # Return the URL to access the captured image
        image_url = f'http://localhost:5000/captured/{filename}'
        return jsonify({
            "status": "success", 
            "message": "Image captured successfully",
            "image_url": image_url,
            "filename": filename
        })
    return jsonify({"status": "error", "message": "Failed to capture image"}), 500

@app.route('/captured/<filename>')
def uploaded_file(filename):
    return send_from_directory(CAPTURE_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
