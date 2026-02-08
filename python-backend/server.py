import cv2
from flask import Flask, Response, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
        # For simplicity in this demo, we'll just return a success message
        # In a real app, you might save the image or return it as base64
        # filename = 'capture.jpg'
        # cv2.imwrite(filename, frame) 
        return jsonify({"status": "success", "message": "Image captured successfully (not saved in this demo due to file system constraints on web)"})
    return jsonify({"status": "error", "message": "Failed to capture image"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
