const compatibilityMap = {
  //Ye red-cell transfusion compatibility ke context me hai. Plasma compatibility alag hoti hai. BloodConnect ke current donor-matching use case me hum whole-blood/red-cell donation matching model kar rahe hain.
  
  "A+": ["A+", "AB+"],
  "A-": ["A+", "A-", "AB+", "AB-"],

  "B+": ["B+", "AB+"],
  "B-": ["B+", "B-", "AB+", "AB-"],

  "AB+": ["AB+"],
  "AB-": ["AB+", "AB-"],

  "O+": ["O+", "A+", "B+", "AB+"],
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

const isBloodCompatible = (donorGroup, recipientGroup) => {
  return compatibilityMap[donorGroup]?.includes(recipientGroup) || false;
};

module.exports = { isBloodCompatible };
