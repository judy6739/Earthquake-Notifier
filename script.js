const earthquakeList = document.getElementById('earthquake-list');

// دالة لجلب بيانات الزلازل
async function fetchEarthquakes() {
    try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        const data = await response.json();
        displayEarthquakes(data.features);
    } catch (error) {
        console.error('حدث خطأ أثناء جلب بيانات الزلازل:', error);
    }
}

// دالة لعرض بيانات الزلازل في الصفحة
function displayEarthquakes(earthquakes) {
    earthquakeList.innerHTML = '';
    earthquakes.forEach(eq => {
        const magnitude = eq.properties.mag;
        const location = eq.properties.place;
        const time = new Date(eq.properties.time).toLocaleString();
        
        const earthquakeItem = document.createElement('div');
        earthquakeItem.innerHTML = `<strong>قوة الزلزال:</strong> ${magnitude} - <strong>الموقع:</strong> ${location} - <strong>التاريخ:</strong> ${time}`;
        earthquakeList.appendChild(earthquakeItem);
    });
}

// استدعاء الدالة لجلب البيانات عند تحميل الصفحة
fetchEarthquakes();
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;
    checkEarthquakes(userLatitude, userLongitude);
}

function error() {
    console.error('لم يتمكن من تحديد الموقع.');
}
async function checkEarthquakes(userLat, userLon) {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    const data = await response.json();

    data.features.forEach(eq => {
        const eqLat = eq.geometry.coordinates[1];
        const eqLon = eq.geometry.coordinates[0];
        const distance = calculateDistance(userLat, userLon, eqLat, eqLon);

        if (distance < 100) { // على سبيل المثال 100 كم
            alert('تحذير: زلزال قريب من منطقتك!');
        }
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // نصف قطر الأرض بالكيلومترات
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // المسافة بالكيلومترات
}
async function checkEarthquakes(userLat, userLon) {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    const data = await response.json();

    let alertSent = false; // لتجنب إرسال تنبيه متكرر

    data.features.forEach(eq => {
        const eqLat = eq.geometry.coordinates[1];
        const eqLon = eq.geometry.coordinates[0];
        const distance = calculateDistance(userLat, userLon, eqLat, eqLon);

        if (distance < 100 && !alertSent) { // على سبيل المثال 100 كم
            sendNotification('تحذير: زلزال قريب من منطقتك!');
            alertSent = true; // بعد إرسال التنبيه
        }
    });
}

function sendNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification(message);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(message);
            }
        });
    }
}

// استدعاء الدالة لجلب البيانات عند تحميل الصفحة
fetchEarthquakes();
navigator.geolocation.getCurrentPosition(success, error);

