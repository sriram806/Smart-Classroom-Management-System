import face_recognition
import cv2
from .models import Student, Attendance
from django.utils import timezone

def load_known_faces():
    known_students = Student.objects.all()
    known_faces = []
    for student in known_students:
        image = face_recognition.load_image_file(student.profile_img.path)
        encoding = face_recognition.face_encodings(image)
        if encoding:
            known_faces.append({
                'student': student,
                'encoding': encoding[0]  # Take the first encoding found in the image
            })
    return known_faces

def mark_attendance_from_image(student_image_path, course):
    """
    Marks attendance for students by comparing the face in the image to the registered faces
    in the system.
    """
    known_faces = load_known_faces()

    # Read image for face recognition
    test_image = face_recognition.load_image_file(student_image_path)
    test_encodings = face_recognition.face_encodings(test_image)

    # Loop through each face detected in the test image
    for test_encoding in test_encodings:
        matches = face_recognition.compare_faces([face['encoding'] for face in known_faces], test_encoding)

        if True in matches:
            first_match_index = matches.index(True)
            student = known_faces[first_match_index]['student']

            # Mark attendance for the student in the specific course
            attendance = Attendance.objects.create(
                student=student,
                course=course,
                status=True,  # Marked as present
                date=timezone.now().date()
            )
            attendance.save()

    return "Attendance marked successfully"
