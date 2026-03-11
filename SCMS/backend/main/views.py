from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.response import Response
from .serializer import TeacherSerializer,CategorySerializer,CourseSerializer,ChapterSerializer,StudentSerializer,StudentCourseEnrollSerializer,CourseRatingSerializer,TeacherDashboardSerializer,StudentFavouriteCourseSerializer
from . import models
import json
from rest_framework.decorators import api_view
from .chatbot import load_intents, get_response 
import logging
from rest_framework import status
from .utils import mark_attendance_from_image

logger = logging.getLogger(__name__)

# Teacher Views
class TeacherList(generics.ListCreateAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherSerializer

class TeacherDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherSerializer
    
class TeacherDashboard(generics.RetrieveAPIView):
    queryset=models.Teacher.objects.all()
    serializer_class=TeacherDashboardSerializer

@csrf_exempt
def teacher_login(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                teacherData = models.Teacher.objects.get(email=email, password=password)
                return JsonResponse({'bool': True, 'teacher_id': teacherData.id})
            except models.Teacher.DoesNotExist:
                return JsonResponse({'bool': False, 'error': 'Invalid credentials'})
        else:
            return JsonResponse({'bool': False, 'error': 'Missing email or password'})

    return JsonResponse({'bool': False, 'error': 'Invalid request method'})

# Category Courses Views
class CategoryList(generics.ListCreateAPIView):
    queryset = models.CourseCategory.objects.all()
    serializer_class = CategorySerializer
    
class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.CourseCategory.objects.all()
    serializer_class = CategorySerializer


# Course
class CourseList(generics.ListCreateAPIView):
    queryset = models.Course.objects.all()
    serializer_class = CourseSerializer

    def get_queryset(self):
        qs = super().get_queryset()

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

    
class CourseDetailView(generics.RetrieveAPIView ):
    queryset = models.Course.objects.all()
    serializer_class = CourseSerializer
    
    
#Specific Teacher Course
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
    
@csrf_exempt  
def student_login(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                studentData = models.Student.objects.get(email=email, password=password)
                return JsonResponse({'bool': True, 'student_id': studentData.id})
            except models.Student.DoesNotExist:
                return JsonResponse({'bool': False, 'error': 'Invalid credentials'})
        else:
            return JsonResponse({'bool': False, 'error': 'Missing email or password'})

    return JsonResponse({'bool': False, 'error': 'Invalid request method'})

# Student Course Enrollment Views
class StudentEnrollCourseList(generics.ListCreateAPIView):
    queryset = models.StudentCourseEnrollment.objects.all()
    serializer_class = StudentCourseEnrollSerializer
    
# Student Favourite Course List
class StudentFavouriteCourseList(generics.ListCreateAPIView):
    queryset = models.StudentFavouriteCourse.objects.all()
    serializer_class = StudentFavouriteCourseSerializer
    
 
def fetch_enroll_status(request, student_id, course_id):
    student = models.Student.objects.filter(id=student_id).first()
    course = models.Course.objects.filter(id=course_id).first()
    if not student or not course:
        return JsonResponse({'error': 'Student or Course not found'}, status=404)
    enroll_status = models.StudentCourseEnrollment.objects.filter(course=course, student=student).exists()
    return JsonResponse({'bool': enroll_status})  

def fetch_favourite_status(request, student_id, course_id):
    student = models.Student.objects.filter(id=student_id).first()
    course = models.Course.objects.filter(id=course_id).first()
    favouriteStatus=models.StudentFavouriteCourse.objects.filter(course=course,student=student).first()
    if favouriteStatus and favouriteStatus.status== True:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})

def remove_favourite_course(request, student_id, course_id):
    student = models.Student.objects.filter(id=student_id).first()
    course = models.Course.objects.filter(id=course_id).first()
    favouriteStatus=models.StudentFavouriteCourse.objects.filter(course=course,student=student).delete()
    if favouriteStatus and favouriteStatus.status== True:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})

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
    

@csrf_exempt  
def teacher_change_password(request, teacher_id):
    if request.method == 'POST':
        password = request.POST.get('password')
        try:
            teacherData = models.Teacher.objects.get(id=teacher_id)
            models.Teacher.objects.filter(id=teacher_id).update(password=password)
            return JsonResponse({'bool': True})
        except models.Teacher.DoesNotExist:
            return JsonResponse({'bool': False, 'error': 'Teacher not found.'})
        except Exception as e:
            return JsonResponse({'bool': False, 'error': str(e)})
    return JsonResponse({'bool': False, 'error': 'Invalid request method.'})

@csrf_exempt  
def student_change_password(request, student_id):
    if request.method == 'POST':
        password = request.POST.get('password')
        try:
            studentData = models.Student.objects.get(id=student_id)
            models.Student.objects.filter(id=student_id).update(password=password)
            return JsonResponse({'bool': True})
        except models.Teacher.DoesNotExist:
            return JsonResponse({'bool': False, 'error': 'Teacher not found.'})
        except Exception as e:
            return JsonResponse({'bool': False, 'error': str(e)})
    return JsonResponse({'bool': False, 'error': 'Invalid request method.'})



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
