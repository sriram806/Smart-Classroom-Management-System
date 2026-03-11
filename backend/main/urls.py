from django.urls import path
from . import views

urlpatterns = [
    # Teachers
    path('teacher/', views.TeacherList.as_view(), name='teacher-list'),
    path('teacher/dashboard/<int:pk>/', views.TeacherDashboard.as_view()),
    path('teacher/<int:pk>/', views.TeacherDetail.as_view(), name='teacher-detail'),
    path('teacher-login/', views.teacher_login, name='teacher-login'),
    path('teacher-courses/<int:teacher_id>/courses/<int:course_id>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('teacher/update/<int:teacher_id>/', views.teacher_update, name='update_teacher'),
    path('teacher/change-password/<int:teacher_id>/', views.teacher_change_password, name='update_teacher'),

    
    # Chatbot
    path('chatbot-response/', views.chatbot_response, name='chatbot-response'),
    
    # Category Course
    path('category/', views.CategoryList.as_view(), name='CourseCategory-list'),
    path('category/<int:pk>/', views.CategoryDetail.as_view(), name='CourseCategory-detail'),
    
    # Courses
    path('course/', views.CourseList.as_view(), name='Course-list'),
    path('course/<int:pk>/', views.CourseDetailView.as_view(), name='Course-detail'),
    
    # Chapter Course
    path('chapter/', views.ChapterList.as_view(), name='Chapter-list'),
    path('chapter/<int:pk>/', views.ChapterDetailView.as_view(), name='Chapter-detail'),
    # Specific Chapter Course
    path('course-chapters/<int:course_id>', views.CourseChapterList.as_view(), name='CourseChapter-list'),
    
    # Teacher Courses
    path('teacher-courses/<int:teacher_id>', views.TeacherCourseList.as_view(), name='SpecificTeacherCourse'),
    path('teacher-course-detail/<int:pk>/', views.TeacherCourseDetail.as_view(), name='SpecificTeacherCourse-detail'),

    # Student
    path('student/', views.StudentView.as_view(), name='student-list'),
    path('student-login/', views.student_login, name='student-login'),
    path('student/<int:pk>/', views.StudentDetail.as_view()),
    path('student/update/<int:student_id>/', views.student_update, name='update_teacher'),
    path('student/change-password/<int:student_id>/', views.student_change_password, name='update_teacher'),
    
    path('student-enroll-course/', views.StudentEnrollCourseList.as_view(), name='student-enroll-course'),
    path('fetch-enroll-status/<int:student_id>/<int:course_id>/', views.fetch_enroll_status, name='fetch_enroll_status'),
    path('fetch-enrolled-students/<int:course_id>/', views.EnrolledStudentList.as_view()),
    path('fetch-enrolled-course/<int:student_id>/', views.EnrolledStudentList.as_view()),
    path('fetch-all-enrolled-students/<int:teacher_id>/', views.EnrolledStudentList.as_view()),
    path('course-rating/<int:course_id>', views.CourseRatingList.as_view()),
    path('fetch-rating-status/<int:student_id>/<int:course_id>/', views.fetch_rating_status, name='fetch_rating_status'),

    # Attendance
    path('course/<int:course_id>/attendance/students/', views.EnrolledStudentsForAttendanceView.as_view(), name='attendance-students-list'),
    path('course/<int:course_id>/attendance/submit/', views.submit_attendance, name='attendance-submit'),
    path('course/<int:course_id>/attendance/history/', views.CourseAttendanceHistoryView.as_view(), name='attendance-history'),
    path('student/<int:student_id>/attendance/', views.StudentAttendanceList.as_view(), name='student-attendance'),
    path('teacher/<int:teacher_id>/attendance/stats/', views.TeacherAttendanceStats.as_view(), name='teacher-attendance-stats'),
    path('course/<int:course_id>/attendance/stats/', views.CourseAttendanceStats.as_view(), name='course-attendance-stats'),
    path('course/<int:course_id>/attendance/export/', views.CourseAttendanceExport.as_view(), name='course-attendance-export'),

    # Timetable
    path('timetable/', views.TimetableListCreateView.as_view(), name='timetable-list-create'),
    path('timetable/<int:pk>/', views.TimetableDetailView.as_view(), name='timetable-detail'),

    # Special Days
    path('specialdays/', views.SpecialDayListView.as_view(), name='special-day-list'), 
    path('specialdays/<int:pk>/', views.TimetableDetailView.as_view(), name='timetable-detail'),
]