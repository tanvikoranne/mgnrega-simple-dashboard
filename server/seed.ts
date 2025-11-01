import { db } from "./db";
import { districts, monthlyPerformance, alerts } from "@shared/schema";
import { sql } from "drizzle-orm";

const maharashtraDistricts = [
  { name: "Mumbai", nameMarathi: "मुंबई", code: "MUM", lat: "19.0760", lon: "72.8777" },
  { name: "Pune", nameMarathi: "पुणे", code: "PUN", lat: "18.5204", lon: "73.8567" },
  { name: "Nagpur", nameMarathi: "नागपूर", code: "NAG", lat: "21.1458", lon: "79.0882" },
  { name: "Thane", nameMarathi: "ठाणे", code: "THA", lat: "19.2183", lon: "72.9781" },
  { name: "Nashik", nameMarathi: "नाशिक", code: "NAS", lat: "19.9975", lon: "73.7898" },
  { name: "Aurangabad", nameMarathi: "औरंगाबाद", code: "AUR", lat: "19.8762", lon: "75.3433" },
  { name: "Solapur", nameMarathi: "सोलापूर", code: "SOL", lat: "17.6599", lon: "75.9064" },
  { name: "Amravati", nameMarathi: "अमरावती", code: "AMR", lat: "20.9333", lon: "77.7500" },
  { name: "Kolhapur", nameMarathi: "कोल्हापूर", code: "KOL", lat: "16.7050", lon: "74.2433" },
  { name: "Nanded", nameMarathi: "नांदेड", code: "NAN", lat: "19.1383", lon: "77.3210" },
  { name: "Sangli", nameMarathi: "सांगली", code: "SAN", lat: "16.8540", lon: "74.5626" },
  { name: "Jalgaon", nameMarathi: "जळगाव", code: "JAL", lat: "21.0077", lon: "75.5626" },
  { name: "Ahmednagar", nameMarathi: "अहमदनगर", code: "AHM", lat: "19.0948", lon: "74.7480" },
  { name: "Akola", nameMarathi: "अकोला", code: "AKO", lat: "20.7002", lon: "77.0082" },
  { name: "Latur", nameMarathi: "लातूर", code: "LAT", lat: "18.4088", lon: "76.5604" },
  { name: "Dhule", nameMarathi: "धुळे", code: "DHU", lat: "20.9015", lon: "74.7774" },
  { name: "Jalna", nameMarathi: "जालना", code: "JAA", lat: "19.8397", lon: "75.8770" },
  { name: "Parbhani", nameMarathi: "परभणी", code: "PAR", lat: "19.2704", lon: "76.7749" },
  { name: "Satara", nameMarathi: "सातारा", code: "SAT", lat: "17.6805", lon: "74.0183" },
  { name: "Raigad", nameMarathi: "रायगड", code: "RAI", lat: "18.5167", lon: "73.1833" },
  { name: "Ratnagiri", nameMarathi: "रत्नागिरी", code: "RAT", lat: "16.9902", lon: "73.3120" },
  { name: "Sindhudurg", nameMarathi: "सिंधुदुर्ग", code: "SIN", lat: "16.0000", lon: "73.6667" },
  { name: "Beed", nameMarathi: "बीड", code: "BEE", lat: "18.9894", lon: "75.7607" },
  { name: "Buldhana", nameMarathi: "बुलढाणा", code: "BUL", lat: "20.5333", lon: "76.1833" },
  { name: "Chandrapur", nameMarathi: "चंद्रपूर", code: "CHA", lat: "19.9615", lon: "79.2961" },
  { name: "Gadchiroli", nameMarathi: "गडचिरोली", code: "GAD", lat: "20.1809", lon: "80.0032" },
  { name: "Gondia", nameMarathi: "गोंदिया", code: "GON", lat: "21.4560", lon: "80.1952" },
  { name: "Hingoli", nameMarathi: "हिंगोली", code: "HIN", lat: "19.7167", lon: "77.1500" },
  { name: "Osmanabad", nameMarathi: "उस्मानाबाद", code: "OSM", lat: "18.1767", lon: "76.0407" },
  { name: "Wardha", nameMarathi: "वर्धा", code: "WAR", lat: "20.7453", lon: "78.5973" },
  { name: "Washim", nameMarathi: "वाशिम", code: "WAS", lat: "20.1167", lon: "77.1333" },
  { name: "Yavatmal", nameMarathi: "यवतमाळ", code: "YAV", lat: "20.3897", lon: "78.1307" },
  { name: "Bhandara", nameMarathi: "भंडारा", code: "BHA", lat: "21.1704", lon: "79.6500" },
  { name: "Nandurbar", nameMarathi: "नंदुरबार", code: "NAND", lat: "21.3667", lon: "74.2333" },
  { name: "Palghar", nameMarathi: "पालघर", code: "PAL", lat: "19.6967", lon: "72.7653" },
  { name: "Mumbai Suburban", nameMarathi: "मुंबई उपनगर", code: "MUMSUB", lat: "19.1136", lon: "72.9083" },
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDecimal(min: number, max: number, decimals = 2): string {
  return (Math.random() * (max - min) + min).toFixed(decimals);
}

function getMonth(monthsAgo: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

async function seed() {
  console.log("Starting database seed...");

  console.log("Clearing existing data...");
  await db.delete(alerts);
  await db.delete(monthlyPerformance);
  await db.delete(districts);

  console.log("Inserting districts...");
  const insertedDistricts = await db
    .insert(districts)
    .values(
      maharashtraDistricts.map(d => ({
        name: d.name,
        nameMarathi: d.nameMarathi,
        code: d.code,
        latitude: d.lat,
        longitude: d.lon,
      }))
    )
    .returning();

  console.log(`Inserted ${insertedDistricts.length} districts`);

  console.log("Generating 12 months of performance data for each district...");
  const performanceData = [];
  
  for (const district of insertedDistricts) {
    const baseWorkers = getRandomInt(30000, 120000);
    const basePersonDays = baseWorkers * getRandomInt(30, 90);
    const baseWages = basePersonDays * 300;
    const baseAssets = getRandomInt(200, 800);
    const baseJobCards = Math.floor(baseWorkers * 1.8);

    for (let i = 11; i >= 0; i--) {
      const month = getMonth(i);
      const variance = 1 + (Math.random() * 0.4 - 0.2);
      
      performanceData.push({
        districtId: district.id,
        month,
        workersEmployed: Math.floor(baseWorkers * variance),
        personDaysGenerated: Math.floor(basePersonDays * variance),
        wagesPaid: getRandomDecimal(baseWages * variance * 0.9, baseWages * variance * 1.1),
        assetsCreated: Math.floor(baseAssets * variance),
        workCompletionRate: getRandomDecimal(60, 95),
        activeJobCards: Math.floor(baseJobCards * variance),
        averageWageDays: getRandomInt(25, 85),
      });
    }
  }

  await db.insert(monthlyPerformance).values(performanceData);
  console.log(`Inserted ${performanceData.length} performance records`);

  console.log("Generating sample alerts...");
  const alertData = [];
  
  for (let i = 0; i < 5; i++) {
    const randomDistrict = insertedDistricts[getRandomInt(0, insertedDistricts.length - 1)];
    
    alertData.push({
      districtId: randomDistrict.id,
      type: i % 3 === 0 ? "wage_delay" : "performance_drop",
      severity: i % 2 === 0 ? "critical" : "warning",
      title: i % 3 === 0 ? "Wage Payment Delayed" : "Employment Drop Detected",
      titleMarathi: i % 3 === 0 ? "वेतन देयकात विलंब" : "रोजगारात घट आढळली",
      description: i % 3 === 0 
        ? "Wage payments have been delayed by more than 30 days" 
        : "Employment numbers have dropped by more than 20% compared to last month",
      descriptionMarathi: i % 3 === 0
        ? "वेतन देयकात 30 दिवसांपेक्षा जास्त विलंब झाला आहे"
        : "मागील महिन्याच्या तुलनेत रोजगार संख्येत 20% पेक्षा जास्त घट झाली आहे",
      affectedMetric: i % 3 === 0 ? "Wages Paid" : "Workers Employed",
      value: i % 3 === 0 ? "35 days delay" : "-22%",
      isActive: i < 3 ? 1 : 0,
    });
  }

  await db.insert(alerts).values(alertData);
  console.log(`Inserted ${alertData.length} alerts`);

  console.log("Database seed completed successfully!");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
