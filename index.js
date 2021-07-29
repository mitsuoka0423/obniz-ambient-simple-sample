"use strict";

require("dotenv").config();

// ライブラリを読み込む
const Obniz = require("obniz");
const Ambient = require("ambient-lib");

// 事前準備
const obniz = new Obniz(process.env.OBNIZ_ID);
const ambient = new Ambient(process.env.AMBIENT_CHANNEL_ID, process.env.AMBIENT_WRITE_KEY);

// 接続時に以下の処理を実行する
obniz.onconnect = async function () {
  // 温度センサーの準備
  const LM35 = obniz.wired("Keyestudio_TemperatureSensor", { signal: 0, vcc: 1, gnd: 2 });

  // ずっと実行させる
  while (true) {
    // 温度を取得する
    const temperature = await LM35.getWait();

    // Ambientにデータを送信する
    ambient.send({ d1: temperature }, function () {
      console.log("送信成功");
    });

    // 送信間隔
    await obniz.wait(Number(process.env.INTERVAL) || 60000);
  }
};
