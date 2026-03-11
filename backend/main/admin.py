from django.contrib import admin
from . import models

# Teacher Admin
@admin.register(models.Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'qualification', 'mobile_no')
    search_fields = ('full_name', 'email')

# Student Admin
@admin.register(models.Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'username', 'interested_categories')
    search_fields = ('full_name', 'email', 'username')
    list_filter = ('interested_categories',)
    
# Course Category Admin
@admin.register(models.CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')
    search_fields = ('title',)

# Course Admin
@admin.register(models.Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'teacher', 'total_enrolled_students')
    search_fields = ('title', 'teacher__full_name')
    list_filter = ('category', 'teacher')

# Chapter Admin
@admin.register(models.Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'description')
    search_fields = ('title', 'course__title')

# Special Day Admin
@admin.register(models.SpecialDay)
class SpecialDayAdmin(admin.ModelAdmin):
    list_display = ('name', 'day_type', 'date')
    search_fields = ('name',)
    list_filter = ('day_type',)

# Timetable Admin
@admin.register(models.Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('day', 'session_number', 'course', 'teacher')
    search_fields = ('course__title', 'teacher__full_name')
    list_filter = ('day', 'session_number')

# Student Course Enrollment Admin
@admin.register(models.StudentCourseEnrollment)
class StudentCourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('course', 'student', 'enrolled_time')
    search_fields = ('course__title', 'student__full_name')
    list_filter = ('course',)