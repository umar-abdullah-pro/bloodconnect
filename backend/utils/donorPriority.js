const calculateDonorPriority = ({ distanceInKm, latestDonationDate }) => {
  let score = 0;

  // Closer donors get higher priority
  if (distanceInKm <= 2) {
    score += 50;
  } else if (distanceInKm <= 5) {
    score += 40;
  } else if (distanceInKm <= 10) {
    score += 30;
  }

  // Donation history priority
  if (!latestDonationDate) {
    score += 20;
  } else {
    const daysSinceDonation =
      (Date.now() - new Date(latestDonationDate).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysSinceDonation >= 120) {
      score += 30;
    } else if (daysSinceDonation >= 90) {
      score += 20;
    } else if (daysSinceDonation >= 60) {
      score += 10;
    }
  }

  return score;
};

module.exports = { calculateDonorPriority };
