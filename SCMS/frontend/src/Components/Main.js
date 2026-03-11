import { Routes, Route } from 'react-router-dom';

//Pages
import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import About from './About';
import CourseDetail from './CourseDetail';
import TeacherDetail from './TeacherDetail';
import AllCourses from './AllCourses';
import PopularCourses from './PopularCourses';
import PopularTeacher from './PopularTecaher';
import CategoryCourses from './CategoryCourses';
import Chatbot from './Chatbot';

//User Pannel
import ChangePassword from './User/ChangePassword'
import Dashboard from './User/Dashboard'
import FavouriteCourse from './User/FavouriteCourse'
import Login from './User/Login'
import StudentLogout from './User/StudentLogout'
import MyCourse from './User/MyCourse'
import ProfileSetting from './User/ProfileSetting'
import RecommandedCourses from './User/RecommandedCourses'
import Register from './User/Register'
import Sidebar from './User/Sidebar'

//Teacher Panel
import AddChapter from './Teacher/AddChapter';
import AddCourse from './Teacher/AddCourse';
import AllChapter from './Teacher/CourseChapter';
import EditChapter from './Teacher/EditChapter';
import EditCourse from './Teacher/EditCourse';
import TeacherChangePassword from './Teacher/TeacherChangePassword';
import TeacherCourses from './Teacher/TeacherCourses';
import TeacherDashboard from './Teacher/TeacherDashboard';
import TeacherLogin from './Teacher/TeacherLogin';
import TeacherLogout from './Teacher/TeacherLogout';
import TeacherProfileSetting from './Teacher/TeacherProfileSetting';
import TeacherRegister from './Teacher/TeacherRegister';
import TeacherSkillCourses from './Teacher/TeacherSkillCourses';
import TeacherSlidebar from './Teacher/TeacherSlidebar';
import TeacherUsers from './Teacher/TeacherUsers';
import EnrolledCourses from './Teacher/EnrolledCourses';

function Main() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/detail/:course_id' element={<CourseDetail />} />
                <Route path='/teacher-detail/:teacher_id' element={<TeacherDetail />} />
                <Route path='/all-courses' element={<AllCourses />} />
                <Route path='/popular-courses' element={<PopularCourses />} />
                <Route path='/popular-teachers' element={<PopularTeacher />} />
                <Route path='/category/:category_slug' element={<CategoryCourses />} />
                <Route path='/chatbot' element={<Chatbot />} />

                <Route path='/change-password' element={<ChangePassword />} />
                <Route path='/student-dashboard' element={<Dashboard />} />
                <Route path='/student-favouritecourse' element={<FavouriteCourse />} />
                <Route path='/student-login' element={<Login />} />
                <Route path='/my-courses' element={<MyCourse />} />
                <Route path='/profilesetting' element={<ProfileSetting />} />
                <Route path='/recommanded-courses' element={<RecommandedCourses />} />
                <Route path='/student-register' element={<Register />} />
                <Route path='/student-sidebar' element={<Sidebar />} />
                <Route path='/student-logout' element={<StudentLogout />} />
                
                <Route path='/add-chapter/:course_id' element={<AddChapter />} />
                <Route path='/add-course' element={<AddCourse />} />
                <Route path='/all-chapter/:course_id' element={<AllChapter />} />
                <Route path='/edit-chapter/:chapter_id' element={<EditChapter />} />
                <Route path='/edit-course/:course_id' element={<EditCourse />} />
                <Route path='/teacher-changepassword' element={<TeacherChangePassword />} />
                <Route path='/teacher-course' element={<TeacherCourses />} />
                <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
                <Route path='/teacher-login' element={<TeacherLogin />} />
                <Route path='/teacher-logout' element={<TeacherLogout />} />
                <Route path='/teacher-profilesetting' element={<TeacherProfileSetting />} />
                <Route path='/teacher-register' element={<TeacherRegister/>} />
                <Route path='/teacher-skill-courses/:skill_name/:teacher_id' element={<TeacherSkillCourses />} />
                <Route path='/teacher-slidebar' element={<TeacherSlidebar />} />
                <Route path='/teacher-user' element={<TeacherUsers/>} />
                <Route path='/enrolled-students/:course_id' element={<EnrolledCourses />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default Main;
