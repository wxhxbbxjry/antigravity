import { GpsShape, GpsShapeKey } from './types';

// Helper to generate smooth parametric heart points
function generateHeartPoints(samples: number = 36): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * 2 * Math.PI;
    const rawX = 16 * Math.pow(Math.sin(t), 3);
    const rawY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    // rawX ranges [-16, 16], rawY ranges [-17, 12]
    // Normalized to [-0.48, 0.48] and centered
    const x = (rawX / 16) * 0.46;
    const y = ((rawY + 2.5) / 16) * 0.46;
    points.push([Number(x.toFixed(4)), Number(y.toFixed(4))]);
  }
  return points;
}

// 5-pointed star
function generateStarPoints(): [number, number][] {
  const points: [number, number][] = [];
  const numPoints = 10;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i * (360 / numPoints) - 90) * (Math.PI / 180);
    const r = i % 2 === 0 ? 0.48 : 0.21;
    const x = r * Math.cos(angle);
    const y = -r * Math.sin(angle); // flip so top point is up
    points.push([Number(x.toFixed(4)), Number(y.toFixed(4))]);
  }
  return points;
}

// Isometric Cube / 3D Box wireframe path
const CUBE_POINTS: [number, number][] = [
  [0, 0],         // Center
  [0, -0.44],     // Bottom center
  [0.40, -0.22],  // Bottom right
  [0.40, 0.22],   // Top right
  [0, 0.44],      // Top center
  [-0.40, 0.22],  // Top left
  [-0.40, -0.22], // Bottom left
  [0, -0.44],     // Bottom center (hexagon closed)
  [0, 0],         // Back to center
  [0, 0.44],      // Up to top center
  [0, 0],         // Center
  [0.40, 0.22],   // To top right
  [0, 0],         // Center
  [-0.40, 0.22],  // To top left
];

// Stylized Cat silhouette outline
const CAT_POINTS: [number, number][] = [
  [-0.10, 0.20],  // Top of head between ears
  [-0.22, 0.42],  // Left ear tip
  [-0.26, 0.22],  // Left ear base
  [-0.34, 0.12],  // Left cheek
  [-0.28, 0.00],  // Neck left
  [-0.32, -0.20], // Arched back
  [-0.26, -0.42], // Rear rump
  [-0.15, -0.44], // Tail base
  [-0.05, -0.32], // Tail curve up
  [0.05, -0.20],  // Tail mid
  [0.18, -0.15],  // Tail curl tip
  [0.10, -0.26],  // Tail return
  [-0.02, -0.44], // Base under tail
  [0.08, -0.44],  // Rear paw
  [0.15, -0.24],  // Underbelly
  [0.22, -0.44],  // Front paw
  [0.24, -0.20],  // Front chest
  [0.26, 0.05],   // Chin / snout
  [0.34, 0.16],   // Right cheek
  [0.24, 0.24],   // Right ear base
  [0.20, 0.44],   // Right ear tip
  [0.08, 0.22],   // Right ear inner
  [-0.10, 0.20],  // Closed head
];

// Stylized Dog outline
const DOG_POINTS: [number, number][] = [
  [0.38, 0.18],   // Snout nose
  [0.22, 0.26],   // Forehead
  [0.12, 0.44],   // Top floppy ear
  [0.04, 0.22],   // Ear back
  [-0.08, 0.18],  // Neck collar
  [-0.30, 0.20],  // Back
  [-0.44, 0.38],  // Tail tip up
  [-0.42, 0.22],  // Tail base
  [-0.38, -0.10], // Hind quarter
  [-0.36, -0.42], // Back foot
  [-0.24, -0.40], // Back leg front
  [-0.12, -0.15], // Belly
  [0.08, -0.18],  // Chest lower
  [0.12, -0.42],  // Front foot
  [0.20, -0.40],  // Front foot back
  [0.22, -0.05],  // Chest front
  [0.32, 0.06],   // Jaw lower
  [0.38, 0.18],   // Snout closed
];

// Royal Crown
const CROWN_POINTS: [number, number][] = [
  [-0.40, -0.30], // Bottom left
  [0.40, -0.30],  // Bottom right
  [0.44, 0.05],   // Right flank
  [0.46, 0.35],   // Right peak
  [0.22, 0.10],   // Right valley
  [0.00, 0.45],   // Center high peak
  [-0.22, 0.10],  // Left valley
  [-0.46, 0.35],  // Left peak
  [-0.44, 0.05],  // Left flank
  [-0.40, -0.30], // Closed base
  [-0.35, -0.22], // Jewel detail base line
  [0.35, -0.22],
];

export const GPS_SHAPES: Record<GpsShapeKey, GpsShape> = {
  heart: {
    id: 'heart',
    name: 'Love / Heart',
    category: 'Romantic & Celebration',
    description: 'Bentuk hati klasik nan romantis. Sempurna untuk lari Valentine atau persembahan cinta.',
    iconName: 'Heart',
    points: generateHeartPoints(36),
  },
  star: {
    id: 'star',
    name: '5-Point Star',
    category: 'Achievement',
    description: 'Bintang 5 sudut tegas dan simetris. Lambang pencapaian & energi prima.',
    iconName: 'Star',
    points: generateStarPoints(),
  },
  cube: {
    id: 'cube',
    name: '3D Isometric Cube',
    category: 'Geometric & Tech',
    description: 'Kubus isometrik 3D bervolume nyata di atas jalanan kota.',
    iconName: 'Box',
    points: CUBE_POINTS,
  },
  cat: {
    id: 'cat',
    name: 'Cute Cat',
    category: 'Animals',
    description: 'Kucing lucu dengan telinga runcing dan ekor meliuk.',
    iconName: 'Footprints',
    points: CAT_POINTS,
  },
  dog: {
    id: 'dog',
    name: 'Playful Dog',
    category: 'Animals',
    description: 'Anjing pelari setia dengan moncong dan ekor bergoyang riang.',
    iconName: 'Footprints',
    points: DOG_POINTS,
  },
  crown: {
    id: 'crown',
    name: 'Champion Crown',
    category: 'Victory',
    description: 'Mahkota juara lari 3 mahkota untuk merayakan Personal Best (PB).',
    iconName: 'Sparkles',
    points: CROWN_POINTS,
  },
};
