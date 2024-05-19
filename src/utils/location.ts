// Caculate distance between 2 points

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

// Location 1: 21.006217, 105.726428
// Location 2: 21.005547867033712, 105.73163705997749

// const distance = calculateDistance(
//   21.006217,
//   105.726428,
//   21.005547867033712,
//   105.73163705997749
// );

// console.log(distance); // 0.5 km
