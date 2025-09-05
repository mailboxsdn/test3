// استرجاع ID من الرابط
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));

fetch('data.csv')
    .then(response => response.text())
    .then(text => {
        const rows = text.split('\n').slice(1);
        const doctors = rows.map((row, index) => {
            const [name, speciality, city, workplace, schedule, phone, location] = row.split(',');
            return { id: index, name, speciality, city, workplace, schedule, phone, location };
        });

        const doc = doctors.find(d => d.id === id);
        if (doc) showDetails(doc);
    });

function showDetails(doc) {
    const container = document.getElementById('doctorDetails');
    container.innerHTML = `
        <div class="card">
            <h3>${doc.name}</h3>
            <p>التخصص: ${doc.speciality}</p>
            <p>المدينة: ${doc.city}</p>
            <p>مكان العمل: ${doc.workplace}</p>
            <p>مواعيد العمل: ${doc.schedule}</p>
            <hr>
            <p>
                <a href="tel:${doc.phone}"><button>رقم الهاتف</button></a>
                <a href="${doc.location}" target="_blank"><button>Google Maps</button></a>
            </p>
        </div>
    `;
}
