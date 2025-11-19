// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
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
    
    localStorage.setItem('maktouaStudent', JSON.stringify(studentData));
    
    // Generate random grades
    const courses = [
        {name: 'تعدال أتاي', professor: 'د. مبارك سيدي'},
        {name: 'مرياس', professor: 'د. محمد لمين محمد يحي'},
        {name: 'الأمن الغذائي', professor: 'د. شومير مصطفى ولد عيسى'},
        {name: 'لحليق', professor: 'د. المختار'},
        {name: 'الأنمي', professor: 'د. عثمان الخسيس'},
        {name: 'المسلسلات', professor: 'إسماعيل صغير'}
    ];
    
    const grades = [];
    courses.forEach(course => {
        const grade = Math.floor(Math.random() * 21); // 0-20
        let evaluation = '';
        
        if (grade <= 5) evaluation = 'حمار أكاديمي';
        else if (grade <= 10) evaluation = 'فاشل تمامًا';
        else if (grade <= 12) evaluation = 'ناجح بالصدفة';
        else if (grade <= 15) evaluation = 'كسول ولكن ذكي';
        else if (grade <= 18) evaluation = 'متفوق وساخر';
        else evaluation = 'ممتاز لكن بلا مستقبل';
        
        grades.push({ 
            course: course.name, 
            professor: course.professor,
            grade, 
            evaluation 
        });
    });
    
    localStorage.setItem('maktouaGrades', JSON.stringify(grades));
    
    // Show dashboard
    showDashboard();
});

// Show Dashboard
function showDashboard() {
    const studentData = JSON.parse(localStorage.getItem('maktouaStudent'));
    const grades = JSON.parse(localStorage.getItem('maktouaGrades'));
    
    if (!studentData) return;
    
    // Hide registration form and show dashboard
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';
    
    // Display student info
    document.getElementById('displayName').textContent = studentData.name;
    document.getElementById('displayDepartment').textContent = `القسم: ${studentData.department}`;
    document.getElementById('displayId').textContent = `رقم الطالب: ${studentData.studentId}`;
    
    // Display grades
    const gradesTableBody = document.getElementById('gradesTableBody');
    gradesTableBody.innerHTML = '';
    
    grades.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.course}</td>
            <td>${item.grade}/20</td>
            <td>${item.evaluation}</td>
        `;
        gradesTableBody.appendChild(row);
    });
}

// Check if student is already registered on page load
document.addEventListener('DOMContentLoaded', function() {
    const studentData = localStorage.getItem('maktouaStudent');
    if (studentData) {
        showDashboard();
    }
    
    // Load reviews from localStorage
    loadReviews();
});

// New Registration
document.getElementById('newRegistrationBtn').addEventListener('click', function() {
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('dashboardContent').style.display = 'none';
});

// Download Certificate
document.getElementById('downloadCertificateBtn').addEventListener('click', function() {
    const studentData = JSON.parse(localStorage.getItem('maktouaStudent'));
    if (!studentData) {
        alert('يرجى تسجيل الدخول أولاً');
        return;
    }
    
    generateCertificate(studentData.name, 'برنامج مكطوع نعالة المتكامل', 'جميع الأساتذة');
});

// Download Student ID
document.getElementById('downloadIdBtn').addEventListener('click', function() {
    const studentData = JSON.parse(localStorage.getItem('maktouaStudent'));
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
    let reviews = JSON.parse(localStorage.getItem('maktouaReviews')) || [];
    reviews.push({ 
        name, 
        comment, 
        date: new Date().toLocaleDateString('ar-MA'),
        rating: 5 // Default 5 stars for simplicity
    });
    localStorage.setItem('maktouaReviews', JSON.stringify(reviews));
    
    alert('شكراً لك على تعليقك!');
    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewComment').value = '';
    
    // Reload reviews to show the new one
    loadReviews();
});

// Load Reviews from localStorage
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('maktouaReviews')) || [];
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    
    // Only add if we have new reviews and we haven't already added them
    if (reviews.length > 0 && !document.querySelector('.user-review')) {
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
                <div style="margin-top: 10px; font-size: 0.8rem; color: #666;">${review.date}</div>
            `;
            testimonialsContainer.appendChild(reviewCard);
        });
    }
}

// Generate Certificate
function generateCertificate(studentName, program, instructor) {
    const certificateContent = document.getElementById('certificateContent');
    const currentDate = new Date().toLocaleDateString('ar-MA');
    
    certificateContent.innerHTML = `
        <div class="certificate">
            <div class="certificate-header">
                <div class="certificate-logo">كلية مكطوع نعالة</div>
                <div class="certificate-title">شهادة تقدير</div>
                <div class="certificate-subtitle">Maktoua N'aala College - Certificate of Appreciation</div>
            </div>
            
            <div class="certificate-body">
                <div class="certificate-student-name">${studentName}</div>
                <div class="certificate-text">
                    هذا شهادة تقدير تمنح لـ <strong>${studentName}</strong> 
                    لإكماله بنجاح برنامج <strong>${program}</strong> 
                    في كلية مكطوع نعالة. وقد أظهر الطالب تفانيًا ملحوظًا 
                    والتزامًا بالمبادئ الأكاديمية للكلية.
                </div>
                <div class="certificate-program">${program}</div>
                <div class="certificate-instructor">المشرف: ${instructor}</div>
            </div>
            
            <div class="certificate-footer">
                <div class="certificate-signature">
                    <div class="signature-line"></div>
                    <div class="signature-name">د. محمد فال محمد سالم</div>
                    <div class="signature-title">عميد الكلية</div>
                </div>
                
                <div class="certificate-signature">
                    <div class="signature-line"></div>
                    <div class="signature-name">${instructor}</div>
                    <div class="signature-title">المشرف الأكاديمي</div>
                </div>
            </div>
            
            <div class="certificate-seal">
                كلية<br>مكطوع نعالة
            </div>
            
            <div style="margin-top: 30px; font-size: 0.9rem; color: #666;">
                تاريخ الإصدار: ${currentDate}
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
        <div class="id-card">
            <div class="id-card-header">
                <div class="id-card-logo">كلية مكطوع نعالة</div>
                <div class="id-card-title">بطاقة طالب</div>
                <div class="id-card-location">نواقشوط، موريتانيا</div>
            </div>
            
            <div class="id-card-body">
                <div class="id-card-photo">
                    <i class="fas fa-user-graduate"></i>
                </div>
                
                <div class="id-card-info">
                    <div class="id-card-name">${studentData.name}</div>
                    <div class="id-card-details">
                        <p><strong>رقم الطالب:</strong> ${studentData.studentId}</p>
                        <p><strong>القسم:</strong> ${studentData.department}</p>
                        <p><strong>تاريخ التسجيل:</strong> ${studentData.registrationDate}</p>
                        <p><strong>تاريخ الإصدار:</strong> ${issueDate}</p>
                        <p><strong>تاريخ الانتهاء:</strong> ${expiryDate}</p>
                    </div>
                </div>
            </div>
            
            <div class="id-card-footer">
                <div class="id-card-barcode"></div>
                <p>هذه البطاقة خاصة بكلية مكطوع نعالة ولا يمكن استخدامها لأي غرض رسمي</p>
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
        
        const studentData = JSON.parse(localStorage.getItem('maktouaStudent'));
        if (!studentData) {
            alert('يرجى التسجيل في لوحة الطالب أولاً قبل الالتحاق بالبرامج');
            return;
        }
        
        generateCertificate(studentData.name, program, instructor);
    });
});

// Book Download
document.querySelectorAll('.download-book-btn').forEach(button => {
    button.addEventListener('click', function() {
        const bookTitle = this.getAttribute('data-book');
        alert(`سيتم تحميل كتاب "${bookTitle}" قريباً! هذه ميزة تجريبية.`);
        // In a real implementation, this would download a PDF file
    });
});

// Modal Close Buttons
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Print Certificate
document.getElementById('printCertificateBtn').addEventListener('click', function() {
    const certificateContent = document.getElementById('certificateContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>طباعة الشهادة</title>
                <style>
                    body { font-family: 'Tajawal', sans-serif; direction: rtl; margin: 0; padding: 20px; }
                    .certificate { border: 2px solid #000; padding: 40px; text-align: center; }
                    .certificate-logo { font-size: 2rem; font-weight: bold; margin-bottom: 10px; }
                    .certificate-student-name { font-size: 2rem; font-weight: bold; margin: 20px 0; text-decoration: underline; }
                    .certificate-footer { display: flex; justify-content: space-between; margin-top: 50px; }
                    .signature-line { width: 200px; border-bottom: 1px solid #000; margin: 40px auto 10px; }
                    @media print {
                        body { margin: 0; }
                        .certificate { border: none; box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                ${certificateContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
});

// Print ID Card
document.getElementById('printIdCardBtn').addEventListener('click', function() {
    const idCardContent = document.getElementById('idCardContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>طباعة بطاقة الطالب</title>
                <style>
                    body { font-family: 'Tajawal', sans-serif; direction: rtl; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                    .id-card { max-width: 400px; }
                    @media print {
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                ${idCardContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
});

// Download Certificate as PDF (simulated)
document.getElementById('downloadCertificatePdfBtn').addEventListener('click', function() {
    alert('سيتم تحميل الشهادة كملف PDF قريباً! هذه ميزة تجريبية.');
    // In a real implementation, this would use a library like jsPDF to generate a PDF
});

// Download ID Card as PDF (simulated)
document.getElementById('downloadIdCardPdfBtn').addEventListener('click', function() {
    alert('سيتم تحميل بطاقة الطالب كملف PDF قريباً! هذه ميزة تجريبية.');
    // In a real implementation, this would use a library like jsPDF to generate a PDF
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
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Add animation to cards when they come into view
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
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});