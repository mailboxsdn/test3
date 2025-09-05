let doctors = [];

// تحميل البيانات من CSV
fetch('data.csv')
    .then(response => response.text())
    .then(text => {
        const rows = text.split('\n').slice(1);
        doctors = rows.map((row, index) => {
            const [name, speciality, city, workplace, schedule, phone, location] = row.split(',');
            return { id: index, name, speciality, city, workplace, schedule, phone, location };
        });
        populateFilters();
        displayDoctors(doctors);
    });

// عرض قائمة الأطباء على شكل بطاقات (الاسم فقط)
function displayDoctors(list) {
    const container = document.getElementById('doctorsList');
    container.innerHTML = '';
    list.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${doc.name}</h3>`;
        card.addEventListener('click', () => {
            // عند النقر، ننتقل لصفحة التفاصيل مع ID
            window.location.href = `details.html?id=${doc.id}`;
        });
        container.appendChild(card);
    });
}

// تعبئة الفلاتر
function populateFilters() {
    const specialitySet = new Set(doctors.map(d => d.speciality));
    const citySet = new Set(doctors.map(d => d.city));

    const specialitySelect = document.getElementById('filterSpeciality');
    specialitySet.forEach(s => {
        const option = document.createElement('option');
        option.value = s;
        option.textContent = s;
        specialitySelect.appendChild(option);
    });

    const citySelect = document.getElementById('filterCity');
    citySet.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.textContent = c;
        citySelect.appendChild(option);
    });

    document.getElementById('searchName').addEventListener('input', filterDoctors);
    specialitySelect.addEventListener('change', filterDoctors);
    citySelect.addEventListener('change', filterDoctors);
}

// فلترة الأطباء
function filterDoctors() {
    const name = document.getElementById('searchName').value.trim();
    const speciality = document.getElementById('filterSpeciality').value;
    const city = document.getElementById('filterCity').value;

    const filtered = doctors.filter(d => {
        return (!name || d.name.includes(name)) &&
               (!speciality || d.speciality === speciality) &&
               (!city || d.city === city);
    });

    displayDoctors(filtered);
}
