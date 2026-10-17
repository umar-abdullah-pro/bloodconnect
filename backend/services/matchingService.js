const DonorProfile = require("../models/DonorProfile");
const Donation = require("../models/Donation");
const { isBloodCompatible } = require("../utils/bloodCompatibility");
const { calculateDonorPriority } = require("../utils/donorPriority");

const findMatchingDonors = async (
  bloodGroup,
  latitude,
  longitude,
  requesterId,
  maxDistance = 10000,
) => {
  const donors = await DonorProfile.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        distanceField: "distanceInMeters",
        maxDistance,
        spherical: true,
        query: {
          isAvailable: true,
          userId: { $ne: requesterId },
        },
      },
    },
  ]);

  const compatibleDonors = donors.filter((donor) =>
    isBloodCompatible(donor.bloodGroup, bloodGroup),
  );

  const donorsWithPriority = await Promise.all(
    compatibleDonors.map(async (donor) => {
      const latestDonation = await Donation.findOne({
        donorId: donor.userId,
      }).sort({
        donationDate: -1,
      });

      const distanceInKm = donor.distanceInMeters / 1000;

      const priorityScore = calculateDonorPriority({
        distanceInKm,
        latestDonationDate: latestDonation?.donationDate || null,
      });

      return {
        donorId: donor._id,
        bloodGroup: donor.bloodGroup,
        distanceInKm: Number(distanceInKm.toFixed(2)),
        priorityScore,
      };
    }),
  );

  donorsWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);

  return donorsWithPriority.map(({ donorId, bloodGroup, distanceInKm }) => ({
    donorId,
    bloodGroup,
    distanceInKm,
  }));
};

module.exports = { findMatchingDonors };
