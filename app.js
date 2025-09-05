// app.js (محدَّث — فرز أبجدي عربي للأطباء والـ spinners)
let doctors = [];

// دالة مساعدة للفرز العربي الآمن (يتجاهل فراغات البداية والنهاية)
function arabicCompare(a, b) {
    return a.trim().localeCompare(b.trim(), 'ar');
}

// تحميل البيانات من CSV
fetch('data.csv')
    .then(response => response.text())
    .then(text => {
        const rows = text.split('\n').slice(1).filter(r => r.trim() !== '');
        doctors = rows.map((row, index) => {
            // ملاحظة: هذا التحليل يفترض أن الحقول مفصولة بفاصلة ولا تحتوي الحقول على فاصلة داخلها.
            const [name, speciality, city, workplace, schedule, phone, location] = row.split(',');
            return {
                id: index,
                name: name ? name.trim() : '',
                speciality: speciality ? speciality.trim() : '',
                city: city ? city.trim() : '',
                workplace: workplace ? workplace.trim() : '',
                schedule: schedule ? schedule.trim() : '',
                phone: phone ? phone.trim() : '',
                location: location ? location.trim() : ''
            };
        });

        // فرز القائمة الأساسية للأطباء أبجدياً حسب الاسم (عربي)
        doctors.sort((a, b) => arabicCompare(a.name, b.name));

        populateFilters();
        displayDoctors(doctors);
    })
    .catch(err => {
        console.error('Failed to load data.csv:', err);
    });

// عرض الأطباء (نرتب النتيجة قبل العرض لضمان الترتيب بعد الفلتر)
function displayDoctors(list) {
    const container = document.getElementById('doctorsList');
    container.innerHTML = '';

    // تأكد من أن القائمة مرتبة أبجدياً قبل العرض
    const sorted = Array.from(list).sort((a, b) => arabicCompare(a.name, b.name));

    sorted.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${escapeHtml(doc.name)}</h3>`;
        card.addEventListener('click', () => {
            window.location.href = `details.html?id=${doc.id}`;
        });
        container.appendChild(card);
    });
}

// تعبئة الفلاتر (spinners) بترتيب أبجدي
function populateFilters() {
    const specialitySet = new Set(doctors.map(d => d.speciality).filter(s => s));
    const citySet = new Set(doctors.map(d => d.city).filter(c => c));

    const specialityArray = Array.from(specialitySet).sort((a, b) => arabicCompare(a, b));
    const cityArray = Array.from(citySet).sort((a, b) => arabicCompare(a, b));

    const specialitySelect = document.getElementById('filterSpeciality');
    const citySelect = document.getElementById('filterCity');

    // تنظيف الخيارات القديمة (ما عدا الخيار الافتراضي)
    specialitySelect.innerHTML = '<option value="">اختر التخصص</option>';
    citySelect.innerHTML = '<option value="">اختر المدينة</option>';

    specialityArray.forEach(s => {
        const option = document.createElement('option');
        option.value = s;
        option.textContent = s;
        specialitySelect.appendChild(option);
    });

    cityArray.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.textContent = c;
        citySelect.appendChild(option);
    });

    document.getElementById('searchName').addEventListener('input', filterDoctors);
    specialitySelect.addEventListener('change', filterDoctors);
    citySelect.addEventListener('change', filterDoctors);
}

// فلترة الأطباء (وترتيب النتيجة أبجدياً قبل العرض)
function filterDoctors() {
    const name = document.getElementById('searchName').value.trim();
    const speciality = document.getElementById('filterSpeciality').value;
    const city = document.getElementById('filterCity').value;

    const filtered = doctors.filter(d => {
        const matchName = !name || d.name.includes(name);
        const matchSpec = !speciality || d.speciality === speciality;
        const matchCity = !city || d.city === city;
        return matchName && matchSpec && matchCity;
    });

    displayDoctors(filtered);
}

// حماية بسيطة من XSS عند إدراج النصوص في innerHTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
