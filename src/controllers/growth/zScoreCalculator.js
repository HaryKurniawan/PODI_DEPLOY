/**
 * Z-Score Calculator
 * Perhitungan Z-Score berdasarkan standar WHO
 */

const whoData = require('./whoAnthroData');

/**
 * Hitung Z-Score menggunakan metode LMS WHO
 * Rumus: Z = ((value/M)^L - 1) / (L * S)
 * Untuk L mendekati 0: Z = ln(value/M) / S
 */
function calculateZScoreLMS(value, L, M, S) {
    if (Math.abs(L) < 0.01) {
        // L mendekati 0, gunakan rumus logaritmik
        return Math.log(value / M) / S;
    }
    return (Math.pow(value / M, L) - 1) / (L * S);
}

/**
 * Hitung usia dalam bulan dari tanggal lahir
 */
function calculateAgeInMonths(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();

    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months += today.getMonth() - birth.getMonth();

    // Adjust jika belum lewat tanggal lahir bulan ini
    if (today.getDate() < birth.getDate()) {
        months--;
    }

    return Math.max(0, months);
}

/**
 * Get reference data dengan interpolasi untuk umur tidak bulat
 */
function getReferenceData(data, age) {
    const floorAge = Math.floor(age);
    const ceilAge = Math.ceil(age);

    // Batasi di range 0-60
    const minAge = Math.max(0, Math.min(60, floorAge));
    const maxAge = Math.max(0, Math.min(60, ceilAge));

    if (minAge === maxAge || !data[maxAge]) {
        return data[minAge];
    }

    // Interpolasi linear
    const fraction = age - floorAge;
    const lower = data[minAge];
    const upper = data[maxAge];

    return {
        L: lower.L + (upper.L - lower.L) * fraction,
        M: lower.M + (upper.M - lower.M) * fraction,
        S: lower.S + (upper.S - lower.S) * fraction
    };
}

/**
 * Get reference data untuk BB/TB dengan interpolasi
 */
function getWeightForLengthReference(data, height) {
    const heights = Object.keys(data).map(Number).sort((a, b) => a - b);

    // Cari 2 titik terdekat
    let lower = heights[0];
    let upper = heights[heights.length - 1];

    for (let i = 0; i < heights.length - 1; i++) {
        if (height >= heights[i] && height <= heights[i + 1]) {
            lower = heights[i];
            upper = heights[i + 1];
            break;
        }
    }

    if (height <= lower) return data[lower];
    if (height >= upper) return data[upper];

    // Interpolasi
    const fraction = (height - lower) / (upper - lower);
    const lowerData = data[lower];
    const upperData = data[upper];

    return {
        L: lowerData.L + (upperData.L - lowerData.L) * fraction,
        M: lowerData.M + (upperData.M - lowerData.M) * fraction,
        S: lowerData.S + (upperData.S - lowerData.S) * fraction
    };
}

/**
 * Hitung Z-Score Berat Badan menurut Umur (BB/U)
 */
function calculateWeightForAge(weight, ageMonths, gender) {
    const data = gender === 'L' ? whoData.weightForAgeBoys : whoData.weightForAgeGirls;

    if (ageMonths > 60) {
        return { zScore: null, error: 'Usia di luar range (maks 60 bulan)' };
    }

    const ref = getReferenceData(data, ageMonths);
    const zScore = calculateZScoreLMS(weight, ref.L, ref.M, ref.S);

    return {
        zScore: Math.round(zScore * 100) / 100,
        median: ref.M,
        indicator: 'BB/U'
    };
}

/**
 * Hitung Z-Score Tinggi/Panjang Badan menurut Umur (TB/U atau PB/U)
 */
function calculateHeightForAge(height, ageMonths, gender) {
    const data = gender === 'L' ? whoData.heightForAgeBoys : whoData.heightForAgeGirls;

    if (ageMonths > 60) {
        return { zScore: null, error: 'Usia di luar range (maks 60 bulan)' };
    }

    const ref = getReferenceData(data, ageMonths);
    const zScore = calculateZScoreLMS(height, ref.L, ref.M, ref.S);

    return {
        zScore: Math.round(zScore * 100) / 100,
        median: ref.M,
        indicator: 'TB/U'
    };
}

/**
 * Hitung Z-Score Lingkar Kepala menurut Umur (LK/U)
 */
function calculateHeadCircumferenceForAge(hc, ageMonths, gender) {
    const data = gender === 'L' ? whoData.headCircumferenceForAgeBoys : whoData.headCircumferenceForAgeGirls;

    if (ageMonths > 60) {
        return { zScore: null, error: 'Usia di luar range (maks 60 bulan)' };
    }

    const ref = getReferenceData(data, ageMonths);
    const zScore = calculateZScoreLMS(hc, ref.L, ref.M, ref.S);

    return {
        zScore: Math.round(zScore * 100) / 100,
        median: ref.M,
        indicator: 'LK/U'
    };
}

/**
 * Hitung Z-Score Berat Badan menurut Panjang/Tinggi Badan (BB/TB)
 */
function calculateWeightForHeight(weight, height, gender) {
    const data = gender === 'L' ? whoData.weightForLengthBoys : whoData.weightForLengthGirls;

    if (height < 45 || height > 110) {
        return { zScore: null, error: 'Tinggi badan di luar range (45-110 cm)' };
    }

    const ref = getWeightForLengthReference(data, height);
    const zScore = calculateZScoreLMS(weight, ref.L, ref.M, ref.S);

    return {
        zScore: Math.round(zScore * 100) / 100,
        median: ref.M,
        indicator: 'BB/TB'
    };
}

/**
 * Hitung semua indikator sekaligus
 */
function calculateAllIndicators(weight, height, headCircumference, birthDate, gender) {
    const ageMonths = calculateAgeInMonths(birthDate);

    const weightForAge = calculateWeightForAge(weight, ageMonths, gender);
    const heightForAge = calculateHeightForAge(height, ageMonths, gender);
    const headCircumferenceForAge = calculateHeadCircumferenceForAge(headCircumference, ageMonths, gender);
    const weightForHeight = calculateWeightForHeight(weight, height, gender);

    return {
        ageMonths,
        indicators: {
            weightForAge,
            heightForAge,
            headCircumferenceForAge,
            weightForHeight
        }
    };
}

module.exports = {
    calculateZScoreLMS,
    calculateAgeInMonths,
    calculateWeightForAge,
    calculateHeightForAge,
    calculateHeadCircumferenceForAge,
    calculateWeightForHeight,
    calculateAllIndicators
};
