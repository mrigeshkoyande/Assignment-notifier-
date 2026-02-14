import cv2
import os
import time
import json
from datetime import datetime, timedelta
from flask import Flask, Response, jsonify, send_from_directory, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create a directory for captured images if it doesn't exist
CAPTURE_DIR = os.path.join(os.path.dirname(__file__), 'captured_images')
if not os.path.exists(CAPTURE_DIR):
    os.makedirs(CAPTURE_DIR)

# Directory for attendance data
ATTENDANCE_DIR = os.path.join(os.path.dirname(__file__), 'attendance_records')
if not os.path.exists(ATTENDANCE_DIR):
    os.makedirs(ATTENDANCE_DIR)

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

# Attendance Management Endpoints

@app.route('/api/attendance/save', methods=['POST'])
def save_attendance():
    """
    Save attendance record for a user
    Expects JSON: {
        "userId": "user_id",
        "userName": "user_name",
        "email": "user_email",
        "timestamp": "2024-02-13T10:30:00",
        "location": {"latitude": 28.6139, "longitude": 77.2090},
        "verified": true,
        "imageData": "data:image/jpeg;base64,..."
    }
    """
    try:
        import base64
        from flask import request
        
        data = request.get_json()
        
        if not data.get('userId'):
            return jsonify({"error": "userId is required"}), 400
        
        user_id = data['userId']
        user_dir = os.path.join(ATTENDANCE_DIR, user_id)
        
        if not os.path.exists(user_dir):
            os.makedirs(user_dir)
        
        # Handle image data if provided
        image_filename = None
        if data.get('imageData'):
            try:
                # Extract base64 data from data URL
                image_data = data['imageData']
                if ',' in image_data:
                    image_data = image_data.split(',')[1]
                
                # Decode and save image
                image_bytes = base64.b64decode(image_data)
                timestamp = int(time.time())
                image_filename = f"attendance_{timestamp}.jpg"
                image_path = os.path.join(user_dir, image_filename)
                
                with open(image_path, 'wb') as f:
                    f.write(image_bytes)
                    
            except Exception as e:
                print(f"Error saving image: {e}")
                image_filename = None
        
        # Create attendance record with timestamp as filename
        timestamp = int(time.time())
        record_filename = f"attendance_{timestamp}.json"
        record_path = os.path.join(user_dir, record_filename)
        
        record_data = {
            "userId": user_id,
            "userName": data.get("userName", ""),
            "email": data.get("email", ""),
            "timestamp": datetime.now().isoformat(),
            "location": data.get("location", {}),
            "verified": data.get("verified", True),
            "image": image_filename
        }
        
        with open(record_path, 'w') as f:
            json.dump(record_data, f, indent=2)
        
        return jsonify({
            "status": "success",
            "message": "Attendance record saved",
            "record_id": timestamp,
            "image_filename": image_filename
        }), 201
    
    except Exception as e:
        import traceback
        print(f"Error: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500
            "location": data.get("location", {}),
            "verified": data.get("verified", True),
            "image": data.get("image", "")
        }
        
        with open(record_path, 'w') as f:
            json.dump(record_data, f, indent=2)
        
        return jsonify({
            "status": "success",
            "message": "Attendance record saved",
            "record_id": timestamp
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/attendance/<user_id>', methods=['GET'])
def get_user_attendance(user_id):
    """
    Get all attendance records for a specific user
    Optional query params:
    - month: YYYY-MM (e.g., 2024-02)
    - limit: number of records to return
    """
    try:
        user_dir = os.path.join(ATTENDANCE_DIR, user_id)
        
        if not os.path.exists(user_dir):
            return jsonify({"status": "success", "records": []}), 200
        
        records = []
        
        for filename in os.listdir(user_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(user_dir, filename)
                
                try:
                    with open(filepath, 'r') as f:
                        record = json.load(f)
                        records.append(record)
                except:
                    continue
        
        # Sort by timestamp (newest first)
        records.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        # Apply limit if specified
        limit = request.args.get('limit', type=int)
        if limit:
            records = records[:limit]
        
        return jsonify({
            "status": "success",
            "user_id": user_id,
            "total_records": len(records),
            "records": records
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/attendance/<user_id>/stats', methods=['GET'])
def get_attendance_stats(user_id):
    """
    Get attendance statistics for a user
    Optional query params:
    - days: number of days to look back (default: 30)
    """
    try:
        user_dir = os.path.join(ATTENDANCE_DIR, user_id)
        days = request.args.get('days', default=30, type=int)
        
        if not os.path.exists(user_dir):
            return jsonify({
                "status": "success",
                "user_id": user_id,
                "total_days_marked": 0,
                "attendance_percentage": 0.0,
                "records": []
            }), 200
        
        records = []
        cutoff_date = datetime.now() - timedelta(days=days)
        
        for filename in os.listdir(user_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(user_dir, filename)
                
                try:
                    with open(filepath, 'r') as f:
                        record = json.load(f)
                        record_date = datetime.fromisoformat(record.get('timestamp', ''))
                        
                        if record_date >= cutoff_date:
                            records.append(record)
                except:
                    continue
        
        # Calculate unique dates marked
        unique_dates = set()
        for record in records:
            try:
                date_str = record['timestamp'].split('T')[0]
                unique_dates.add(date_str)
            except:
                pass
        
        attendance_percentage = (len(unique_dates) / days * 100) if days > 0 else 0
        
        return jsonify({
            "status": "success",
            "user_id": user_id,
            "period_days": days,
            "total_days_marked": len(unique_dates),
            "attendance_percentage": round(attendance_percentage, 2),
            "last_record": records[0] if records else None
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
