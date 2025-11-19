// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Student Registration
document.getElementById('registerBtn').addEventListener('click', function() {
    const name = document.getElementById('studentName').value;
    const department = document.getElementById('studentDepartment').value;
    const studentId = document.getElementById('studentId').value;
    
    if (!name || !studentId || studentId.length !== 6 || isNaN(studentId)) {
        alert('يرجى ملء جميع الحقول بشكل صحيح. رقم الطالب يجب أن يكون 6 أرقام.');
        return;
    }
    
    // Save student data to localStorage
    const studentData = {
        name: name,
        department: department,
        studentId: studentId,
        registrationDate: new Date().toLocaleDateString('ar-MA')
    };
    
    localStorage.setItem('makatieStudent', JSON.stringify(studentData));
    
    // Generate random grades with new system
    const courses = [
        {name: 'تعدال أتاي', professor: 'د. مبارك'},
        {name: 'لعب بلت وتورنيكه', professor: 'د. محمد لمين محمد يحي'},
        {name: 'هندسة لخريط', professor: 'د. مصطاف'},
        {name: 'فن لحليق', professor: 'د. مختار'},
        {name: 'تحليل الأنمي', professor: 'د. عثمان الخسيس'},
        {name: 'دراسات المسلسلات الأمريكية', professor: 'د. إسماعيل صغير'}
    ];
    
    const grades = [];
    let totalGrade = 0;
    
    courses.forEach(course => {
        const grade = Math.floor(Math.random() * 20) + 1; // 1-20
        totalGrade += grade;
        
        grades.push({ 
            course: course.name, 
            professor: course.professor,
            grade: grade
        });
    });
    
    const average = totalGrade / courses.length;
    
    localStorage.setItem('makatieGrades', JSON.stringify(grades));
    localStorage.setItem('makatieAverage', average.toFixed(2));
    
    // Show dashboard
    showDashboard();
});

// Show Dashboard
function showDashboard() {
    const studentData = JSON.parse(localStorage.getItem('makatieStudent'));
    const grades = JSON.parse(localStorage.getItem('makatieGrades'));
    const average = localStorage.getItem('makatieAverage');
    
    if (!studentData) return;
    
    // Hide registration form and show dashboard
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';
    
    // Display student info
    document.getElementById('displayName').textContent = studentData.name;
    document.getElementById('displayDepartment').textContent = `القسم: ${studentData.department}`;
    document.getElementById('displayId').textContent = `رقم الطالب: ${studentData.studentId}`;
    
    // Display average with evaluation
    let evaluation = '';
    const avgNum = parseFloat(average);
    
    if (avgNum >= 10 && avgNum <= 20) {
        evaluation = 'ناجح للأسف';
    } else if (avgNum >= 1 && avgNum <= 9) {
        evaluation = 'ما فيك أمل';
    } else {
        evaluation = 'ناجح';
    }
    
    document.getElementById('displayAverage').textContent = `المعدل العام: ${average}/20 - ${evaluation}`;
    document.getElementById('displayAverage').style.color = avgNum >= 10 ? '#28a745' : '#dc3545';
    
    // Display grades
    const gradesTableBody = document.getElementById('gradesTableBody');
    gradesTableBody.innerHTML = '';
    
    grades.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.course}</td>
            <td>${item.grade}/20</td>
            <td>${item.professor}</td>
        `;
        gradesTableBody.appendChild(row);
    });
}

// Check if student is already registered on page load
document.addEventListener('DOMContentLoaded', function() {
    const studentData = localStorage.getItem('makatieStudent');
    if (studentData) {
        showDashboard();
    }
    
    // Load reviews from localStorage
    loadReviews();
    
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.1)';
        }
    });
});

// New Registration
document.getElementById('newRegistrationBtn').addEventListener('click', function() {
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('studentName').value = '';
    document.getElementById('studentId').value = '';
});

// Download Certificate
document.getElementById('downloadCertificateBtn').addEventListener('click', function() {
    const studentData = JSON.parse(localStorage.getItem('makatieStudent'));
    if (!studentData) {
        alert('يرجى تسجيل الدخول أولاً');
        return;
    }
    
    generateCertificate(studentData.name, 'برنامج مكاطيع نعايل المتكامل', 'جميع الأساتذة');
});

// Download Student ID
document.getElementById('downloadIdBtn').addEventListener('click', function() {
    const studentData = JSON.parse(localStorage.getItem('makatieStudent'));
    if (!studentData) {
        alert('يرجى تسجيل الدخول أولاً');
        return;
    }
    
    generateStudentId(studentData);
});

// Submit Review
document.getElementById('submitReviewBtn').addEventListener('click', function() {
    const name = document.getElementById('reviewerName').value;
    const comment = document.getElementById('reviewComment').value;
    
    if (!name || !comment) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    // Save review to localStorage
    let reviews = JSON.parse(localStorage.getItem('makatieReviews')) || [];
    reviews.push({ 
        name, 
        comment, 
        date: new Date().toLocaleDateString('ar-MA'),
        rating: 5
    });
    localStorage.setItem('makatieReviews', JSON.stringify(reviews));
    
    alert('شكراً لك على تعليقك!');
    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewComment').value = '';
    
    // Reload reviews to show the new one
    loadReviews();
});

// Load Reviews from localStorage
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('makatieReviews')) || [];
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    
    // Clear existing user reviews
    document.querySelectorAll('.user-review').forEach(el => el.remove());
    
    // Add new reviews
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'glass-card testimonial-card user-review';
        reviewCard.innerHTML = `
            <div class="testimonial-header">
                <div class="testimonial-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="testimonial-author">
                    <h4>${review.name}</h4>
                    <div class="testimonial-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                    </div>
                </div>
            </div>
            <p>${review.comment}</p>
            <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">${review.date}</div>
        `;
        testimonialsContainer.appendChild(reviewCard);
    });
}

// Generate Certificate - Fixed PDF Issue
function generateCertificate(studentName, program, instructor) {
    const certificateContent = document.getElementById('certificateContent');
    const currentDate = new Date().toLocaleDateString('ar-MA');
    
    certificateContent.innerHTML = `
        <div class="certificate" id="certificateToPrint" style="background: #fafafa; border: 20px solid #1a3a6c; padding: 60px; text-align: center; font-family: 'Tajawal', serif; position: relative; max-width: 900px; margin: 0 auto; min-height: 600px;">
            <!-- Gold Border -->
            <div style="position: absolute; top: -8px; left: -8px; right: -8px; bottom: -8px; border: 8px solid #d4af37; pointer-events: none;"></div>
            
            <!-- Background Pattern -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\" viewBox=\"0 0 120 120\"><rect fill=\"none\" stroke=\"%231a3a6c\" stroke-width=\"0.5\" x=\"15\" y=\"15\" width=\"90\" height=\"90\"/></svg>'); opacity: 0.08; pointer-events: none;"></div>
            
            <!-- Header -->
            <div style="margin-bottom: 50px; border-bottom: 4px solid #d4af37; padding-bottom: 30px;">
                <div style="font-size: 3.5rem; font-weight: 900; color: #1a3a6c; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">كلية مكاطيع نعايل</div>
                <div style="font-size: 1.8rem; color: #666; margin-bottom: 15px; font-weight: 500;">Makatie' Naa'il College</div>
                <div style="font-size: 2.8rem; font-weight: 800; color: #1a3a6c; margin: 30px 0; text-decoration: underline; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">شهادة تقدير</div>
                <div style="font-size: 1.6rem; color: #666; font-weight: 500;">Certificate of Achievement</div>
            </div>
            
            <!-- Body -->
            <div style="margin: 60px 0; line-height: 2.2;">
                <div style="font-size: 1.8rem; margin-bottom: 40px; color: #555; font-weight: 500;">يُشهد بأن</div>
                <div style="font-size: 3rem; font-weight: 800; color: #1a3a6c; margin: 40px 0; text-decoration: underline; text-shadow: 1px 1px 3px rgba(0,0,0,0.1);">${studentName}</div>
                <div style="font-size: 1.7rem; line-height: 2; margin-bottom: 50px; color: #555;">
                    قد أتم بنجاح متطلبات برنامج <strong style="color: #1a3a6c;">${program}</strong><br>
                    وأظهر تفوقاً ملحوظاً والتزاماً بالمبادئ الأكاديمية<br>
                    وذلك في كلية مكاطيع نعايل
                </div>
                <div style="font-size: 2rem; font-weight: 800; color: #d4af37; margin: 40px 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">${program}</div>
            </div>
            
            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; margin-top: 80px; position: relative;">
                <div style="text-align: center; flex: 1;">
                    <div style="border-bottom: 3px solid #000; width: 250px; margin: 0 auto 15px; padding-bottom: 8px;"></div>
                    <div style="font-weight: 800; font-size: 1.4rem; margin-bottom: 8px;">د. محمد فال محمد سالم</div>
                    <div style="color: #666; font-size: 1.2rem;">عميد الكلية</div>
                </div>
                
                <div style="text-align: center; flex: 1;">
                    <div style="border-bottom: 3px solid #000; width: 250px; margin: 0 auto 15px; padding-bottom: 8px;"></div>
                    <div style="font-weight: 800; font-size: 1.4rem; margin-bottom: 8px;">${instructor}</div>
                    <div style="color: #666; font-size: 1.2rem;">المشرف الأكاديمي</div>
                </div>
            </div>
            
            <!-- Official Seal -->
            <div style="position: absolute; bottom: 60px; left: 60px; width: 140px; height: 140px; border: 4px solid #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: white; transform: rotate(-15deg); box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                <div style="text-align: center; font-weight: 800; color: #1a3a6c; font-size: 1.1rem; line-height: 1.4;">
                    ختم<br>كلية<br>مكاطيع<br>نعايل
                </div>
            </div>
            
            <!-- Date -->
            <div style="margin-top: 50px; font-size: 1.3rem; color: #666; font-weight: 500;">
                صدر في: ${currentDate}
            </div>
            
            <!-- Serial Number -->
            <div style="position: absolute; top: 40px; left: 40px; font-size: 1rem; color: #999;">
                الرقم التسلسلي: MNC-${Date.now().toString().slice(-8)}
            </div>
        </div>
    `;
    
    // Show certificate modal
    document.getElementById('certificateModal').style.display = 'block';
}

// Generate Student ID
function generateStudentId(studentData) {
    const idCardContent = document.getElementById('idCardContent');
    const issueDate = new Date().toLocaleDateString('ar-MA');
    const expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('ar-MA');
    
    idCardContent.innerHTML = `
        <div class="id-card" id="idCardToPrint" style="background: linear-gradient(135deg, #1a3a6c, #2d4fff); color: white; border-radius: 20px; padding: 30px; max-width: 450px; margin: 0 auto; position: relative; overflow: hidden; min-height: 300px;">
            <!-- Background Pattern -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"><circle fill=\"white\" opacity=\"0.1\" cx=\"40\" cy=\"40\" r=\"25\"/></svg>'); pointer-events: none;"></div>
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; position: relative; z-index: 1;">
                <div style="font-size: 2.2rem; font-weight: 900; margin-bottom: 8px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">كلية مكاطيع نعايل</div>
                <div style="font-size: 1.3rem; opacity: 0.9; margin-bottom: 5px; font-weight: 500;">بطاقة طالب</div>
                <div style="font-size: 1rem; opacity: 0.8;">نواكشوط، موريتانيا</div>
            </div>
            
            <!-- Body -->
            <div style="display: flex; gap: 25px; margin-bottom: 30px; position: relative; z-index: 1;">
                <!-- Photo -->
                <div style="width: 140px; height: 160px; background: linear-gradient(135deg, #d4af37, #f4d03f); border-radius: 15px; display: flex; align-items: center; justify-content: center; color: #1a3a6c; font-size: 3.5rem; flex-shrink: 0; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                    <i class="fas fa-user-graduate"></i>
                </div>
                
                <!-- Info -->
                <div style="flex: 1;">
                    <div style="font-size: 1.7rem; font-weight: 800; margin-bottom: 20px; border-bottom: 3px solid rgba(255,255,255,0.3); padding-bottom: 10px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">${studentData.name}</div>
                    
                    <div style="font-size: 1.1rem; line-height: 1.8;">
                        <div style="margin-bottom: 8px;"><strong>رقم الطالب:</strong> ${studentData.studentId}</div>
                        <div style="margin-bottom: 8px;"><strong>القسم:</strong> ${studentData.department}</div>
                        <div style="margin-bottom: 8px;"><strong>تاريخ التسجيل:</strong> ${studentData.registrationDate}</div>
                        <div style="margin-bottom: 8px;"><strong>تاريخ الإصدار:</strong> ${issueDate}</div>
                        <div style="margin-bottom: 8px;"><strong>تاريخ الانتهاء:</strong> ${expiryDate}</div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px; border-top: 3px solid rgba(255,255,255,0.3); position: relative; z-index: 1;">
                <div style="height: 35px; background: repeating-linear-gradient(90deg, white, white 3px, transparent 3px, transparent 6px); margin-bottom: 15px;"></div>
                <div style="font-size: 0.8rem; opacity: 0.8; line-height: 1.4;">
                    هذه البطاقة خاصة بكلية مكاطيع نعايل<br>
                    ولا يمكن استخدامها لأي غرض رسمي
                </div>
            </div>
            
            <!-- Watermark -->
            <div style="position: absolute; bottom: 15px; right: 15px; font-size: 1rem; opacity: 0.3; transform: rotate(-15deg); font-weight: 700;">
                MAKATIE-NAAIL
            </div>
        </div>
    `;
    
    // Show ID card modal
    document.getElementById('idCardModal').style.display = 'block';
}

// Program Enrollment
document.querySelectorAll('.enroll-program-btn').forEach(button => {
    button.addEventListener('click', function() {
        const program = this.getAttribute('data-program');
        const instructor = this.getAttribute('data-instructor');
        
        const studentData = JSON.parse(localStorage.getItem('makatieStudent'));
        if (!studentData) {
            alert('يرجى التسجيل في لوحة الطالب أولاً قبل الالتحاق بالبرامج');
            return;
        }
        
        generateCertificate(studentData.name, program, instructor);
    });
});

// Book Download - Fixed PDF Issue
document.querySelectorAll('.download-book-btn').forEach(button => {
    button.addEventListener('click', function() {
        const bookTitle = this.getAttribute('data-book');
        showLoadingSpinner();
        
        // Use setTimeout to ensure DOM is updated
        setTimeout(() => {
            downloadPdf(bookTitle, 'book');
        }, 500);
    });
});

// Lesson Download - Fixed PDF Issue
document.querySelectorAll('.download-lesson-btn').forEach(button => {
    button.addEventListener('click', function() {
        const courseName = this.getAttribute('data-course');
        showLoadingSpinner();
        
        setTimeout(() => {
            downloadPdf(courseName, 'lesson');
        }, 500);
    });
});

// Schedule Download - Fixed PDF Issue
document.getElementById('downloadScheduleBtn').addEventListener('click', function() {
    showLoadingSpinner();
    
    setTimeout(() => {
        downloadPdf('الجدول الدراسي', 'schedule');
    }, 500);
});

// Show Loading Spinner
function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

// Hide Loading Spinner
function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// Download PDF Function - Fixed Version
function downloadPdf(title, type) {
    let content = '';
    const filename = `${title.replace(/\s+/g, '_')}.pdf`;
    
    if (type === 'schedule') {
        content = `
            <div style="direction: rtl; font-family: 'Tajawal', sans-serif; padding: 40px; background: white;">
                <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1a3a6c; padding-bottom: 20px;">
                    <h1 style="font-size: 2.5rem; color: #1a3a6c; margin-bottom: 15px; font-weight: 900;">كلية مكاطيع نعايل</h1>
                    <div style="font-size: 1.5rem; color: #666; font-weight: 500;">الجدول الدراسي الأسبوعي</div>
                </div>
                <div style="margin: 30px 0;">
                    ${document.getElementById('scheduleTable').outerHTML}
                </div>
                <div style="margin-top: 50px; text-align: center; font-size: 1.1rem; color: #666; border-top: 2px solid #eee; padding-top: 20px;">
                    <p style="margin-bottom: 10px;">تم الإنشاء في: ${new Date().toLocaleDateString('ar-MA')}</p>
                    <p>جميع الحقوق محفوظة © 2025 كلية مكاطيع نعايل</p>
                </div>
            </div>
        `;
    } else if (type === 'lesson') {
        content = `
            <div style="direction: rtl; font-family: 'Tajawal', sans-serif; padding: 40px; background: white;">
                <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1a3a6c; padding-bottom: 20px;">
                    <h1 style="font-size: 2.5rem; color: #1a3a6c; margin-bottom: 15px; font-weight: 900;">${title}</h1>
                    <div style="font-size: 1.5rem; color: #666; font-weight: 500;">دروس وشروحات مادة ${title}</div>
                </div>
                <div style="margin-top: 30px; line-height: 1.8; font-size: 1.2rem;">
                    <div style="margin-bottom: 35px;">
                        <h2 style="font-size: 1.8rem; color: #1a3a6c; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; font-weight: 700;">المقدمة</h2>
                        <p style="text-align: justify;">مرحباً بكم في دورة ${title}. هذه المادة تهدف إلى تعليمك أساسيات ${title} بطريقة أكاديمية.</p>
                    </div>
                    <div style="margin-bottom: 35px;">
                        <h2 style="font-size: 1.8rem; color: #1a3a6c; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; font-weight: 700;">المفاهيم الأساسية</h2>
                        <p style="text-align: justify;">في هذا القسم سنتعرف على المفاهيم الأساسية لمادة ${title} وكيفية تطبيقها في الحياة اليومية.</p>
                        <ul style="margin-right: 30px; margin-top: 20px;">
                            <li style="margin-bottom: 10px;">المفهوم الأول: أساسيات ${title}</li>
                            <li style="margin-bottom: 10px;">المفهوم الثاني: تطبيقات عملية</li>
                            <li style="margin-bottom: 10px;">المفهوم الثالث: نصائح وتوجيهات</li>
                        </ul>
                    </div>
                    <div style="margin-bottom: 35px;">
                        <h2 style="font-size: 1.8rem; color: #1a3a6c; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; font-weight: 700;">التمارين العملية</h2>
                        <p style="text-align: justify;">هنا ستجد بعض التمارين العملية لتطبيق ما تعلمته في مادة ${title}.</p>
                    </div>
                </div>
                <div style="margin-top: 50px; text-align: center; font-size: 1.1rem; color: #666; border-top: 2px solid #eee; padding-top: 20px;">
                    <p style="margin-bottom: 10px;">تم الإنشاء في: ${new Date().toLocaleDateString('ar-MA')}</p>
                    <p>جميع الحقوق محفوظة © 2025 كلية مكاطيع نعايل</p>
                </div>
            </div>
        `;
    } else if (type === 'book') {
        content = `
            <div style="direction: rtl; font-family: 'Tajawal', sans-serif; padding: 40px; background: white;">
                <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1a3a6c; padding-bottom: 20px;">
                    <h1 style="font-size: 2.5rem; color: #1a3a6c; margin-bottom: 15px; font-weight: 900;">${title}</h1>
                    <div style="font-size: 1.5rem; color: #666; font-weight: 500;">مرجع أكاديمي من كلية مكاطيع نعايل</div>
                </div>
                <div style="margin-top: 30px; line-height: 1.8; font-size: 1.2rem;">
                    <div style="margin-bottom: 35px;">
                        <h2 style="font-size: 1.8rem; color: #1a3a6c; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; font-weight: 700;">مقدمة الكتاب</h2>
                        <p style="text-align: justify;">يسر كلية مكاطيع نعايل أن تقدم لكم كتاب "${title}" كجزء من سلسلة المراجع الأكاديمية الفريدة التي تقدمها الكلية.</p>
                    </div>
                    <div style="margin-bottom: 35px;">
                        <h2 style="font-size: 1.8rem; color: #1a3a6c; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; font-weight: 700;">فهرس المحتويات</h2>
                        <ol style="margin-right: 30px; margin-top: 20px;">
                            <li style="margin-bottom: 10px;">الباب الأول: الأساسيات النظرية</li>
                            <li style="margin-bottom: 10px;">الباب الثاني: التطبيقات العملية</li>
                            <li style="margin-bottom: 10px;">الباب الثالث: دراسات حالة</li>
                            <li style="margin-bottom: 10px;">الباب الرابع: خلاصة وتوصيات</li>
                        </ol>
                    </div>
                    <div style="margin-bottom: 35px;">
                        <h2 style="font-size: 1.8rem; color: #1a3a6c; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; font-weight: 700;">ملاحظة هامة</h2>
                        <p style="text-align: justify;">هذا الكتاب جزء من المنهج الأكاديمي لكلية مكاطيع نعايل.</p>
                    </div>
                </div>
                <div style="margin-top: 50px; text-align: center; font-size: 1.1rem; color: #666; border-top: 2px solid #eee; padding-top: 20px;">
                    <p style="margin-bottom: 10px;">تم الإنشاء في: ${new Date().toLocaleDateString('ar-MA')}</p>
                    <p>جميع الحقوق محفوظة © 2025 كلية مكاطيع نعايل</p>
                </div>
            </div>
        `;
    }
    
    // Create temporary element for PDF generation
    const element = document.createElement('div');
    element.innerHTML = content;
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);
    
    // Generate PDF with better options
    const options = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { 
            type: 'jpeg', 
            quality: 0.98 
        },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            width: element.scrollWidth,
            height: element.scrollHeight
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };
    
    // Generate and download PDF
    html2pdf().set(options).from(element).save().then(() => {
        // Remove temporary element
        document.body.removeChild(element);
        hideLoadingSpinner();
    }).catch(error => {
        console.error('PDF generation error:', error);
        hideLoadingSpinner();
        alert('حدث خطأ أثناء إنشاء الملف. يرجى المحاولة مرة أخرى.');
    });
}

// Modal Close Buttons
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Print Certificate
document.getElementById('printCertificateBtn').addEventListener('click', function() {
    const certificateElement = document.getElementById('certificateToPrint');
    if (!certificateElement) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>طباعة الشهادة</title>
                <style>
                    body { 
                        font-family: 'Tajawal', sans-serif; 
                        direction: rtl; 
                        margin: 0; 
                        padding: 20px; 
                        background: #f5f5f5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    @media print {
                        body { 
                            margin: 0; 
                            background: white;
                            padding: 0;
                        }
                        .certificate { 
                            border: 20px solid #1a3a6c !important;
                            box-shadow: none !important;
                            margin: 0;
                            page-break-after: always;
                        }
                    }
                </style>
            </head>
            <body>
                ${certificateElement.outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
});

// Print ID Card
document.getElementById('printIdCardBtn').addEventListener('click', function() {
    const idCardElement = document.getElementById('idCardToPrint');
    if (!idCardElement) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>طباعة بطاقة الطالب</title>
                <style>
                    body { 
                        font-family: 'Tajawal', sans-serif; 
                        direction: rtl; 
                        margin: 0; 
                        padding: 20px; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        min-height: 100vh; 
                        background: #f5f5f5;
                    }
                    @media print {
                        body { 
                            margin: 0; 
                            background: white;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                ${idCardElement.outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
});

// Download Certificate as PDF - Fixed
document.getElementById('downloadCertificatePdfBtn').addEventListener('click', function() {
    const certificateElement = document.getElementById('certificateToPrint');
    if (!certificateElement) return;
    
    showLoadingSpinner();
    
    const options = {
        margin: [10, 10, 10, 10],
        filename: 'شهادة_كلية_مكاطيع_نعايل.pdf',
        image: { 
            type: 'jpeg', 
            quality: 0.98 
        },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };
    
    html2pdf().set(options).from(certificateElement).save().then(() => {
        hideLoadingSpinner();
    }).catch(error => {
        console.error('Certificate PDF error:', error);
        hideLoadingSpinner();
        alert('حدث خطأ أثناء إنشاء الشهادة. يرجى المحاولة مرة أخرى.');
    });
});

// Download ID Card as PDF - Fixed
document.getElementById('downloadIdCardPdfBtn').addEventListener('click', function() {
    const idCardElement = document.getElementById('idCardToPrint');
    if (!idCardElement) return;
    
    showLoadingSpinner();
    
    const options = {
        margin: [10, 10, 10, 10],
        filename: 'بطاقة_طالب_كلية_مكاطيع_نعايل.pdf',
        image: { 
            type: 'jpeg', 
            quality: 0.98 
        },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };
    
    html2pdf().set(options).from(idCardElement).save().then(() => {
        hideLoadingSpinner();
    }).catch(error => {
        console.error('ID Card PDF error:', error);
        hideLoadingSpinner();
        alert('حدث خطأ أثناء إنشاء البطاقة. يرجى المحاولة مرة أخرى.');
    });
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const certificateModal = document.getElementById('certificateModal');
    const idCardModal = document.getElementById('idCardModal');
    
    if (event.target === certificateModal) {
        certificateModal.style.display = 'none';
    }
    
    if (event.target === idCardModal) {
        idCardModal.style.display = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all glass cards for animation
document.querySelectorAll('.glass-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe section titles for animation
document.querySelectorAll('.section-title').forEach(title => {
    title.style.opacity = '0';
    title.style.transform = 'translateY(30px)';
    title.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(title);
});