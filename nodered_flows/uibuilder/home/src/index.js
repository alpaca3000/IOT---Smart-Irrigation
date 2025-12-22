// Give VS Code IntelliSense for uibuilder
/// <reference path="../types/uibuilder.d.ts" />

/// const { use } = require("react");

/** The simplest use of uibuilder client library
 * See the docs if the client doesn't start on its own.
 */

// Listen for incoming messages from Node-RED and action
// uibuilder.onChange('msg', (msg) => {
//     // do stuff with the incoming msg
// })

///"use strict";

const btnAuto = document.getElementById("btn-auto");
const btnManual = document.getElementById("btn-manual");
const autoPanel = document.getElementById("auto-panel");
const manualPanel = document.getElementById("manual-panel");

btnAuto.onclick = () => {
  console.log("Auto mode button clicked");
  btnAuto.classList.add("active");
  btnManual.classList.remove("active");
  autoPanel.classList.remove("hidden");
  manualPanel.classList.add("hidden");
};

btnManual.onclick = () => {
  console.log("Manual mode button clicked");
  btnManual.classList.add("active");
  btnAuto.classList.remove("active");
  manualPanel.classList.remove("hidden");
  autoPanel.classList.add("hidden");
};

document.addEventListener("DOMContentLoaded", () => {

  uibuilder.start({
          'serverPath': '/home' 
  });

  uibuilder.onChange('msg', msg => {
    console.log("Received from Node-RED:", msg);

    if (!msg || !msg.payload) return;

    const { type, data } = msg.payload;

    if (type === "sensors") {
      updateSensorUI(data);
    }

    if (type === "alert") {
      updateStateUI(data);
    }
  });

});


// uibuilder.onChange('msg', msg => {
//   console.log("UI received:", msg.payload);
//   if (!msg || !msg.payload) return;

//   // Dữ liệu từ Node-RED sẽ có dạng:
//   // msg.payload = { type: "sensors", data: { soil, water, temp, hum } }
//   // hoặc msg.payload = { type: "alert", data: { soil, water, temp_hum } }

//   const { type, data } = msg.payload;

//   if (type === "sensors") {
//     // Cập nhật UI với dữ liệu cảm biến
//     // data = { soil, water, temp, hum }
//     updateSensorUI(data);
//   }

//   if (type === "alert") {
//     // Cập nhật trạng thái lỗi cho các cảm biến
//     // data = { soil, water, temp_hum }
//     updateStateUI(data);
//   }
// });

// Cập nhật chỉ phần sensor monitoring bên phải
function updateSensorUI(data) {
  document.getElementById("soil-sensor-value").innerText = data.soil + "%";
  document.getElementById("temp-sensor-value").innerText = data.temp + "°C";
  document.getElementById("hum-sensor-value").innerText = data.hum + "%";
  document.getElementById("water-sensor-value").innerText = data.water + "L";
}

function updateStateUI(data) {
  // data = { soil, water, temp_hum }
  setStatus("soil", data.soil);
  setStatus("water", data.water);
  setStatus("temp_hum", data.temp_hum);
}

// function setStatus(sensor, state) {
//   // sensor: "soil", "water", "temp_hum"
//   // state: "ok" | "fault"
//   const dot = document.getElementById(sensor + "-dot");
//   if (dot) dot.classList.toggle("fault", state === "fault");
// }

function setStatus(sensor, state) {
  const dot = document.getElementById(sensor + "-dot");
  if (!dot) return;

  // Xóa cả hai class trước khi thêm class mới để đảm bảo chuyển đổi đúng
  dot.classList.remove("normal", "error");

  if (state === "ok") {
    dot.classList.add("normal");
  } else if (state === "fault") {
    dot.classList.add("error");
  }
}


// Gửi lệnh settings/manual watering về Node-RED
document.querySelectorAll('.primary-btn').forEach(btn => {
  btn.onclick = function (e) {
    if (btn.textContent.includes("Change settings")) {
      // Ví dụ: lấy giá trị từ input (bạn cần thêm input vào html nếu muốn)
      // let soil_min = Number(document.getElementById('soil-min-input').value);
      // let temp_max = Number(document.getElementById('temp-max-input').value);
      // let hum_min = Number(document.getElementById('hum-min-input').value);
      // uibuilder.send({
      //   cmd: "SETTING_CHANGE",
      //   data: { soil_min, temp_max, hum_min }
      // });
      // alert("Settings sent (bạn cần bổ sung input để lấy giá trị thực tế)");
    } else if (btn.textContent.includes("Watering now")) {
      const min = Number(document.getElementById('duration-min')?.value || 0);
      const sec = Number(document.getElementById('duration-sec')?.value || 0);
      const duration = min * 60 + sec;
      if (duration > 0 && duration <= 3600) {
        uibuilder.send({
          cmd: "WATERING",
          duration_s: duration
        });

        // in thông điệp gửi đi có dạng: topic, msg
        console.log("Sent watering command for", duration, "seconds");

      } else {
        alert("Please enter a valid duration (1-3600 seconds).");
      }
    }
  };
});