#include <Arduino.h>
#define BUZZER_PIN 15
#define POT_PIN 34
#define TRIG_PIN 26
#define ECHO_PIN 25

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(POT_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2; // cm
  Serial.println(distance);
  delay(500);
}