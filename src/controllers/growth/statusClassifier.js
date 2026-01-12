/**
 * Status Classifier
 * Klasifikasi status gizi berdasarkan Z-Score WHO
 */

/**
 * Status untuk BB/U (Berat Badan menurut Umur)
 */
function classifyWeightForAge(zScore) {
    if (zScore === null) return { status: 'Tidak dapat dihitung', severity: 'unknown', color: 'gray' };

    if (zScore < -3) {
        return { status: 'Gizi Buruk', severity: 'severe', color: 'red', description: 'Berat badan sangat kurang' };
    } else if (zScore >= -3 && zScore < -2) {
        return { status: 'Gizi Kurang', severity: 'moderate', color: 'orange', description: 'Berat badan kurang' };
    } else if (zScore >= -2 && zScore <= 2) {
        return { status: 'Normal', severity: 'normal', color: 'green', description: 'Berat badan normal' };
    } else {
        return { status: 'Gizi Lebih', severity: 'excess', color: 'yellow', description: 'Berat badan berlebih untuk usianya' };
    }
}

/**
 * Status untuk TB/U (Tinggi Badan menurut Umur) - STUNTING
 */
function classifyHeightForAge(zScore) {
    if (zScore === null) return { status: 'Tidak dapat dihitung', severity: 'unknown', color: 'gray' };

    if (zScore < -3) {
        return { status: 'Sangat Pendek (Severely Stunted)', severity: 'severe', color: 'red', description: 'Stunting berat - perlu penanganan segera' };
    } else if (zScore >= -3 && zScore < -2) {
        return { status: 'Pendek (Stunted)', severity: 'moderate', color: 'orange', description: 'Stunting - perlu perhatian gizi' };
    } else if (zScore >= -2 && zScore <= 2) {
        return { status: 'Normal', severity: 'normal', color: 'green', description: 'Tinggi badan normal sesuai usia' };
    } else if (zScore > 2 && zScore <= 3) {
        return { status: 'Tinggi', severity: 'normal', color: 'blue', description: 'Tinggi badan di atas rata-rata' };
    } else {
        return { status: 'Sangat Tinggi', severity: 'normal', color: 'blue', description: 'Tinggi badan sangat di atas rata-rata' };
    }
}

/**
 * Status untuk BB/TB (Berat Badan menurut Tinggi Badan) - WASTING/OBESITY
 */
function classifyWeightForHeight(zScore) {
    if (zScore === null) return { status: 'Tidak dapat dihitung', severity: 'unknown', color: 'gray' };

    if (zScore < -3) {
        return { status: 'Sangat Kurus (Severely Wasted)', severity: 'severe', color: 'red', description: 'Gizi buruk akut - perlu penanganan segera' };
    } else if (zScore >= -3 && zScore < -2) {
        return { status: 'Kurus (Wasted)', severity: 'moderate', color: 'orange', description: 'Gizi kurang akut' };
    } else if (zScore >= -2 && zScore <= 1) {
        return { status: 'Normal', severity: 'normal', color: 'green', description: 'Proporsi berat dan tinggi badan normal' };
    } else if (zScore > 1 && zScore <= 2) {
        return { status: 'Risiko Gizi Lebih', severity: 'risk', color: 'yellow', description: 'Berisiko kelebihan berat badan' };
    } else if (zScore > 2 && zScore <= 3) {
        return { status: 'Gizi Lebih (Overweight)', severity: 'excess', color: 'orange', description: 'Kelebihan berat badan' };
    } else {
        return { status: 'Obesitas', severity: 'severe', color: 'red', description: 'Obesitas - perlu penanganan' };
    }
}

/**
 * Status untuk LK/U (Lingkar Kepala menurut Umur)
 */
function classifyHeadCircumferenceForAge(zScore) {
    if (zScore === null) return { status: 'Tidak dapat dihitung', severity: 'unknown', color: 'gray' };

    if (zScore < -3) {
        return { status: 'Mikrosefali Berat', severity: 'severe', color: 'red', description: 'Lingkar kepala sangat kecil - konsultasi dokter' };
    } else if (zScore >= -3 && zScore < -2) {
        return { status: 'Mikrosefali', severity: 'moderate', color: 'orange', description: 'Lingkar kepala kecil - perlu pemantauan' };
    } else if (zScore >= -2 && zScore <= 2) {
        return { status: 'Normal', severity: 'normal', color: 'green', description: 'Lingkar kepala normal' };
    } else if (zScore > 2 && zScore <= 3) {
        return { status: 'Makrosefali', severity: 'moderate', color: 'orange', description: 'Lingkar kepala besar - perlu pemantauan' };
    } else {
        return { status: 'Makrosefali Berat', severity: 'severe', color: 'red', description: 'Lingkar kepala sangat besar - konsultasi dokter' };
    }
}

/**
 * Klasifikasi semua indikator
 */
function classifyAllIndicators(indicators) {
    return {
        weightForAge: classifyWeightForAge(indicators.weightForAge?.zScore),
        heightForAge: classifyHeightForAge(indicators.heightForAge?.zScore),
        weightForHeight: classifyWeightForHeight(indicators.weightForHeight?.zScore),
        headCircumferenceForAge: classifyHeadCircumferenceForAge(indicators.headCircumferenceForAge?.zScore)
    };
}

/**
 * Tentukan status pertumbuhan keseluruhan berdasarkan prioritas klinis
 * Prioritas: 1. Stunting (TB/U) 2. Wasting/Obesity (BB/TB) 3. BB/U 4. LK/U
 */
function determineOverallStatus(classifications) {
    // Cek stunting dulu (prioritas tertinggi)
    if (classifications.heightForAge.severity === 'severe') {
        return {
            overallStatus: 'Masalah Pertumbuhan Berat',
            priority: 'high',
            mainIssue: 'Stunting Berat',
            color: 'red',
            recommendation: 'Segera konsultasi ke dokter atau puskesmas untuk penanganan stunting'
        };
    }

    if (classifications.heightForAge.severity === 'moderate') {
        return {
            overallStatus: 'Perlu Perhatian',
            priority: 'medium',
            mainIssue: 'Stunting',
            color: 'orange',
            recommendation: 'Perhatikan asupan gizi dan konsultasi ke posyandu atau puskesmas'
        };
    }

    // Cek wasting/obesity
    if (classifications.weightForHeight.severity === 'severe') {
        const issue = classifications.weightForHeight.status.includes('Kurus') ? 'Gizi Buruk Akut' : 'Obesitas';
        return {
            overallStatus: 'Masalah Berat Badan Serius',
            priority: 'high',
            mainIssue: issue,
            color: 'red',
            recommendation: issue === 'Obesitas'
                ? 'Atur pola makan dan aktivitas fisik, konsultasi ke dokter'
                : 'Segera konsultasi ke dokter untuk penanganan gizi buruk'
        };
    }

    if (classifications.weightForHeight.severity === 'moderate' || classifications.weightForHeight.severity === 'excess') {
        return {
            overallStatus: 'Perlu Penyesuaian',
            priority: 'medium',
            mainIssue: classifications.weightForHeight.status,
            color: 'orange',
            recommendation: 'Perhatikan pola makan dan pantau secara berkala'
        };
    }

    // Cek BB/U
    if (classifications.weightForAge.severity === 'severe' || classifications.weightForAge.severity === 'moderate') {
        return {
            overallStatus: 'Perlu Perhatian Berat Badan',
            priority: 'medium',
            mainIssue: classifications.weightForAge.status,
            color: 'orange',
            recommendation: 'Tingkatkan asupan gizi dan pantau berat badan secara teratur'
        };
    }

    // Cek LK/U
    if (classifications.headCircumferenceForAge.severity === 'severe' || classifications.headCircumferenceForAge.severity === 'moderate') {
        return {
            overallStatus: 'Perlu Pemantauan Lingkar Kepala',
            priority: 'medium',
            mainIssue: classifications.headCircumferenceForAge.status,
            color: 'orange',
            recommendation: 'Konsultasi ke dokter untuk pemeriksaan lebih lanjut'
        };
    }

    // Semua normal
    return {
        overallStatus: 'Pertumbuhan Normal',
        priority: 'low',
        mainIssue: null,
        color: 'green',
        recommendation: 'Pertahankan pola makan sehat dan pantau pertumbuhan secara berkala di posyandu'
    };
}

/**
 * Generate rekomendasi detail berdasarkan klasifikasi
 */
function generateRecommendations(classifications) {
    const recommendations = [];

    // Stunting recommendations
    if (classifications.heightForAge.severity === 'severe' || classifications.heightForAge.severity === 'moderate') {
        recommendations.push({
            area: 'Tinggi Badan',
            priority: 'high',
            actions: [
                'Berikan makanan tinggi protein (telur, ikan, daging, tahu, tempe)',
                'Pastikan asupan kalsium dan vitamin D cukup',
                'Stimulasi aktivitas fisik sesuai usia',
                'Konsultasi dengan petugas kesehatan'
            ]
        });
    }

    // Wasting recommendations
    if (classifications.weightForHeight.severity === 'severe' || classifications.weightForHeight.severity === 'moderate') {
        if (classifications.weightForHeight.status.includes('Kurus')) {
            recommendations.push({
                area: 'Berat Badan',
                priority: 'high',
                actions: [
                    'Tingkatkan frekuensi makan (5-6x sehari dalam porsi kecil)',
                    'Berikan makanan padat gizi',
                    'Tambahkan minyak/mentega pada makanan',
                    'Berikan PMT (Pemberian Makanan Tambahan)'
                ]
            });
        }
    }

    // Overweight/Obesity recommendations  
    if (classifications.weightForHeight.severity === 'excess' ||
        (classifications.weightForHeight.severity === 'severe' && classifications.weightForHeight.status.includes('Obesitas'))) {
        recommendations.push({
            area: 'Berat Badan',
            priority: 'medium',
            actions: [
                'Kurangi makanan tinggi gula dan lemak',
                'Tingkatkan konsumsi sayur dan buah',
                'Batasi makanan olahan dan fast food',
                'Ajak anak bermain aktif setiap hari'
            ]
        });
    }

    // Head circumference recommendations
    if (classifications.headCircumferenceForAge.severity === 'severe' || classifications.headCircumferenceForAge.severity === 'moderate') {
        recommendations.push({
            area: 'Lingkar Kepala',
            priority: 'medium',
            actions: [
                'Konsultasi ke dokter anak',
                'Pantau perkembangan secara rutin',
                'Lakukan pemeriksaan neurologis jika diperlukan'
            ]
        });
    }

    // Jika semua normal
    if (recommendations.length === 0) {
        recommendations.push({
            area: 'Umum',
            priority: 'low',
            actions: [
                'Pertahankan pola makan seimbang',
                'Lanjutkan kunjungan rutin ke posyandu',
                'Pastikan imunisasi lengkap',
                'Berikan stimulasi perkembangan sesuai usia'
            ]
        });
    }

    return recommendations;
}

module.exports = {
    classifyWeightForAge,
    classifyHeightForAge,
    classifyWeightForHeight,
    classifyHeadCircumferenceForAge,
    classifyAllIndicators,
    determineOverallStatus,
    generateRecommendations
};
