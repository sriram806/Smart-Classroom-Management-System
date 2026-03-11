from django.db import models
from django.core import serializers

# Teacher Model
class Teacher(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    qualification = models.CharField(max_length=200)
    mobile_no = models.CharField(max_length=20, null=True)
    profile_img = models.ImageField(upload_to='teacher_profile_imgs/', null=True)
    skills = models.TextField()

    class Meta:
        verbose_name_plural = "1. Teacher"
          
    def __str__(self):
        return self.full_name
    def skill_list(self):
        skill_list = self.skills.split(',')
        return skill_list
    def total_teacher_courses(self):
        total_courses = Course.objects.filter(teacher=self).count()
        return total_courses
    def total_teacher_chapters(self):
        total_chapters = Chapter.objects.filter(course__teacher=self).count()
        return total_chapters
    def total_teacher_students(self):
        total_students = StudentCourseEnrollment.objects.filter(course__teacher=self).count()
        return total_students
#------------------------------------------------------------------------------------------------------------------------------
# Student Model
class Student(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    roll_number = models.CharField(max_length=50, unique=True,null=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(max_length=20,default="default_username", unique=True)
    interested_categories = models.TextField()
    student_profile_img = models.ImageField(upload_to='student_profile_imgs/', null=True, blank=True)

    class Meta:
        verbose_name_plural = "2. Students"
        
    def __str__(self):
        return self.full_name 
#------------------------------------------------------------------------------------------------------------------------
# Course Category Model
class CourseCategory(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()

    class Meta:
        verbose_name_plural = "3. Course Category"
    
    def __str__(self):
        return self.title
#------------------------------------------------------------------------------------------------------------------------      
# Course Model
class Course(models.Model):
    category = models.ForeignKey(CourseCategory, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='teacher_courses')
    title = models.CharField(max_length=150)
    description = models.TextField()
    featured_img = models.ImageField(upload_to='course_img/', null=True)
    techs = models.TextField(null=True)
    total_enrolled_students = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "4. Course"
    
    def __str__(self):
        return self.title
    def related_videos(self):
        related_videos = Course.objects.filter(techs__icontains=self.techs)
        return serializers.serialize('json', related_videos)
    def tech_list(self):
        tech_list = self.techs.split(',')
        return tech_list
    def total_enrolled_students(self):
        total_enrolled_students = StudentCourseEnrollment.objects.filter(course=self).count()
        return total_enrolled_students
    def course_rating(self):
        course_rating = CourseRating.objects.filter(course=self).aggregate(avg_rating=models.Avg('rating'))
        return course_rating['avg_rating']
#------------------------------------------------------------------------------------------------------------------------------
# Chapter Model
class Chapter(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_chapters')
    title = models.CharField(max_length=150)
    description = models.TextField()
    video = models.FileField(upload_to='chapter_videos/', null=True)
    remarks = models.TextField(null=True)

    class Meta:
        verbose_name_plural = "5. Chapter"
    
    def __str__(self):
        return self.title
#------------------------------------------------------------------------------------------------------------------------------
# Special Day Class for Time Table
class SpecialDay(models.Model):
    SPECIAL_DAY_TYPES = [
        ('Holiday', 'Holiday'),
        ('Event', 'Event'),
    ]
    name = models.CharField(max_length=100)
    day_type = models.CharField(max_length=20, choices=SPECIAL_DAY_TYPES)
    date = models.DateField()

    class Meta:
        verbose_name_plural = "6. Special Days"
    
    def __str__(self):
        return f"{self.name} - {self.get_day_type_display()}"
#------------------------------------------------------------------------------------------------------------------------------
# Time Table Model
class Timetable(models.Model):
    DAYS_OF_WEEK = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
    ]
    SESSION_NUMBER = [
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
        (6, '6'),
    ]
    day = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    session_number = models.PositiveSmallIntegerField(choices=SESSION_NUMBER)
    course = models.ForeignKey('Course', on_delete=models.SET_NULL, null=True, blank=True)
    teacher = models.ForeignKey('Teacher', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name_plural = "7. Time Table"
        unique_together = ('day', 'session_number')
        
    def __str__(self):
        return f"{self.day} - Session {self.session_number}"
#------------------------------------------------------------------------------------------------------------------------------
# Student Course Enrollment Model
class StudentCourseEnrollment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrolled_courses')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrolled_students')
    enrolled_time = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "8. Enrolled Courses"
        unique_together = ('student', 'course')
    
    def __str__(self):
        return f"{self.course}-{self.student}"
#------------------------------------------------------------------------------------------------------------------------------
# Rating Model
class CourseRating(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    rating = models.PositiveBigIntegerField(default=0)
    reviews = models.TextField(null=True)
    review_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')
    
    def __str__(self):
        return f"{self.course}-{self.student}-{self.rating}"
#------------------------------------------------------------------------------------------------------------------------------
# Student Assginment Model
class StudentAssignment(models.Model):
    student=models.ForeignKey(Student, on_delete=models.CASCADE,null=True)
    title=models.CharField(max_length=200)
    detail=models.TextField(null=True)
    add_time=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title}"

#------------------------------------------------------------------------------------------------------------------------------
# Attendance Model
class Attendance(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('On Leave', 'On Leave'),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Present')
    remarks = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "9. Attendance"
        unique_together = ('student', 'course', 'date')

    def __str__(self):
        return f"{self.student.full_name} - {self.course.title} - {self.date} - {self.status}"
    