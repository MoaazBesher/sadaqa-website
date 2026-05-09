// e:\Sites\sadaqaSite\js\services.js
import { mainDb, auxDb } from './firebase-config.js';
import { ref, push, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const suggestionsRef = ref(mainDb, "suggestions");
const dailyContentRef = ref(mainDb, "daily_content");
const visitsRef = ref(mainDb, "visits");

// 1. Visit Tracking Logic
export function initVisitTracking() {
    function getDeviceId() {
        let deviceId = localStorage.getItem("device_id");
        if (!deviceId) {
            deviceId = "device_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("device_id", deviceId);
        }
        return deviceId;
    }

    const deviceId = getDeviceId();
    const devicesRef = ref(mainDb, "devices/" + deviceId);

    get(visitsRef).then(snapshot => {
        let totalVisits = 1;
        if (snapshot.exists()) {
            totalVisits = (snapshot.val().total_visits || 0) + 1;
        }
        return update(visitsRef, { total_visits: totalVisits });
    }).catch(console.error);

    get(devicesRef).then(snapshot => {
        if (!snapshot.exists()) {
            set(devicesRef, { firstVisit: new Date().toISOString() })
                .then(() => get(visitsRef))
                .then(snapshot => {
                    let newUnique = (snapshot.val()?.unique_visitors || 0) + 1;
                    return update(visitsRef, { unique_visitors: newUnique });
                })
                .catch(console.error);
        }
    }).catch(console.error);
}

// Subscribe to visit counts
export function listenToVisits(onUpdate) {
    onValue(visitsRef, (snapshot) => {
        if (snapshot.exists()) {
            onUpdate(snapshot.val());
        }
    });
}

// 2. Daily Content Logic
export function listenToDailyContent(onUpdate) {
    onValue(dailyContentRef, (snapshot) => {
        if (snapshot.exists()) {
            onUpdate(snapshot.val());
        } else {
            onUpdate("لا توجد تحديثات متاحة.");
        }
    }, (error) => {
        console.error("❌ خطأ في جلب التحديثات:", error);
        onUpdate("⚠️ فشل في تحميل التحديثات!");
    });
}

// 3. Submit Suggestion Logic
export function submitSuggestion(text) {
    if (!text || text.trim() === "") {
        alert("⚠ الرجاء كتابة اقتراح قبل الإرسال!");
        return Promise.reject("Empty text");
    }

    const newSuggestionRef = push(suggestionsRef);
    return set(newSuggestionRef, {
        text: text.trim(),
        timestamp: new Date().toISOString()
    }).then(() => {
        alert("✅ تم إرسال الاقتراح بنجاح!");
    }).catch(error => {
        console.error("❌ خطأ في الإرسال:", error);
        alert("❌ فشل في إرسال الاقتراح. حاول مرة أخرى.");
        throw error;
    });
}

// 4. Pray Times Specific visits
export function logPrayTimesVisit() {
    // Specifically records visit on the separate aux db for pray times
    const prayerTimesVisitsRef = ref(auxDb, "page_visits/prayer_times");
    get(prayerTimesVisitsRef).then(snapshot => {
        let visits = { count: 1 };
        if (snapshot.exists()) {
            let data = snapshot.val();
            visits.count = (data.count || 0) + 1;
        }
        return update(prayerTimesVisitsRef, visits);
    }).catch(console.error);
}
