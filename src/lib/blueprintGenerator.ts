import { ProjectBlueprint, GuidedInput } from "./types";

const TEMPLATES: Record<string, () => ProjectBlueprint> = {
  "home_automation": () => ({
    project_summary: {
      title: "Smart Home Light & Fan Controller",
      description: "Control lights and fan speed remotely via WiFi using a smartphone. Uses ESP32 with relay module for switching and a web dashboard for control.",
      category: "Home Automation",
      difficulty: "Beginner",
      estimated_cost_inr: 850,
      estimated_build_time: "2-3 hours",
      recommended_controller: "ESP32 DevKit V1",
    },
    components: [
      { name: "ESP32 DevKit V1", quantity: 1, approx_price_inr: 350, purpose: "Main controller with WiFi" },
      { name: "4-Channel Relay Module (5V)", quantity: 1, approx_price_inr: 180, purpose: "Switch lights and fan ON/OFF" },
      { name: "Jumper Wires (M-F)", quantity: 10, approx_price_inr: 40, purpose: "Wiring connections" },
      { name: "Breadboard", quantity: 1, approx_price_inr: 80, purpose: "Prototyping connections" },
      { name: "USB Cable (Micro-B)", quantity: 1, approx_price_inr: 50, purpose: "Power and programming" },
      { name: "LED (for testing)", quantity: 4, approx_price_inr: 10, purpose: "Simulate appliances" },
      { name: "Resistor 220Ω", quantity: 4, approx_price_inr: 5, purpose: "Current limiting for LEDs" },
    ],
    wiring_table: [
      { component: "Relay Module IN1", pin_connection: "Signal", controller_pin: "GPIO 26" },
      { component: "Relay Module IN2", pin_connection: "Signal", controller_pin: "GPIO 27" },
      { component: "Relay Module IN3", pin_connection: "Signal", controller_pin: "GPIO 14" },
      { component: "Relay Module IN4", pin_connection: "Signal", controller_pin: "GPIO 12" },
      { component: "Relay Module VCC", pin_connection: "Power", controller_pin: "VIN (5V)" },
      { component: "Relay Module GND", pin_connection: "Ground", controller_pin: "GND" },
    ],
    firmware_starter_code: `#include <WiFi.h>
#include <WebServer.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Relay pins
#define RELAY1 26
#define RELAY2 27
#define RELAY3 14
#define RELAY4 12

WebServer server(80);

// Relay states
bool relayState[4] = {false, false, false, false};
int relayPins[4] = {RELAY1, RELAY2, RELAY3, RELAY4};

void setup() {
  Serial.begin(115200);
  
  // Initialize relay pins
  for (int i = 0; i < 4; i++) {
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], HIGH); // Relays are active LOW
  }
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nConnected! IP: " + WiFi.localIP().toString());
  
  // Setup web routes
  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.begin();
  Serial.println("Server started!");
}

void loop() {
  server.handleClient();
}

void handleRoot() {
  String html = "<html><head><title>Smart Home</title>";
  html += "<meta name='viewport' content='width=device-width,initial-scale=1'>";
  html += "<style>body{font-family:sans-serif;text-align:center;background:#1a1a2e;color:#eee;}";
  html += ".btn{padding:15px 30px;margin:10px;border:none;border-radius:8px;font-size:18px;cursor:pointer;}";
  html += ".on{background:#00d4aa;color:#000;}.off{background:#333;color:#fff;}</style></head>";
  html += "<body><h1>Smart Home Controller</h1>";
  
  String labels[] = {"Light 1", "Light 2", "Fan", "Light 3"};
  for (int i = 0; i < 4; i++) {
    html += "<button class='btn " + String(relayState[i] ? "on" : "off") + "'";
    html += " onclick=\\"fetch('/toggle?r=" + String(i) + "').then(()=>location.reload())\\">";
    html += labels[i] + " (" + String(relayState[i] ? "ON" : "OFF") + ")</button><br>";
  }
  
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleToggle() {
  if (server.hasArg("r")) {
    int relay = server.arg("r").toInt();
    if (relay >= 0 && relay < 4) {
      relayState[relay] = !relayState[relay];
      digitalWrite(relayPins[relay], relayState[relay] ? LOW : HIGH);
      Serial.println("Relay " + String(relay) + ": " + String(relayState[relay] ? "ON" : "OFF"));
    }
  }
  server.sendHeader("Location", "/");
  server.send(303);
}`,
    build_steps: [
      "Install Arduino IDE and add ESP32 board support (Board Manager → ESP32 by Espressif)",
      "Connect ESP32 to your computer via USB cable",
      "Wire the relay module to ESP32 as per the wiring table",
      "Connect LEDs with resistors to relay outputs for testing",
      "Open Arduino IDE, paste the firmware code, update WiFi credentials",
      "Select board 'ESP32 Dev Module' and correct COM port",
      "Upload the code and open Serial Monitor at 115200 baud",
      "Note the IP address shown, open it in your phone browser",
      "Toggle buttons to control relays — LEDs should turn ON/OFF",
    ],
    beginner_tips: [
      "Always disconnect power before changing wiring",
      "Relay modules are usually active LOW — HIGH = OFF, LOW = ON",
      "Use the Serial Monitor to debug connection issues",
      "Start with LEDs before connecting real appliances",
      "Make sure your phone and ESP32 are on the same WiFi network",
    ],
    upgrade_suggestions: [
      "Add Blynk or MQTT for cloud control from anywhere",
      "Add a DHT11 sensor to monitor room temperature",
      "Integrate with Google Home or Alexa via Sinric Pro",
      "Add a physical button override using GPIO interrupts",
      "Create a mobile app using MIT App Inventor",
    ],
  }),

  "environmental_monitoring": () => ({
    project_summary: {
      title: "Weather Station with OLED Display",
      description: "Monitor temperature, humidity, and air pressure using DHT22 and BMP280 sensors. Data is displayed on an OLED screen and can be accessed via WiFi.",
      category: "Environmental Monitoring",
      difficulty: "Beginner",
      estimated_cost_inr: 920,
      estimated_build_time: "2-3 hours",
      recommended_controller: "ESP32 DevKit V1",
    },
    components: [
      { name: "ESP32 DevKit V1", quantity: 1, approx_price_inr: 350, purpose: "Main controller with WiFi" },
      { name: "DHT22 Sensor", quantity: 1, approx_price_inr: 180, purpose: "Temperature & humidity sensing" },
      { name: "BMP280 Sensor (I2C)", quantity: 1, approx_price_inr: 120, purpose: "Barometric pressure sensing" },
      { name: "0.96\" OLED Display (I2C)", quantity: 1, approx_price_inr: 150, purpose: "Display sensor readings" },
      { name: "Breadboard", quantity: 1, approx_price_inr: 80, purpose: "Prototyping" },
      { name: "Jumper Wires", quantity: 10, approx_price_inr: 40, purpose: "Connections" },
    ],
    wiring_table: [
      { component: "OLED SDA", pin_connection: "Data", controller_pin: "GPIO 21 (SDA)" },
      { component: "OLED SCL", pin_connection: "Clock", controller_pin: "GPIO 22 (SCL)" },
      { component: "OLED VCC", pin_connection: "Power", controller_pin: "3.3V" },
      { component: "OLED GND", pin_connection: "Ground", controller_pin: "GND" },
      { component: "BMP280 SDA", pin_connection: "Data", controller_pin: "GPIO 21 (SDA)" },
      { component: "BMP280 SCL", pin_connection: "Clock", controller_pin: "GPIO 22 (SCL)" },
      { component: "DHT22 Data", pin_connection: "Signal", controller_pin: "GPIO 4" },
      { component: "DHT22 VCC", pin_connection: "Power", controller_pin: "3.3V" },
    ],
    firmware_starter_code: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_BMP280.h>
#include <DHT.h>

// OLED config
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Sensors
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP280 bmp;

void setup() {
  Serial.begin(115200);
  
  // Init OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED init failed!");
    while (1);
  }
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("Weather Station");
  display.println("Starting...");
  display.display();
  
  // Init sensors
  dht.begin();
  if (!bmp.begin(0x76)) {
    Serial.println("BMP280 not found!");
  }
  
  delay(2000);
}

void loop() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  float pressure = bmp.readPressure() / 100.0; // hPa
  
  // Display on OLED
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("=== Weather Station ===");
  display.println();
  display.print("Temp:     ");
  display.print(temp, 1);
  display.println(" C");
  display.print("Humidity: ");
  display.print(humidity, 1);
  display.println(" %");
  display.print("Pressure: ");
  display.print(pressure, 1);
  display.println(" hPa");
  display.display();
  
  // Serial output
  Serial.printf("T: %.1fC  H: %.1f%%  P: %.1f hPa\\n", temp, humidity, pressure);
  
  delay(2000); // Update every 2 seconds
}`,
    build_steps: [
      "Install Arduino IDE with ESP32 board support",
      "Install libraries: Adafruit SSD1306, Adafruit BMP280, DHT sensor library",
      "Wire OLED and BMP280 to I2C bus (GPIO 21/22) — they share the same bus",
      "Wire DHT22 data pin to GPIO 4",
      "Upload the firmware and open Serial Monitor",
      "Verify readings on OLED display and Serial Monitor",
    ],
    beginner_tips: [
      "I2C devices share SDA/SCL — you can connect multiple on the same pins",
      "BMP280 address might be 0x76 or 0x77 — try both if it doesn't work",
      "DHT22 needs a 10kΩ pull-up resistor on data line (some modules have it built-in)",
      "If OLED shows nothing, check the I2C address with an I2C scanner sketch",
    ],
    upgrade_suggestions: [
      "Add WiFi web dashboard to view readings remotely",
      "Log data to ThingSpeak or Google Sheets",
      "Add a rain sensor or UV sensor",
      "Add battery power with solar charging",
      "Create alerts via Telegram bot for extreme readings",
    ],
  }),

  "security": () => ({
    project_summary: {
      title: "PIR Motion Detector with Buzzer Alert",
      description: "Detect motion using a PIR sensor and trigger a buzzer alarm. Optional: send notification via WiFi when motion is detected.",
      category: "Security & Surveillance",
      difficulty: "Beginner",
      estimated_cost_inr: 550,
      estimated_build_time: "1-2 hours",
      recommended_controller: "ESP32 DevKit V1",
    },
    components: [
      { name: "ESP32 DevKit V1", quantity: 1, approx_price_inr: 350, purpose: "Main controller with WiFi" },
      { name: "PIR Motion Sensor (HC-SR501)", quantity: 1, approx_price_inr: 65, purpose: "Detect motion" },
      { name: "Active Buzzer", quantity: 1, approx_price_inr: 20, purpose: "Sound alarm" },
      { name: "LED (Red)", quantity: 1, approx_price_inr: 5, purpose: "Visual alert" },
      { name: "Resistor 220Ω", quantity: 1, approx_price_inr: 2, purpose: "LED current limiting" },
      { name: "Breadboard", quantity: 1, approx_price_inr: 80, purpose: "Prototyping" },
      { name: "Jumper Wires", quantity: 6, approx_price_inr: 30, purpose: "Connections" },
    ],
    wiring_table: [
      { component: "PIR OUT", pin_connection: "Signal", controller_pin: "GPIO 13" },
      { component: "PIR VCC", pin_connection: "Power", controller_pin: "VIN (5V)" },
      { component: "PIR GND", pin_connection: "Ground", controller_pin: "GND" },
      { component: "Buzzer +", pin_connection: "Signal", controller_pin: "GPIO 25" },
      { component: "Buzzer -", pin_connection: "Ground", controller_pin: "GND" },
      { component: "LED Anode", pin_connection: "Via 220Ω resistor", controller_pin: "GPIO 26" },
      { component: "LED Cathode", pin_connection: "Ground", controller_pin: "GND" },
    ],
    firmware_starter_code: `// PIR Motion Detector with Buzzer
#define PIR_PIN 13
#define BUZZER_PIN 25
#define LED_PIN 26

bool motionDetected = false;

void setup() {
  Serial.begin(115200);
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_PIN, LOW);
  
  Serial.println("PIR Motion Detector Ready!");
  Serial.println("Warming up sensor (30s)...");
  delay(30000); // PIR needs warm-up time
  Serial.println("System ARMED!");
}

void loop() {
  int pirValue = digitalRead(PIR_PIN);
  
  if (pirValue == HIGH && !motionDetected) {
    motionDetected = true;
    Serial.println("⚠ MOTION DETECTED!");
    
    // Trigger alarm
    digitalWrite(LED_PIN, HIGH);
    for (int i = 0; i < 5; i++) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(200);
      digitalWrite(BUZZER_PIN, LOW);
      delay(200);
    }
    digitalWrite(LED_PIN, LOW);
  }
  
  if (pirValue == LOW) {
    motionDetected = false;
  }
  
  delay(100);
}`,
    build_steps: [
      "Wire PIR sensor output to GPIO 13, power to VIN",
      "Connect buzzer to GPIO 25 and GND",
      "Connect LED with resistor to GPIO 26",
      "Upload firmware via Arduino IDE",
      "Wait 30 seconds for PIR warm-up",
      "Wave your hand in front of PIR — buzzer should beep!",
    ],
    beginner_tips: [
      "PIR sensor needs 30-60 seconds to calibrate on startup",
      "Adjust PIR sensitivity and delay with the two orange potentiometers on the module",
      "PIR works best for detecting warm bodies (humans, animals)",
      "Keep PIR away from heat sources and direct sunlight",
    ],
    upgrade_suggestions: [
      "Send Telegram notification on motion detection",
      "Add an OLED display showing detection count and time",
      "Add a camera module (ESP32-CAM) to capture images",
      "Create a web dashboard with detection history",
      "Add multiple PIR zones with different alerts",
    ],
  }),

  "agriculture": () => ({
    project_summary: {
      title: "Automatic Plant Watering System",
      description: "Monitor soil moisture and automatically water plants when soil is dry. Includes manual override via button and status display on OLED.",
      category: "Agriculture & Farming",
      difficulty: "Beginner",
      estimated_cost_inr: 750,
      estimated_build_time: "2-3 hours",
      recommended_controller: "Arduino Uno",
    },
    components: [
      { name: "Arduino Uno", quantity: 1, approx_price_inr: 250, purpose: "Main controller" },
      { name: "Soil Moisture Sensor", quantity: 1, approx_price_inr: 50, purpose: "Detect soil dryness" },
      { name: "5V Mini Water Pump", quantity: 1, approx_price_inr: 100, purpose: "Water the plants" },
      { name: "Relay Module (Single)", quantity: 1, approx_price_inr: 50, purpose: "Switch pump ON/OFF" },
      { name: "Silicone Tube (1m)", quantity: 1, approx_price_inr: 40, purpose: "Water delivery" },
      { name: "0.96\" OLED Display", quantity: 1, approx_price_inr: 150, purpose: "Show moisture level" },
      { name: "Push Button", quantity: 1, approx_price_inr: 5, purpose: "Manual water override" },
      { name: "Breadboard + Wires", quantity: 1, approx_price_inr: 100, purpose: "Prototyping" },
    ],
    wiring_table: [
      { component: "Soil Sensor AO", pin_connection: "Analog Signal", controller_pin: "A0" },
      { component: "Soil Sensor VCC", pin_connection: "Power", controller_pin: "5V" },
      { component: "Relay IN", pin_connection: "Signal", controller_pin: "D7" },
      { component: "Relay VCC", pin_connection: "Power", controller_pin: "5V" },
      { component: "Water Pump", pin_connection: "Via Relay NO/COM", controller_pin: "External 5V supply" },
      { component: "OLED SDA", pin_connection: "Data", controller_pin: "A4 (SDA)" },
      { component: "OLED SCL", pin_connection: "Clock", controller_pin: "A5 (SCL)" },
      { component: "Button", pin_connection: "Signal", controller_pin: "D2 (with pull-up)" },
    ],
    firmware_starter_code: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

#define SOIL_PIN A0
#define RELAY_PIN 7
#define BUTTON_PIN 2

// Threshold — adjust based on your soil sensor
#define DRY_THRESHOLD 600  // Higher = drier

bool pumpOn = false;

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  digitalWrite(RELAY_PIN, HIGH); // Relay OFF
  
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED failed!");
    while (1);
  }
  
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("Plant Watering System");
  display.println("Ready!");
  display.display();
  delay(2000);
}

void loop() {
  int moisture = analogRead(SOIL_PIN);
  bool buttonPressed = (digitalRead(BUTTON_PIN) == LOW);
  
  // Auto water if soil is dry
  if (moisture > DRY_THRESHOLD || buttonPressed) {
    pumpOn = true;
    digitalWrite(RELAY_PIN, LOW); // Pump ON
  } else {
    pumpOn = false;
    digitalWrite(RELAY_PIN, HIGH); // Pump OFF
  }
  
  // Update display
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("=== Plant Monitor ===");
  display.println();
  display.print("Moisture: ");
  display.println(moisture);
  display.print("Status: ");
  display.println(moisture > DRY_THRESHOLD ? "DRY!" : "OK");
  display.print("Pump: ");
  display.println(pumpOn ? "ON" : "OFF");
  
  // Progress bar for moisture
  int barWidth = map(moisture, 0, 1023, 0, 100);
  display.drawRect(0, 54, 128, 10, WHITE);
  display.fillRect(0, 54, map(barWidth, 0, 100, 0, 128), 10, WHITE);
  display.display();
  
  Serial.printf("Moisture: %d | Pump: %s\\n", moisture, pumpOn ? "ON" : "OFF");
  delay(1000);
}`,
    build_steps: [
      "Install Arduino IDE (no additional board manager needed for Uno)",
      "Install Adafruit SSD1306 and Adafruit GFX libraries",
      "Wire soil moisture sensor analog output to A0",
      "Connect relay module to D7, wire pump through relay",
      "Connect OLED to I2C pins (A4, A5)",
      "Wire push button to D2 with internal pull-up",
      "Upload code, insert soil sensor into a plant pot",
      "Adjust DRY_THRESHOLD based on your readings (check Serial Monitor)",
    ],
    beginner_tips: [
      "Calibrate the threshold: read values from wet and dry soil first",
      "Use a separate 5V power supply for the pump — don't power it from Arduino",
      "Soil moisture sensors corrode over time — consider capacitive sensors for longevity",
      "Add a delay after watering to let water absorb before re-reading",
    ],
    upgrade_suggestions: [
      "Switch to ESP32 and add WiFi monitoring via Blynk",
      "Add multiple soil sensors for different plants",
      "Log moisture data to SD card or cloud",
      "Add a water level sensor in the reservoir",
      "Create a scheduled watering system with RTC module",
    ],
  }),
};

function matchCategory(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("home") || lower.includes("light") || lower.includes("fan") || lower.includes("switch") || lower.includes("automat")) return "home_automation";
  if (lower.includes("weather") || lower.includes("temperature") || lower.includes("humid") || lower.includes("environment") || lower.includes("air") || lower.includes("monitor")) return "environmental_monitoring";
  if (lower.includes("security") || lower.includes("motion") || lower.includes("intrude") || lower.includes("alarm") || lower.includes("surveillance") || lower.includes("door")) return "security";
  if (lower.includes("plant") || lower.includes("water") || lower.includes("soil") || lower.includes("farm") || lower.includes("agri") || lower.includes("garden")) return "agriculture";
  return "home_automation"; // default
}

export function generateBlueprint(input: GuidedInput): ProjectBlueprint {
  const key = matchCategory(input.category + " " + input.project_goal);
  const template = TEMPLATES[key] || TEMPLATES["home_automation"];
  const blueprint = template();
  
  // Override difficulty if specified
  blueprint.project_summary.difficulty = input.difficulty_preference;
  
  // Budget adjustment note
  if (input.budget && input.budget < blueprint.project_summary.estimated_cost_inr) {
    blueprint.beginner_tips.unshift(
      `Note: Your budget of ₹${input.budget} is below the estimated ₹${blueprint.project_summary.estimated_cost_inr}. Consider sourcing components from local markets for better prices.`
    );
  }
  
  return blueprint;
}

export function generateBlueprintFromText(text: string): ProjectBlueprint {
  const key = matchCategory(text);
  const template = TEMPLATES[key] || TEMPLATES["home_automation"];
  return template();
}
