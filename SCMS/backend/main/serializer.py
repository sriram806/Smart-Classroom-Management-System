from rest_framework import serializers
from . import models

# Teacher Serializer
class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Teacher
        fields = ['id', 'full_name', 'password', 'email', 'qualification', 'mobile_no', 'skills','profile_img', 'teacher_courses', 'skill_list']
        depth = 0

    def __init__(self, *args, **kwargs):
        super(TeacherSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'GET':
            self.Meta.depth = 1

class TeacherDashboardSerializer(serializers.ModelSerializer):
    total_teacher_courses = serializers.ReadOnlyField()
    total_teacher_chapters = serializers.ReadOnlyField()
    total_teacher_students = serializers.ReadOnlyField()

    class Meta:
        model = models.Teacher
        fields = ['id', 'full_name', 'email', 'total_teacher_courses', 'total_teacher_chapters', 'total_teacher_students', 'skill_list']

# Course Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseCategory
        fields = ['id', 'title', 'description']

# Course Serializer
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Course
        fields = ['id', 'category', 'teacher', 'title', 'description', 'featured_img', 'techs', 'course_chapters', 'related_videos', 'tech_list', 'total_enrolled_students','course_rating']
        depth = 0

    def __init__(self, *args, **kwargs):
        super(CourseSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'GET':
            self.Meta.depth = 2

# Chapter Serializer
class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Chapter
        fields = ['id', 'course', 'title', 'description', 'video', 'remarks']

# Student Serializer
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Student
        fields = ['id', 'full_name', 'email', 'password', 'username', 'interested_categories']

# Student Course Enrollment Serializer
class StudentCourseEnrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudentCourseEnrollment
        fields = ['id', 'course', 'student', 'enrolled_time']
        depth = 0
    
    def __init__(self, *args, **kwargs):
        super(StudentCourseEnrollSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'GET':
            self.Meta.depth = 2

class StudentFavouriteCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudentFavouriteCourse
        fields = ['id', 'course', 'student', 'status']
        depth = 0
    
    def __init__(self, *args, **kwargs):
        super(StudentFavouriteCourseSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'GET':
            self.Meta.depth = 2
            
# Course Rating Serializer
class CourseRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseRating
        fields = ['id', 'course', 'student', 'rating', 'reviews', 'review_time']
        depth = 0
    
    def __init__(self, *args, **kwargs):
        super(CourseRatingSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'GET':
            self.Meta.depth = 1