import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging.js";


const firebaseConfig = {
  apiKey: "AIzaSyCmCecvEhU5Q2SaLzngnAM6AX9qeNOJE98",
  authDomain: "praynotify.firebaseapp.com",
  projectId: "praynotify",
  storageBucket: "praynotify.appspot.com",
  messagingSenderId: "825282016133",
  appId: "1:825282016133:web:2c3d64ddf1024ddadc8aec",
  measurementId: "G-DKLRSZDEEY"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


function getFCMToken() {
   getToken(messaging, { vapidKey: "BKiLKze-QczdB3_kafrU26owouWXeTheJvkq53VVYcV8sgLBU9G0pQeMqRaHOJA2UvzPa-qIg6K9kWnM_Xr1rzg" })
  .then((currentToken) => {
      if (currentToken) {
          console.log("✅ FCM Token:", currentToken);
      } else {
          console.log("❌ لم يتم الحصول على التوكن.");
      }
  })
  .catch((err) => {
      console.log("❌ خطأ أثناء الحصول على التوكن:", err);
  });


}

// طلب إذن الإشعارات من المستخدم
function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("تم السماح بالإشعارات");
            getFCMToken();
        } else {
            console.warn("تم رفض الإشعارات");
        }
    });
}
requestNotificationPermission();

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("request-notification");
    if (btn) btn.addEventListener("click", requestNotificationPermission);
});

function sendTokenToServer(token) {
    fetch("https://savetoken-gjbjxkj2da-uc.a.run.app", {  // الرابط الصحيح
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => console.log("✅ تم حفظ التوكن بنجاح:", data))
    .catch(err => console.error("❌ خطأ في إرسال التوكن:", err));
}




// الاستماع إلى الرسائل الواردة
onMessage(messaging, (payload) => {
    console.log("تم استلام إشعار:", payload);
    new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon
    });
});

// تشغيل إذن الإشعارات عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", requestNotificationPermission);
function convertTo12HourFormat(time) {
    let [hour, minute] = time.split(":").map(Number);
    let period = hour >= 12 ? "م" : "ص"; // تحديد AM أو PM
    hour = hour % 12 || 12; // تحويل 0 إلى 12
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}

document.addEventListener("DOMContentLoaded", () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                sendTestNotification();
            } else {
                console.warn("تم رفض إذن الإشعارات");
            }
        });
    } else {
        sendTestNotification();
    }
    
    // تسجيل Service Worker للإشعارات على الهاتف
   if ('serviceWorker' in navigator) {
navigator.serviceWorker.register(`${location.origin}/firebase-messaging-sw.js`)
    .then(reg => console.log('✅ Service Worker مسجل بنجاح', reg))
    .catch(err => console.error('❌ خطأ في تسجيل Service Worker', err));
}

});

function sendTestNotification() {
    if (Notification.permission === "granted") {
        new Notification("إشعار تجريبي", {
            body: "هذا إشعار تجريبي لاختبار الإشعارات. إذا رأيته، فالإشعارات تعمل بنجاح!",
            icon: "notification_icon.png",
            vibrate: [200, 100, 200],
            requireInteraction: true
        });
    } else {
        console.warn("لم يتم منح إذن الإشعارات بعد");
    }
}

function sendPrayerNotification(prayerName, prayerTime) {
    if (Notification.permission === "granted") {
        new Notification(`حان الآن موعد ${prayerName}`, {
            body: `الوقت: ${prayerTime}`,
            icon: "notification_icon.png",
            vibrate: [200, 100, 200],
            requireInteraction: true
        });
    }
}

function getPrayerTimes(lat, lon) {
    let apiUrl = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5&adjustment=-20`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let timings = data.data.timings;
            let prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
            let localizedNames = {
                "Fajr": "الفجر",
                "Dhuhr": "الظهر",
                "Asr": "العصر",
                "Maghrib": "المغرب",
                "Isha": "العشاء"
            };
            
            let now = new Date();
            let currentTime = now.getHours() * 60 + now.getMinutes();
            let nextPrayer = null;
            let nextPrayerName = "";
            let nextPrayerTime = null;
            
            prayerOrder.forEach(prayer => {
                let prayerTime = timings[prayer];
                let formattedTime = convertTo12HourFormat(prayerTime);
                document.getElementById(`${prayer.toLowerCase()}-time`).textContent = formattedTime;
                
                let [hour, minute] = prayerTime.split(":").map(Number);
                let prayerMinutes = hour * 60 + minute;
                
                if (!nextPrayer && prayerMinutes > currentTime) {
                    nextPrayer = prayer;
                    nextPrayerName = localizedNames[prayer];
                    nextPrayerTime = prayerMinutes;
                    
                    let delay = (prayerMinutes - currentTime) * 60 * 1000;
                    setTimeout(() => {
                        sendPrayerNotification(localizedNames[prayer], formattedTime);
                    }, delay);
                }
            });
            
            if (!nextPrayer) {
                let firstPrayerTime = timings[prayerOrder[0]].split(":").map(Number);
                nextPrayerTime = firstPrayerTime[0] * 60 + firstPrayerTime[1] + 24 * 60;
                nextPrayerName = localizedNames[prayerOrder[0]];
            }
            
            document.getElementById("next-prayer-name").textContent = nextPrayerName;
            
            function updateCountdown() {
                let now = new Date();
                let currentMinutes = now.getHours() * 60 + now.getMinutes();
                let remainingTime = nextPrayerTime - currentMinutes;
                if (remainingTime < 0) remainingTime += 24 * 60;
                let hours = Math.floor(remainingTime / 60);
                let minutes = remainingTime % 60;
                document.getElementById("countdown-timer").textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
            }
            
            updateCountdown();
            setInterval(updateCountdown, 1000);
        })
        .catch(error => console.error("Error fetching prayer times:", error));
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getPrayerTimes(lat, lon);
    }, () => {
        console.error("تعذر الحصول على الموقع");
    });
} else {
    console.error("المتصفح لا يدعم تحديد الموقع");
}

