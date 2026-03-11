# utils.py

import face_recognition
import numpy as np
from .models import Student

def mark_attendance_from_image(image_data, course_id, teacher_id):
    # Load image from the request
    from PIL import Image
    image = Image.open(image_data)
    image_np = np.array(image)
    
    # Use face recognition to detect faces
    face_locations = face_recognition.face_locations(image_np)
    
    # Assuming you have pre-stored facial encodings for students
    student_encodings = {student.id: student.face_encoding for student in Student.objects.all()}
    
    detected_students = []
    
    # Check each detected face
    for face_location in face_locations:
        encoding = face_recognition.face_encodings(image_np, [face_location])[0]
        
        # Compare the face encoding with stored encodings to identify students
        for student_id, stored_encoding in student_encodings.items():
            match = face_recognition.compare_faces([stored_encoding], encoding)
            if match[0]:
                student = Student.objects.get(id=student_id)
                detected_students.append(student)
    
    return detected_students
