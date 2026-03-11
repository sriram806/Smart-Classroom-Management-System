from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics,serializers
from rest_framework.response import Response
from .serializers import TeacherSerializer,CategorySerializer,CourseSerializer,SpecialDaySerializer
from .serializers import ChapterSerializer,StudentSerializer,StudentCourseEnrollSerializer
from .serializers import CourseRatingSerializer,TeacherDashboardSerializer
from .serializers import TimetableSerializer
from . import models
import json
from rest_framework.decorators import api_view
from .chatbot import load_intents, get_response 
import logging
from rest_framework import status
import numpy as np
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from django.core.files.base import ContentFile
logger = logging.getLogger(__name__)

#------------------------------------------------------------------------------------------------------------------
# Teacher View
class TeacherList(generics.ListCreateAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherSerializer

class TeacherDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherSerializer
#------------------------------------------------------------------------------------------------------------------
# Teacher Dashboard   
class TeacherDashboard(generics.RetrieveAPIView):
    queryset=models.Teacher.objects.all()
    serializer_class=TeacherDashboardSerializer
#------------------------------------------------------------------------------------------------------------------
# Teacher and Student Login
@csrf_exempt
def teacher_login(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                teacherData = models.Teacher.objects.get(email=email,password=password)
                return JsonResponse({'bool': True, 'teacher_id': teacherData.id})
            except models.Teacher.DoesNotExist:
                return JsonResponse({'bool': False, 'error': 'Invalid credentials'})
        else:
            return JsonResponse({'bool': False, 'error': 'Missing email or password'})
        
    return JsonResponse({'bool': False, 'error': 'Something Error Please Try again later....'})
@csrf_exempt
def student_login(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                studentData = models.Student.objects.get(email=email,password=password)
                return JsonResponse({'bool': True, 'student_id': studentData.id})
            except models.Student.DoesNotExist:
                return JsonResponse({'bool': False, 'error': 'Invalid credentials'})
        else:
            return JsonResponse({'bool': False, 'error': 'Missing email or password'})

    return JsonResponse({'bool': False, 'error': 'Something Error Please Try again later....!'})
#------------------------------------------------------------------------------------------------------------------
# Category Courses Views
class CategoryList(generics.ListCreateAPIView):
    queryset = models.CourseCategory.objects.all()
    serializer_class = CategorySerializer
    
class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.CourseCategory.objects.all()
    serializer_class = CategorySerializer
#-------------------------------------------------Course View--------------------------------------------------------
class CourseList(generics.ListCreateAPIView):
    queryset = models.Course.objects.all()
    serializer_class = CourseSerializer

    def get_queryset(self):
        qs = super().get_queryset()

        # Apply filters based on query params
        if 'result' in self.request.GET:
            limit = int(self.request.GET['result'])
            qs = qs.order_by('-id')[:limit]

        if 'category' in self.request.GET:
            category = self.request.GET['category']
            qs = qs.filter(category__title__icontains=category)

        if 'skill_name' in self.request.GET and 'teacher' in self.request.GET:
            skill_name = self.request.GET['skill_name']
            teacher_id = self.request.GET['teacher']
            teacher = models.Teacher.objects.filter(id=teacher_id).first()
            qs = qs.filter(techs__icontains=skill_name, teacher=teacher)

        return qs

    def perform_create(self, serializer):
        teacher_id = self.request.data.get('teacher')

        if teacher_id:
            try:
                teacher = models.Teacher.objects.get(id=teacher_id)
                serializer.save(teacher=teacher)
            except models.Teacher.DoesNotExist:
                raise serializers.ValidationError("Teacher not found with the provided ID.")
        else:
            raise serializers.ValidationError("Teacher ID is required.")

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Course.objects.all()
    serializer_class = CourseSerializer

    def perform_update(self, serializer):
        teacher_id = self.request.data.get('teacher')

        if teacher_id:
            try:
                teacher = models.Teacher.objects.get(id=teacher_id)
                serializer.save(teacher=teacher)
            except models.Teacher.DoesNotExist:
                raise serializers.ValidationError("Teacher not found with the provided ID.")
        else:
            raise serializers.ValidationError("Teacher ID is required.")
    
#----------------------------------------------Specific Teacher Course-----------------------------------------------
class TeacherCourseList(generics.ListCreateAPIView):
    serializer_class=CourseSerializer
    
    def get_queryset(self):
        teacher_id=self.kwargs['teacher_id']
        teacher=models.Teacher.objects.get(pk=teacher_id)
        return models.Course.objects.filter(teacher=teacher)
    
class TeacherCourseDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Course.objects.all()
    serializer_class=CourseSerializer
    
    
# Chapter  Views
class ChapterList(generics.ListCreateAPIView):
    queryset = models.Chapter.objects.all()
    serializer_class = ChapterSerializer
    
class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Chapter.objects.all()
    serializer_class = ChapterSerializer
    
# Specific Chapter Course View
class CourseChapterList(generics.ListAPIView):
    serializer_class=ChapterSerializer
    
    def get_queryset(self):
        course_id=self.kwargs['course_id']
        course=models.Course.objects.get(pk=course_id)
        return models.Chapter.objects.filter(course=course)
    
#Student View 
class StudentView(generics.ListCreateAPIView):
    queryset = models.Student.objects.all()
    serializer_class = StudentSerializer
    
class StudentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Student.objects.all()
    serializer_class = StudentSerializer
#------------------------------------------------Student Course Enrollment Views--------------------------------------

class StudentEnrollCourseList(generics.ListCreateAPIView):
    queryset = models.StudentCourseEnrollment.objects.all()
    serializer_class = StudentCourseEnrollSerializer
    
#-----------------------------------------------Student Favourite Course List---------------------------------------   
def fetch_enroll_status(request, student_id, course_id):
    student = models.Student.objects.filter(id=student_id).first()
    course = models.Course.objects.filter(id=course_id).first()
    if not student or not course:
        return JsonResponse({'error': 'Student or Course not found'}, status=404)
    enroll_status = models.StudentCourseEnrollment.objects.filter(course=course, student=student).exists()
    return JsonResponse({'bool': enroll_status})    
#---------------------------------------------------Enrolled Students List View----------------------------------------------

class EnrolledStudentList(generics.ListAPIView):
    serializer_class = StudentCourseEnrollSerializer

    def get_queryset(self):
        queryset = models.StudentCourseEnrollment.objects.none()
        
        if 'course_id' in self.kwargs:
            course_id = self.kwargs['course_id']
            try:
                course = models.Course.objects.get(pk=course_id)
                queryset = models.StudentCourseEnrollment.objects.filter(course=course)
            except models.Course.DoesNotExist:
                return queryset 

        elif 'teacher_id' in self.kwargs:  
            teacher_id = self.kwargs['teacher_id']
            try:
                teacher = models.Teacher.objects.get(pk=teacher_id)  
                queryset = models.StudentCourseEnrollment.objects.filter(course__teacher=teacher).distinct()
            except models.Teacher.DoesNotExist:
                return queryset  
        
        elif 'student_id' in self.kwargs:  
            student_id = self.kwargs['student_id']
            try:
                student = models.Student.objects.get(pk=student_id)  
                queryset = models.StudentCourseEnrollment.objects.filter(student=student).distinct()
            except models.Student.DoesNotExist:
                return queryset 
        
        elif 'studentId' in self.kwargs:  
            student_id = self.kwargs['studentId']  
            try:
                student = models.Student.objects.get(pk=student_id)  
                queryset = models.Course.objects.filter(techs__in=student.interested_categories)
            except models.Student.DoesNotExist:
                return queryset 

        return queryset

#----------------------------------------------Course Rating Views--------------------------------------------------
 
class CourseRatingList(generics.ListCreateAPIView):
    queryset = models.CourseRating.objects.all()
    serializer_class = CourseRatingSerializer
    
    def get_queryset(self):
        course_id = self.kwargs['course_id']
        course = models.Course.objects.get(pk=course_id)
        return models.CourseRating.objects.filter(course=course)
    
def fetch_rating_status(request, student_id, course_id):
    student = models.Student.objects.filter(id=student_id).first()
    course = models.Course.objects.filter(id=course_id).first()
    ratingStatus=models.CourseRating.objects.filter(course=course,student=student).count()
    if ratingStatus:
        return  JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})
    

#---------------------------------------------Teacher Profile Update-----------------------------------------------  
@api_view(['GET', 'PUT'])
def teacher_update(request, teacher_id):
    try:
        teacher = models.Teacher.objects.get(id=teacher_id)

        if request.method == 'GET':
            serializer = TeacherSerializer(teacher)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            serializer = TeacherSerializer(teacher, data=request.data, partial=True) 
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except models.Teacher.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt  
def teacher_change_password(request, teacher_id):
    if request.method == 'POST':
        password = request.POST.get('password')
        try:
            teacher_Data = models.Teacher.objects.get(id=teacher_id)
            models.Teacher.objects.filter(id=teacher_id).update(password=password)
            return JsonResponse({'bool': True})
        except models.Teacher.DoesNotExist:
            return JsonResponse({'bool': False, 'error': 'Teacher not found.'})
        except Exception as e:
            return JsonResponse({'bool': False, 'error': str(e)})
    return JsonResponse({'bool': False, 'error': 'Invalid request method.'})
#---------------------------------------------Teacher Profile Update-----------------------------------------------  
@api_view(['GET', 'PUT'])
def student_update(request, student_id):
    try:
        student = models.Student.objects.get(id=student_id)

        if request.method == 'GET':
            serializer = StudentSerializer(student)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            serializer = StudentSerializer(student, data=request.data, partial=True) 
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except models.Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
    
@csrf_exempt  
def student_change_password(request, student_id):
    if request.method == 'POST':
        password = request.POST.get('password')
        try:
            student_Data = models.Student.objects.get(id=student_id)
            models.Student.objects.filter(id=student_id).update(password=password)
            return JsonResponse({'bool': True})
        except models.Student.DoesNotExist:
            return JsonResponse({'bool': False, 'error': 'Student not found.'})
        except Exception as e:
            return JsonResponse({'bool': False, 'error': str(e)})
    return JsonResponse({'bool': False, 'error': 'Invalid request method.'})
#------------------------------------------------CHATBOT VIEWS-------------------------------------------------------
@api_view(['POST'])
def chatbot_response(request):
    try:
        user_message = request.data.get('message', '')
        if not user_message:
            return Response({'error': 'No message provided'}, status=status.HTTP_400_BAD_REQUEST)

        intents = load_intents()
        response_message = get_response(user_message, intents)
        
        return Response({'response': response_message}, status=status.HTTP_200_OK)

    except FileNotFoundError:
        logger.error("chatbot_data.json not found.")
        return Response({'error': 'Chatbot data file not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except json.JSONDecodeError:
        logger.error("Invalid JSON format in chatbot_data.json.")
        return Response({'error': 'Invalid JSON format in chatbot data file'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#-------------------------------------------------------SPECIAL DAYS VIEWS-----------------------------------------

class SpecialDayListView(generics.ListCreateAPIView):
    queryset = models.SpecialDay.objects.all()
    serializer_class = SpecialDaySerializer
    
class SpecialDayDetailView(generics.ListCreateAPIView):
    queryset = models.SpecialDay.objects.all()
    serializer_class = SpecialDaySerializer
    
#----------------------------------------------------------TIMETABLE VIEWS----------------------------------------     
   
class TimetableListCreateView(generics.ListCreateAPIView):
    queryset = models.Timetable.objects.all()
    serializer_class = TimetableSerializer
               
class TimetableDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Timetable.objects.all()
    serializer_class = TimetableSerializer

#----------------------------------------------------------ATTENDANCE VIEWS---------------------------------------

class EnrolledStudentsForAttendanceView(generics.ListAPIView):
    serializer_class = StudentSerializer

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        try:
            course = models.Course.objects.get(pk=course_id)
            enrollments = models.StudentCourseEnrollment.objects.filter(course=course)
            student_ids = [enrollment.student.id for enrollment in enrollments]
            return models.Student.objects.filter(id__in=student_ids)
        except models.Course.DoesNotExist:
            return models.Student.objects.none()

@api_view(['POST'])
def submit_attendance(request, course_id):
    try:
        course = models.Course.objects.get(pk=course_id)
        data = request.data
        date_str = data.get('date')
        attendance_records = data.get('attendanceData', []) # Array of {student_id, status, remarks}

        if not date_str or not attendance_records:
            return Response({"error": "Date and attendanceData are required."}, status=status.HTTP_400_BAD_REQUEST)
            
        attendance_date = datetime.strptime(date_str, '%Y-%m-%d').date()

        for record in attendance_records:
            student_id = record.get('student_id')
            status_val = record.get('status', 'Present')
            remarks_val = record.get('remarks', '')
            
            student = models.Student.objects.get(pk=student_id)
            
            models.Attendance.objects.update_or_create(
                student=student,
                course=course,
                date=attendance_date,
                defaults={'status': status_val, 'remarks': remarks_val}
            )

        return Response({"message": "Attendance submitted successfully"}, status=status.HTTP_200_OK)

    except models.Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
    except models.Student.DoesNotExist:
        return Response({"error": "One or more students not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CourseAttendanceHistoryView(generics.ListAPIView):
    from .serializers import AttendanceSerializer
    serializer_class = AttendanceSerializer
    
    def get_queryset(self):
        course_id = self.kwargs['course_id']
        date_str = self.request.query_params.get('date')
        
        try:
            course = models.Course.objects.get(pk=course_id)
            queryset = models.Attendance.objects.filter(course=course)
            
            if date_str:
                history_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                queryset = queryset.filter(date=history_date)
                
            return queryset
        except models.Course.DoesNotExist:
            return models.Attendance.objects.none()
        except ValueError:
             return models.Attendance.objects.none() # Invalid date format

class StudentAttendanceList(generics.ListAPIView):
    from .serializers import AttendanceSerializer
    serializer_class = AttendanceSerializer
    
    def get_queryset(self):
        student_id = self.kwargs['student_id']
        try:
             student = models.Student.objects.get(pk=student_id)
             return models.Attendance.objects.filter(student=student).order_by('-date')
        except models.Student.DoesNotExist:
             return models.Attendance.objects.none()

class TeacherAttendanceStats(APIView):
    def get(self, request, teacher_id):
        try:
            teacher = models.Teacher.objects.get(pk=teacher_id)
            courses = models.Course.objects.filter(teacher=teacher)
            stats = []
            for course in courses:
                total_classes = models.Attendance.objects.filter(course=course).values('date').distinct().count()
                total_students = models.StudentCourseEnrollment.objects.filter(course=course).count()
                
                if total_classes > 0 and total_students > 0:
                    present_count = models.Attendance.objects.filter(course=course, status='Present').count()
                    total_records = models.Attendance.objects.filter(course=course).count()
                    avg_attendance = (present_count / total_records * 100) if total_records > 0 else 0
                else:
                    avg_attendance = 0
                    
                stats.append({
                    'course_id': course.id,
                    'course_title': course.title,
                    'total_classes': total_classes,
                    'total_students': total_students,
                    'avg_attendance_percentage': round(avg_attendance, 2)
                })
            return Response(stats, status=status.HTTP_200_OK)
        except models.Teacher.DoesNotExist:
            return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)

class CourseAttendanceStats(APIView):
    def get(self, request, course_id):
        try:
            course = models.Course.objects.get(pk=course_id)
            total_classes = models.Attendance.objects.filter(course=course).values('date').distinct().count()
            total_students_enrolled = models.StudentCourseEnrollment.objects.filter(course=course).count()
            
            present_count = models.Attendance.objects.filter(course=course, status='Present').count()
            total_records = models.Attendance.objects.filter(course=course).count()
            avg_attendance_percentage = (present_count / total_records * 100) if total_records > 0 else 0
            
            enrollments = models.StudentCourseEnrollment.objects.filter(course=course)
            student_stats = []
            for enrollment in enrollments:
                student = enrollment.student
                student_records = models.Attendance.objects.filter(course=course, student=student)
                student_present = student_records.filter(status='Present').count()
                student_total = student_records.count()
                student_percentage = (student_present / student_total * 100) if student_total > 0 else 0
                
                student_stats.append({
                    'student_id': student.id,
                    'roll_number': student.roll_number,
                    'full_name': student.full_name,
                    'classes_attended': student_present,
                    'total_classes_marked': student_total,
                    'attendance_percentage': round(student_percentage, 2)
                })
                
            return Response({
                'course_info': {
                    'id': course.id,
                    'title': course.title,
                    'total_classes_conducted': total_classes,
                    'total_students_enrolled': total_students_enrolled,
                    'overall_attendance_percentage': round(avg_attendance_percentage, 2)
                },
                'student_stats': student_stats
            }, status=status.HTTP_200_OK)
            
        except models.Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

import csv
from django.http import HttpResponse

class CourseAttendanceExport(APIView):
    def get(self, request, course_id):
        try:
            course = models.Course.objects.get(pk=course_id)
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')
            
            queryset = models.Attendance.objects.filter(course=course)
            if start_date:
                queryset = queryset.filter(date__gte=start_date)
            if end_date:
                queryset = queryset.filter(date__lte=end_date)
                
            queryset = queryset.order_by('date', 'student__roll_number')

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="attendance_{course.id}.csv"'

            writer = csv.writer(response)
            writer.writerow(['Date', 'Student Name', 'Roll Number', 'Status', 'Remarks'])

            for record in queryset:
                writer.writerow([
                    record.date,
                    record.student.full_name,
                    record.student.roll_number,
                    record.status,
                    record.remarks if record.remarks else ''
                ])

            return response
        except models.Course.DoesNotExist:
             return HttpResponse("Course not found", status=404)
