from django.db import models
from django.core import serializers
from datetime import datetime

# Teacher Model
class Teacher(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100, blank=True, null=True)
    qualification = models.CharField(max_length=200)
    mobile_no = models.CharField(max_length=20)
    profile_img = models.ImageField(upload_to='teacher_profile_imgs/', null=True)
    skills = models.TextField()

    class Meta:
        verbose_name_plural = "1. Teacher"
        
    def __str__(self):
        return self.full_name
    
    def skill_list(self):
        skill_list=self.skills.split(',')
        return skill_list
    
    def total_teacher_courses(self):
        total_courses=Course.objects.filter(teacher=self).count()
        return total_courses
    
    def total_teacher_chapters(self):
        total_chapters=Chapter.objects.filter(course__teacher=self).count()
        return total_chapters
    
    def total_teacher_students(self):
        total_students=StudentCourseEnrollment.objects.filter(course__teacher=self).count()
        return total_students


# Course Category Model
class CourseCategory(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()

    class Meta:
        verbose_name_plural = "2. Course Category"
        
    def __str__(self):
        return self.title    


# Course Model
class Course(models.Model):
    category = models.ForeignKey(CourseCategory, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='teacher_courses')
    title = models.CharField(max_length=150)
    description = models.TextField()
    featured_img = models.ImageField(upload_to='course_img/', null=True)
    techs = models.TextField(null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "3. Course"

    def related_videos(self):
        related_videos = Course.objects.filter(techs__icontains=self.techs)
        return serializers.serialize('json', related_videos)

    def tech_list(self):
        tech_list=self.techs.split(',')
        return tech_list
    
    def total_enrolled_students(self):
        total_enrolled_students=StudentCourseEnrollment.objects.filter(course=self).count()
        return total_enrolled_students
    def course_rating(self):
        course_rating=CourseRating.objects.filter(course=self).aggregate(avg_rating=models.Avg('rating'))
        return course_rating['avg_rating']
    
# Chapter Model
class Chapter(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE,related_name='course_chapters')
    title = models.CharField(max_length=150)
    description = models.TextField()
    video = models.FileField(upload_to='chapter_videos/', null=True)
    remarks = models.TextField(null=True)

    class Meta:
        verbose_name_plural = "5. Chapter"
        
    def __str__(self):
        return self.title


# Student Model
class Student(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(max_length=20, unique=True)
    interested_categories = models.TextField()
    profile_img = models.ImageField(upload_to='student_profile_imgs/', null=True, blank=True)

    class Meta:
        verbose_name_plural = "4. Students"
        
    def __str__(self):
        return self.full_name

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])

    def __str__(self):
        return f"{self.student.full_name} attended {self.course.title} on {self.date} at {self.time} - {self.status}"
    
    class Meta:
        verbose_name_plural = "9. Attendance"


#Student Course Enrollement
class StudentCourseEnrollment(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name='enrolled_courses')
    student=models.ForeignKey(Student,on_delete=models.CASCADE,related_name='enrolled_students')
    enrolled_time=models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "6. Enrolled Courses"
        
    def __str__(self):
        return f"{self.course}-{self.student}" 
    
#Student Favourite course
class StudentFavouriteCourse(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE)
    student=models.ForeignKey(Student,on_delete=models.CASCADE)
    status=models.BooleanField(default=False)
    
    class Meta:
        verbose_name_plural = "7. Favourite Courses"
        
    def __str__(self):
        return f"{self.course}-{self.student}" 
#Rating 
class CourseRating(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE)
    student=models.ForeignKey(Student,on_delete=models.CASCADE)
    rating=models.PositiveBigIntegerField(default=0)
    reviews=models.TextField(null=True)
    review_time=models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "8. Course Rating"
    
    def __str__(self):
        return f"{self.course}-{self.student}-{self.rating}" 