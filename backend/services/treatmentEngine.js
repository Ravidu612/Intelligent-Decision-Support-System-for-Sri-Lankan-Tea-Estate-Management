/**
 * Rule-based Treatment Recommendation Engine for Tea Leaf Diseases.
 */

const treatments = {
  "Anthracnose": {
    chemical: "Apply Copper fungicide or Mancozeb sprays at 10-14 day intervals.",
    organic: "Use Neem oil (1%) or Potassium Bicarbonate sprays.",
    prevention: "Improve airflow between plants and avoid overhead irrigation to reduce leaf wetness."
  },
  "Algal Leaf Spot": {
    chemical: "Apply Copper-based fungicides (e.g., Bordeaux mixture) twice a year.",
    organic: "Use Neem spray or horticultural oils to suppress algal growth.",
    prevention: "Reduce humidity by pruning and ensuring proper drainage in the field."
  },
  "Bird Eye Spot": {
    chemical: "Apply Carbendazim or Copper Oxychloride if infection is severe.",
    organic: "Use Garlic extract spray or fermented compost tea.",
    prevention: "Avoid overcrowding and maintain optimal nutrient balance (especially Nitrogen)."
  },
  "Blister Blight": {
    chemical: "Spray Hexaconazole or Propiconazole systemic fungicides during peak monsoon.",
    organic: "Limited organic options; focus on resistant clones if possible.",
    prevention: "Regular monitoring and early pruning of affected shoots to prevent spore spread."
  },
  "Grey Blight": {
    chemical: "Apply Mancozeb or Copper Oxychloride (0.25%) sprays.",
    organic: "Use Neem oil or Trichoderma-based bio-fungicides.",
    prevention: "Reduce leaf wetness and ensure quick drying by maintaining open canopy."
  },
  "Red Rust": {
    chemical: "Apply Copper fungicide sprays (0.3%) at the onset of rain.",
    organic: "Apply Lime sulfur spray or sulfur-based organic dust.",
    prevention: "Maintain balanced fertilization and improve soil health to boost plant immunity."
  },
  "Healthy": {
    chemical: "None required.",
    organic: "Continue regular maintenance.",
    prevention: "Maintain routine health checks and balanced nutrition."
  }
};

/**
 * Get recommendation based on disease and severity
 */
export const getTreatmentPlan = (disease, severity = "Low") => {
  const normalizedDisease = disease || "Healthy";
  const plan = treatments[normalizedDisease] || treatments["Healthy"];

  // Adjust wording based on severity if needed
  let severityNote = "";
  if (severity === "High") {
    severityNote = " [URGENT: IMMEDIATE ACTION REQUIRED]";
  } else if (severity === "Medium") {
    severityNote = " [ADVISORY: MONITOR CLOSELY]";
  }

  return {
    chemical: plan.chemical + severityNote,
    organic: plan.organic,
    prevention: plan.prevention
  };
};
