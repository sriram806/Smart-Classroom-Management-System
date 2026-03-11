from rest_framework import serializers
from . import models

# Teacher Serializer
class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Teacher
        fields = ['id', 'full_name', 'email', 'password', 'qualification',
                  'mobile_no', 'profile_img', 'skills', 'teacher_courses', 'skill_list']
        depth = 0
        
    def validate_email(self, value):
        request = self.context.get('request')
        if request and request.method == 'POST':
            if models.Teacher.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email is already taken.")
        return value
    def __init__(self, *args, **kwargs):
        super(TeacherSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'GET':
            self.Meta.depth = 1
    
# Teacher Dashboard Serializer
class TeacherDashboardSerializer(serializers.ModelSerializer):
    total_teacher_courses = serializers.ReadOnlyField()
    total_teacher_chapters = serializers.ReadOnlyField()
    total_teacher_students = serializers.ReadOnlyField()
    class Meta:
        model = models.Teacher
        fields = ['id', 'full_name', 'email', 'total_teacher_courses', 'total_teacher_chapters', 
                  'total_teacher_students', 'skill_list']

# Course Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseCategory
        fields = ['id', 'title', 'description']

# Course Serializer
class CourseSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=models.CourseCategory.objects.all())
    teacher = serializers.PrimaryKeyRelatedField(queryset=models.Teacher.objects.all())
    class Meta:
        model = models.Course
        fields = ['id', 'category', 'teacher', 'title', 'description', 'featured_img', 'techs', 
                  'course_chapters', 'related_videos', 'tech_list', 'total_enrolled_students', 'course_rating']
        depth = 0
    
    def __init__(self, *args, **kwargs):
        super(CourseSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'GET':
            self.Meta.depth = 1

# Chapter Serializer
class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Chapter
        fields = ['id', 'course', 'title', 'description', 'video', 'remarks']

# Student Serializer (with facial recognition)
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Student
        fields = ['id', 'full_name', 'email', 'password', 'username', 'interested_categories','student_profile_img',
                  'roll_number']
        depth = 0

    def validate_username(self, value):
        request = self.context.get('request')
        if request and request.method == 'POST':
            if models.Student.objects.filter(username=value).exists():
                raise serializers.ValidationError("This Username is already taken.")
        return value
    def validate_email(self, value):
        request = self.context.get('request')
        if request and request.method == 'POST':
            if models.Student.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email is already taken.")
        return value
    def __init__(self, *args, **kwargs):
        super(StudentSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'GET':
            self.Meta.depth = 1 

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


# Special Day Serializer
class SpecialDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SpecialDay
        fields = ['id', 'name', 'day_type', 'date']


# Timetable Serializer
class TimetableSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)
    special_days = SpecialDaySerializer(read_only=True, many=True) 
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Course.objects.all(), source='course', write_only=True
    )
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Teacher.objects.all(), source='teacher', write_only=True
    )

    class Meta:
        model = models.Timetable
        fields = ['id', 'day', 'session_number', 'course', 'teacher', 'course_id', 'teacher_id', 'special_days']
        
    def __init__(self, *args, **kwargs):
        request = self.context.get('request')
        if request and request.method == 'GET':
            self.Meta.depth = 1

# Attendance Serializer
class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Attendance
        fields = ['id', 'student', 'course', 'date', 'status', 'remarks']
        depth = 0
    
    def __init__(self, *args, **kwargs):
        super(AttendanceSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'GET':
            self.Meta.depth = 1