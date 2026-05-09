// استيراد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ✅ إعداد Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCmCecvEhU5Q2SaLzngnAM6AX9qeNOJE98",
    authDomain: "praynotify.firebaseapp.com",
    databaseURL: "https://praynotify-default-rtdb.firebaseio.com/",
    projectId: "praynotify",
    storageBucket: "praynotify.appspot.com",
    messagingSenderId: "825282016133",
    appId: "1:825282016133:web:2c3d64ddf1024ddadc8aec",
    measurementId: "G-DKLRSZDEEY"
};

// ✅ تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ تعريف المراجع
const suggestionsRef = ref(db, "suggestions");
const dailyContentRef = ref(db, "daily_content");
const visitsRef = ref(db, "visits");

// ✅ عناصر DOM
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeSidebar = document.getElementById('closeSidebar');

// ✅ دوال القائمة الجانبية
function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeSidebarFunc() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

menuToggle.addEventListener('click', toggleSidebar);
closeSidebar.addEventListener('click', closeSidebarFunc);
overlay.addEventListener('click', closeSidebarFunc);

// ✅ فتح الروابط من القائمة الجانبية والبطاقات
window.openLink = function(url) {
    window.location.href = url;
    closeSidebarFunc();
};

// ✅ دوال المشاركة
window.copyLink = function() {
    let linkInput = document.getElementById("site-link");
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(linkInput.value);
    alert("✅ تم نسخ الرابط!");
};

window.shareLink = function() {
    if (navigator.share) {
        navigator.share({
            title: "صدقة جارية",
            url: document.getElementById("site-link").value
        }).catch(err => console.log("مشاركة فشلت: ", err));
    } else {
        alert("⚠️ خاصية المشاركة غير مدعومة في هذا المتصفح.");
    }
};

// ✅ دوال Popup
window.closePopup = function() {
    document.getElementById('download-popup').style.display = 'none';
};

// ✅ دالة إظهار البوب أب يدوياً (للرابط في الشريط)
window.showPopup = function(event) {
    if (event) event.preventDefault();
    document.getElementById('download-popup').style.display = 'flex';
};

// ✅ إظهار Popup بعد 10 ثواني (تأخير أطول)
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('download-popup').style.display = 'flex';
    }, 10000); // 10 ثواني
});

// ✅ جلب التذكرة اليومية من Firebase
onValue(dailyContentRef, (snapshot) => {
    let updateContainer = document.getElementById("update-container");
    if (snapshot.exists()) {
        updateContainer.innerText = snapshot.val();
    } else {
        updateContainer.innerText = "لا توجد تحديثات متاحة.";
    }
}, (error) => {
    console.error("❌ خطأ في جلب التحديثات:", error);
    document.getElementById("update-container").innerText = "⚠️ فشل في تحميل التحديثات!";
});

// ✅ وظيفة توليد معرف الجهاز
function getDeviceId() {
    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
        deviceId = "device_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("device_id", deviceId);
    }
    return deviceId;
}

const deviceId = getDeviceId();
const devicesRef = ref(db, "devices/" + deviceId);

// ✅ تحديث عدد الزيارات وعرضها
onValue(visitsRef, (snapshot) => {
    if (snapshot.exists()) {
        let data = snapshot.val();
        document.getElementById("unique-visitors").innerText = data.unique_visitors || 0;
        document.getElementById("total-visits").innerText = data.total_visits || 0;
    }
});

// ✅ زيادة عدد الزيارات الكلية
get(visitsRef).then(snapshot => {
    let totalVisits = 1;
    if (snapshot.exists()) {
        totalVisits = (snapshot.val().total_visits || 0) + 1;
    }
    return update(visitsRef, { total_visits: totalVisits });
}).catch(error => console.error("❌ خطأ في تحديث الزيارات:", error));

// ✅ تسجيل جهاز جديد إذا لم يكن موجوداً
get(devicesRef).then(snapshot => {
    if (!snapshot.exists()) {
        set(devicesRef, { firstVisit: new Date().toISOString() })
            .then(() => get(visitsRef))
            .then(snapshot => {
                let newUnique = (snapshot.val()?.unique_visitors || 0) + 1;
                return update(visitsRef, { unique_visitors: newUnique });
            })
            .catch(error => console.error("❌ خطأ في تحديث الزوار الفريدين:", error));
    }
}).catch(error => console.error("❌ خطأ في التحقق من الجهاز:", error));

// ✅ وظيفة إرسال الاقتراحات
window.submitSuggestion = function() {
    const suggestionInput = document.getElementById("suggestion-input");
    const suggestionText = suggestionInput.value.trim();

    if (suggestionText === "") {
        alert("⚠ الرجاء كتابة اقتراح قبل الإرسال!");
        return;
    }

    const newSuggestionRef = push(suggestionsRef);
    set(newSuggestionRef, {
        text: suggestionText,
        timestamp: new Date().toISOString()
    }).then(() => {
        alert("✅ تم إرسال الاقتراح بنجاح!");
        suggestionInput.value = "";
    }).catch(error => {
        console.error("❌ خطأ في الإرسال:", error);
        alert("❌ فشل في إرسال الاقتراح. حاول مرة أخرى.");
    });
};

// ✅ تسجيل Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then(registration => console.log('✅ ServiceWorker registered'))
            .catch(err => console.error('❌ ServiceWorker registration failed:', err));
    });
}

// ✅ منع إغلاق القائمة عند النقر داخلها
sidebar.addEventListener('click', (e) => {
    e.stopPropagation();
});

// ✅ إغلاق القائمة بالضغط على ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebarFunc();
    }
});

console.log("✅ تم تحميل script.js بنجاح");