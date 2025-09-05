let doctors = [];

// دالة لإزالة التشكيل من النصوص العربية
function removeDiacritics(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u064B-\u0652]/g, "");
}

// فرز أبجدي عربي
function arabicCompare(a, b) {
    return removeDiacritics(a.trim()).localeCompare(removeDiacritics(b.trim()), 'ar');
}

// تحميل البيانات من CSV
fetch('data.csv')
    .then(response => response.text())
    .then(text => {
        const rows = text.split('\n').slice(1).filter(r => r.trim() !== '');
        doctors = rows.map((row, index) => {
            const cols = row.split(',');
            const [name, speciality, city, workplace, schedule, phone, location] = cols;
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

        doctors.sort((a, b) => arabicCompare(a.name, b.name));

        populateFilters();
        displayDoctors(doctors);
    })
    .catch(err => console.error('❌ فشل تحميل data.csv:', err));

// عرض الأطباء
function displayDoctors(list) {
    const container = document.getElementById('doctorsList');
    container.innerHTML = '';

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

// تعبئة الفلاتر
function populateFilters() {
    const specialitySet = new Set(doctors.map(d => d.speciality).filter(Boolean));
    const citySet = new Set(doctors.map(d => d.city).filter(Boolean));

    const specialityArray = Array.from(specialitySet).sort((a, b) => arabicCompare(a, b));
    const cityArray = Array.from(citySet).sort((a, b) => arabicCompare(a, b));

    const specialitySelect = document.getElementById('filterSpeciality');
    const citySelect = document.getElementById('filterCity');

    specialitySelect.innerHTML = '<option value="">اختر التخصص</option>';
    citySelect.innerHTML = '<option value="">اختر المدينة</option>';

    specialityArray.forEach(s => {
        const option = document.createElement('option');
        option.value = s;
        option.textContent = escapeHtml(s);
        specialitySelect.appendChild(option);
    });

    cityArray.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.textContent = escapeHtml(c);
        citySelect.appendChild(option);
    });

    document.getElementById('searchName').addEventListener('input', filterDoctors);
    specialitySelect.addEventListener('change', filterDoctors);
    citySelect.addEventListener('change', filterDoctors);
}

// فلترة الأطباء مع ignore case و ignore diacritics
function filterDoctors() {
    const nameInput = removeDiacritics(document.getElementById('searchName').value.trim().toLowerCase());
    const speciality = document.getElementById('filterSpeciality').value;
    const city = document.getElementById('filterCity').value;

    const filtered = doctors.filter(d => {
        const docName = removeDiacritics(d.name.toLowerCase());
        const matchName = !nameInput || docName.includes(nameInput);
        const matchSpec = !speciality || d.speciality === speciality;
        const matchCity = !city || d.city === city;
        return matchName && matchSpec && matchCity;
    });

    displayDoctors(filtered);
}

// حماية XSS
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
