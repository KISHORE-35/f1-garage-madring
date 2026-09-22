import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as MeshoptDecoder from 'three/addons/libs/meshopt_decoder.module.js';

/* ---------------- data ---------------- */
const MODEL_BASE =
  'https://huggingface.co/Kishorer75/f1-garage-madring/resolve/main';

const TEAMS = [
  {
    id:'ferrari',
    team:'SCUDERIA FERRARI',
    car:'SF-25',
    year:2025,
    file:`${MODEL_BASE}/ferrari_sf-25.glb`,
    color:'#e8002d',
    pu:'Ferrari 066/12',
    speed:'345 km/h',
    lap:'1:12.4'
  },

  {
    id:'mclaren',
    team:'McLAREN',
    car:'MCL39',
    year:2025,
    file:`${MODEL_BASE}/f1_2025_mclaren_mcl39.glb`,
    color:'#ff8000',
    pu:'Mercedes M16',
    speed:'348 km/h',
    lap:'1:11.9'
  },

  {
    id:'mercedes',
    team:'MERCEDES-AMG',
    car:'W14',
    year:2023,
    file:`${MODEL_BASE}/2023_mercedes_f1_car.glb`,
    color:'#00a19b',
    pu:'Mercedes M14',
    speed:'342 km/h',
    lap:'1:13.1'
  },

  {
    id:'redbull',
    team:'RED BULL RACING',
    car:'RB22',
    year:2026,
    file:`${MODEL_BASE}/2026_red_bull_racing_rb22.glb`,
    color:'#3671c6',
    pu:'Honda RBPT',
    speed:'351 km/h',
    lap:'1:11.2'
  },

  {
    id:'aston',
    team:'ASTON MARTIN',
    car:'AMR26',
    year:2026,
    file:`${MODEL_BASE}/2026_aston_martin_amr26.glb`,
    color:'#229971',
    pu:'Honda RBPT',
    speed:'344 km/h',
    lap:'1:12.8'
  },

  {
    id:'williams',
    team:'WILLIAMS RACING',
    car:'FW48',
    year:2026,
    file:`${MODEL_BASE}/2026_williams_fw48.glb`,
    color:'#005a7b',
    pu:'Mercedes M17',
    speed:'346 km/h',
    lap:'1:12.2'
  },

  {
    id:'haas',
    team:'HAAS F1 TEAM',
    car:'VF-26',
    year:2026,
    file:`${MODEL_BASE}/2026_haas_vf-26.glb`,
    color:'#b6babd',
    pu:'Ferrari 066/13',
    speed:'341 km/h',
    lap:'1:13.6'
  }
];

const CIRCUIT =
  `${MODEL_BASE}/circuito_de_madring_2026_layout.glb`;

/*
 * Centerline generated from the actual TarmacDark.001 asphalt mesh
 * in the uploaded Madring GLB.
 *
 * IMPORTANT:
 * The GLB already contains the required axis conversion in its
 * own node hierarchy. Do NOT rotate circuit here.
 */
const TRACK_CENTERLINE = [
  new THREE.Vector3(-182.232, -6.912, 899.064),
  new THREE.Vector3(-206.329, -6.597, 899.064),
  new THREE.Vector3(-229.525, -6.310, 896.888),
  new THREE.Vector3(-251.819, -6.032, 892.535),
  new THREE.Vector3(-272.452, -5.767, 884.170),
  new THREE.Vector3(-290.557, -5.489, 869.699),
  new THREE.Vector3(-304.521, -5.211, 851.387),
  new THREE.Vector3(-317.459, -4.934, 832.651),
  new THREE.Vector3(-329.884, -4.642, 813.702),
  new THREE.Vector3(-341.796, -4.354, 794.540),
  new THREE.Vector3(-354.061, -4.056, 775.524),
  new THREE.Vector3(-366.133, -3.770, 756.429),
  new THREE.Vector3(-378.045, -3.475, 737.268),
  new THREE.Vector3(-390.471, -3.184, 718.319),
  new THREE.Vector3(-402.677, -2.894, 699.279),
  new THREE.Vector3(-414.808, -2.603, 680.208),
  new THREE.Vector3(-427.233, -2.312, 661.259),
  new THREE.Vector3(-439.658, -2.021, 642.310),
  new THREE.Vector3(-451.570, -1.731, 623.148),
  new THREE.Vector3(-463.629, -1.440, 604.047),
  new THREE.Vector3(-475.394, -1.152, 584.825),
  new THREE.Vector3(-487.575, -0.877, 565.774),
  new THREE.Vector3(-499.219, -0.608, 546.501),
  new THREE.Vector3(-511.520, -0.336, 527.501),
  new THREE.Vector3(-523.130, -0.040, 508.214),
  new THREE.Vector3(-534.442, 0.297, 488.804),
  new THREE.Vector3(-544.815, 0.751, 469.005),
  new THREE.Vector3(-552.155, 1.344, 447.949),
  new THREE.Vector3(-558.379, 1.927, 426.430),
  new THREE.Vector3(-571.017, 2.283, 407.994),
  new THREE.Vector3(-576.101, 2.581, 386.004),
  new THREE.Vector3(-579.729, 2.845, 363.410),
  new THREE.Vector3(-582.631, 3.109, 340.515),
  new THREE.Vector3(-585.534, 3.337, 317.621),
  new THREE.Vector3(-586.259, 3.589, 293.824),
  new THREE.Vector3(-586.259, 3.837, 270.329),
  new THREE.Vector3(-584.207, 4.081, 247.082),
  new THREE.Vector3(-581.180, 4.326, 224.239),
  new THREE.Vector3(-576.101, 4.564, 202.247),
  new THREE.Vector3(-570.296, 4.800, 180.555),
  new THREE.Vector3(-562.721, 5.033, 159.596),
  new THREE.Vector3(-554.913, 5.277, 138.734),
  new THREE.Vector3(-546.350, 5.509, 118.185),
  new THREE.Vector3(-539.820, 5.723, 96.793),
  new THREE.Vector3(-529.950, 5.910, 76.785),
  new THREE.Vector3(-530.387, 6.339, 56.716),
  new THREE.Vector3(-537.820, 6.639, 35.699),
  new THREE.Vector3(-540.545, 6.714, 12.731),
  new THREE.Vector3(-547.076, 6.721, -8.660),
  new THREE.Vector3(-554.575, 6.724, -29.650),
  new THREE.Vector3(-562.896, 6.716, -50.300),
  new THREE.Vector3(-573.198, 6.568, -70.128),
  new THREE.Vector3(-583.357, 6.535, -90.016),
  new THREE.Vector3(-593.516, 7.099, -109.904),
  new THREE.Vector3(-603.363, 8.628, -129.922),
  new THREE.Vector3(-610.658, 10.383, -150.996),
  new THREE.Vector3(-616.414, 12.186, -172.708),
  new THREE.Vector3(-621.815, 13.942, -194.568),
  new THREE.Vector3(-626.894, 15.355, -216.560),
  new THREE.Vector3(-632.656, 16.518, -238.270),
  new THREE.Vector3(-637.778, 17.133, -260.245),
  new THREE.Vector3(-628.298, 16.920, -276.032),
  new THREE.Vector3(-612.684, 15.304, -292.413),
  new THREE.Vector3(-607.302, 13.539, -314.281),
  new THREE.Vector3(-611.656, 12.626, -336.574),
  new THREE.Vector3(-621.754, 12.446, -356.487),
  new THREE.Vector3(-631.973, 12.382, -376.350),
  new THREE.Vector3(-639.955, 12.326, -397.140),
  new THREE.Vector3(-642.132, 12.293, -420.335),
  new THREE.Vector3(-642.132, 12.259, -444.432),
  new THREE.Vector3(-642.132, 12.017, -468.529),
  new THREE.Vector3(-642.132, 11.700, -492.626),
  new THREE.Vector3(-642.132, 11.356, -516.723),
  new THREE.Vector3(-642.132, 10.990, -540.820),
  new THREE.Vector3(-642.132, 10.617, -564.917),
  new THREE.Vector3(-641.406, 10.231, -588.714),
  new THREE.Vector3(-641.406, 9.824, -612.811),
  new THREE.Vector3(-641.406, 9.412, -636.908),
  new THREE.Vector3(-641.406, 8.978, -661.005),
  new THREE.Vector3(-640.681, 8.534, -684.801),
  new THREE.Vector3(-640.681, 8.080, -708.898),
  new THREE.Vector3(-639.955, 7.628, -732.694),
  new THREE.Vector3(-638.504, 7.193, -756.190),
  new THREE.Vector3(-637.390, 6.761, -779.826),
  new THREE.Vector3(-634.876, 6.150, -802.881),
  new THREE.Vector3(-630.522, 5.332, -825.174),
  new THREE.Vector3(-623.713, 4.790, -846.450),
  new THREE.Vector3(-614.559, 4.428, -866.754),
  new THREE.Vector3(-603.480, 4.033, -886.261),
  new THREE.Vector3(-588.436, 3.591, -904.125),
  new THREE.Vector3(-570.598, 3.151, -919.132),
  new THREE.Vector3(-551.219, 2.713, -930.525),
  new THREE.Vector3(-530.140, 2.256, -937.814),
  new THREE.Vector3(-507.743, 1.875, -941.920),
  new THREE.Vector3(-483.947, 1.454, -942.645),
  new THREE.Vector3(-461.051, 1.039, -939.744),
  new THREE.Vector3(-439.665, 0.606, -933.197),
  new THREE.Vector3(-419.862, 0.350, -922.830),
  new THREE.Vector3(-401.757, 0.336, -908.359),
  new THREE.Vector3(-386.042, 0.540, -891.198),
  new THREE.Vector3(-374.130, 0.835, -872.036),
  new THREE.Vector3(-366.396, 1.076, -851.143),
  new THREE.Vector3(-362.043, 1.350, -828.850),
  new THREE.Vector3(-361.317, 1.713, -805.054),
  new THREE.Vector3(-364.220, 2.014, -782.159),
  new THREE.Vector3(-368.573, 2.025, -759.866),
  new THREE.Vector3(-375.829, 1.681, -738.775),
  new THREE.Vector3(-385.262, 1.537, -718.587),
  new THREE.Vector3(-398.657, 1.503, -700.039),
  new THREE.Vector3(-413.134, 1.590, -681.940),
  new THREE.Vector3(-427.098, 1.853, -663.629),
  new THREE.Vector3(-441.576, 2.263, -645.530),
  new THREE.Vector3(-456.373, 2.758, -627.564),
  new THREE.Vector3(-471.556, 3.318, -609.757),
  new THREE.Vector3(-485.520, 4.075, -591.446),
  new THREE.Vector3(-500.510, 5.110, -573.559),
  new THREE.Vector3(-514.474, 6.332, -555.248),
  new THREE.Vector3(-529.464, 7.550, -537.361),
  new THREE.Vector3(-543.428, 8.805, -519.050),
  new THREE.Vector3(-557.392, 9.878, -500.738),
  new THREE.Vector3(-575.108, 10.289, -487.381),
  new THREE.Vector3(-586.259, 10.346, -467.904),
  new THREE.Vector3(-588.436, 10.252, -445.310),
  new THREE.Vector3(-580.817, 10.136, -424.370),
  new THREE.Vector3(-564.164, 8.622, -408.448),
  new THREE.Vector3(-545.635, 7.093, -395.003),
  new THREE.Vector3(-525.618, 5.848, -385.148),
  new THREE.Vector3(-506.239, 4.855, -373.755),
  new THREE.Vector3(-487.498, 4.082, -360.823),
  new THREE.Vector3(-469.076, 3.425, -347.118),
  new THREE.Vector3(-449.589, 3.067, -335.985),
  new THREE.Vector3(-438.233, 3.025, -316.593),
  new THREE.Vector3(-435.330, 3.566, -293.698),
  new THREE.Vector3(-438.233, 4.402, -270.804),
  new THREE.Vector3(-438.233, 5.586, -246.707),
  new THREE.Vector3(-438.233, 7.123, -222.610),
  new THREE.Vector3(-438.233, 8.605, -198.513),
  new THREE.Vector3(-437.507, 10.025, -174.717),
  new THREE.Vector3(-434.605, 11.027, -151.822),
  new THREE.Vector3(-427.348, 11.396, -130.731),
  new THREE.Vector3(-416.464, 11.605, -111.144),
  new THREE.Vector3(-401.400, 11.615, -94.138),
  new THREE.Vector3(-383.807, 11.448, -79.458),
  new THREE.Vector3(-364.429, 10.896, -68.061),
  new THREE.Vector3(-343.423, 9.796, -60.598),
  new THREE.Vector3(-320.828, 8.084, -56.971),
  new THREE.Vector3(-297.332, 6.118, -55.520),
  new THREE.Vector3(-273.235, 4.487, -55.520),
  new THREE.Vector3(-249.138, 2.758, -55.520),
  new THREE.Vector3(-225.041, 1.105, -55.520),
  new THREE.Vector3(-201.544, 0.031, -56.971),
  new THREE.Vector3(-178.806, -0.711, -60.253),
  new THREE.Vector3(-156.955, -1.557, -65.676),
  new THREE.Vector3(-135.261, -2.741, -71.479),
  new THREE.Vector3(-116.783, -3.315, -64.262),
  new THREE.Vector3(-106.436, -3.663, -44.452),
  new THREE.Vector3(-99.368, -3.595, -23.283),
  new THREE.Vector3(-88.768, -3.560, -3.578),
  new THREE.Vector3(-76.874, -3.531, 15.591),
  new THREE.Vector3(-65.457, -3.503, 34.958),
  new THREE.Vector3(-54.058, -3.474, 54.332),
  new THREE.Vector3(-42.145, -3.446, 73.494),
  new THREE.Vector3(-28.181, -3.417, 91.805),
  new THREE.Vector3(-10.289, -3.357, 106.789),
  new THREE.Vector3(11.426, -3.810, 112.540),
  new THREE.Vector3(34.417, -4.342, 110.318),
  new THREE.Vector3(56.133, -4.402, 104.568),
  new THREE.Vector3(77.616, -4.471, 98.258),
  new THREE.Vector3(100.212, -4.543, 94.631),
  new THREE.Vector3(123.829, -4.618, 95.788),
  new THREE.Vector3(145.120, -4.689, 102.564),
  new THREE.Vector3(164.993, -4.756, 112.765),
  new THREE.Vector3(182.516, -4.810, 127.615),
  new THREE.Vector3(196.179, -4.864, 145.626),
  new THREE.Vector3(205.392, -4.917, 165.906),
  new THREE.Vector3(211.197, -4.972, 187.598),
  new THREE.Vector3(214.986, -5.025, 210.125),
  new THREE.Vector3(218.454, -5.053, 232.785),
  new THREE.Vector3(222.395, -5.075, 255.250),
  new THREE.Vector3(226.099, -5.114, 277.812),
  new THREE.Vector3(230.064, -5.177, 300.266),
  new THREE.Vector3(233.692, -5.251, 322.860),
  new THREE.Vector3(237.320, -5.327, 345.454),
  new THREE.Vector3(241.674, -5.400, 367.747),
  new THREE.Vector3(245.302, -5.462, 390.341),
  new THREE.Vector3(249.349, -5.512, 412.761),
  new THREE.Vector3(253.283, -5.563, 435.228),
  new THREE.Vector3(255.460, -5.630, 458.423),
  new THREE.Vector3(269.343, -5.644, 470.276),
  new THREE.Vector3(288.722, -5.658, 458.882),
  new THREE.Vector3(306.763, -5.732, 444.258),
  new THREE.Vector3(327.692, -5.779, 436.609),
  new THREE.Vector3(351.052, -5.845, 434.828),
  new THREE.Vector3(374.848, -5.922, 434.103),
  new THREE.Vector3(398.345, -5.967, 434.103),
  new THREE.Vector3(420.504, -5.994, 438.783),
  new THREE.Vector3(430.335, -6.102, 458.807),
  new THREE.Vector3(435.414, -6.198, 480.799),
  new THREE.Vector3(439.768, -6.153, 503.092),
  new THREE.Vector3(443.396, -6.113, 525.686),
  new THREE.Vector3(447.750, -6.115, 547.979),
  new THREE.Vector3(451.378, -6.122, 570.573),
  new THREE.Vector3(455.666, -6.125, 592.893),
  new THREE.Vector3(459.360, -6.126, 615.460),
  new THREE.Vector3(463.713, -6.130, 637.753),
  new THREE.Vector3(468.067, -6.136, 660.047),
  new THREE.Vector3(471.695, -6.154, 682.641),
  new THREE.Vector3(474.598, -6.265, 705.535),
  new THREE.Vector3(475.195, -6.208, 728.602),
  new THREE.Vector3(455.003, -6.364, 738.032),
  new THREE.Vector3(433.009, -6.434, 743.110),
  new THREE.Vector3(411.615, -6.406, 743.835),
  new THREE.Vector3(387.819, -6.379, 744.560),
  new THREE.Vector3(364.623, -6.360, 746.736),
  new THREE.Vector3(341.751, -6.310, 749.696),
  new THREE.Vector3(320.634, -6.252, 756.892),
  new THREE.Vector3(298.340, -6.210, 761.244),
  new THREE.Vector3(276.045, -6.167, 765.596),
  new THREE.Vector3(253.450, -6.129, 769.223),
  new THREE.Vector3(230.855, -6.091, 772.850),
  new THREE.Vector3(208.560, -6.046, 777.202),
  new THREE.Vector3(185.965, -6.000, 780.829),
  new THREE.Vector3(163.370, -5.933, 784.456),
  new THREE.Vector3(140.786, -5.876, 788.109),
  new THREE.Vector3(118.433, -5.845, 792.320),
  new THREE.Vector3(95.885, -5.868, 796.061),
  new THREE.Vector3(77.569, -5.936, 806.942),
  new THREE.Vector3(54.373, -6.049, 809.118),
  new THREE.Vector3(30.984, -6.174, 810.828),
  new THREE.Vector3(7.993, -6.277, 813.501),
  new THREE.Vector3(-13.713, -6.318, 819.273),
  new THREE.Vector3(-36.008, -6.325, 823.625),
  new THREE.Vector3(-58.429, -6.314, 827.673),
  new THREE.Vector3(-80.898, -6.302, 831.605),
  new THREE.Vector3(-103.793, -6.332, 834.506),
  new THREE.Vector3(-126.989, -6.499, 835.231),
  new THREE.Vector3(-142.905, -6.614, 847.486),
  new THREE.Vector3(-138.552, -6.691, 869.779),
  new THREE.Vector3(-138.552, -6.815, 893.876),
  new THREE.Vector3(-159.036, -7.000, 898.338)
];

/* ---------------- renderer / scene ---------------- */
const app = document.getElementById('app');

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf4f6f8);
scene.fog = new THREE.Fog(0xf4f6f8, 60, 260);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  8000
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.495;
controls.enablePan = false;

/* ---------------- lights ---------------- */
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(6, 12, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);

scene.add(sun, sun.target);
scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe5ea, 0.5));

/* ---------------- studio ground ---------------- */
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(60, 64),
  new THREE.ShadowMaterial({ opacity:0.22 })
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

/* ---------------- loading ---------------- */
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

const barEl = document.querySelector('#bar i');
const msgEl = document.getElementById('loadmsg');

let loadedBytes = 0;
const TOTAL = 21 + 20.8;

function trackProgress(n) {
  loadedBytes = n;
  barEl.style.width =
    Math.min(99, (loadedBytes / TOTAL) * 100) + '%';
}

function loadGLB(url) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      resolve,
      e => trackProgress(
        loadedBytes + (e.total ? e.loaded / 1e6 : 0)
      ),
      reject
    );
  });
}

/* ---------------- state ---------------- */
const carGroup = new THREE.Group();
scene.add(carGroup);

let currentCar = null;
let currentTeam = TEAMS[0];

let circuit = null;
let tarmac = null;
let racingLine = null;
let racingLineObject = null;

let mode = 'studio';
let tLine = 0;

const TOUR_SPEED = 0.0034;

/* ---------------- reusable vectors ---------------- */
const tempTangent = new THREE.Vector3();
const tempForward = new THREE.Vector3();
const tempPoint = new THREE.Vector3();
const desiredCamera = new THREE.Vector3();
const desiredTarget = new THREE.Vector3();

/* ---------------- helpers ---------------- */
function prepModel(root, shadows = true) {
  root.traverse(o => {
    if (!o.isMesh) return;

    o.castShadow = shadows;
    o.receiveShadow = false;

    if (o.material?.map) {
      o.material.map.anisotropy = 8;
    }
  });
}

function groundCar(root) {
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());

  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= box.min.y;
}

function setCarTransformAt(t) {
  if (!racingLine || !currentCar) return;

  const p = racingLine.getPointAt(t, tempPoint);

  racingLine.getTangentAt(
    t,
    tempTangent
  );

  tempForward
    .copy(tempTangent)
    .setY(0)
    .normalize();

  carGroup.position.copy(p);

  carGroup.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    tempForward
  );

  currentCar.visible = true;
}

/* ---------------- cars ---------------- */
async function setCar(team) {
  currentTeam = team;

  document.querySelectorAll('#teams .team').forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.id === team.id
    );
  });

  iTeam.textContent = team.team;
  iCar.textContent = team.car;
  iYear.textContent = team.year;
  iPu.textContent = team.pu;
  iSpeed.textContent = team.speed;
  iLap.textContent = team.lap;

  document.documentElement.style.setProperty(
    '--accent',
    team.color
  );

  while (carGroup.children.length) {
    carGroup.remove(carGroup.children[0]);
  }

  const gltf = await loadGLB(team.file);

  currentCar = gltf.scene;

  prepModel(currentCar);
  groundCar(currentCar);

  carGroup.add(currentCar);
  carGroup.scale.setScalar(1);
  currentCar.visible = true;

  if (mode === 'track' || mode === 'tour') {
    setCarTransformAt(tLine);
  }
}

/* ---------------- circuit ---------------- */
async function loadCircuit() {
  msgEl.textContent = 'Loading Madring circuit…';

  const gltf = await loadGLB(CIRCUIT);

  circuit = gltf.scene;

  /*
   * Do NOT rotate the circuit here.
   * The uploaded GLB already carries its axis conversion.
   */
  circuit.position.set(0, 0, 0);
  circuit.rotation.set(0, 0, 0);
  circuit.scale.set(1, 1, 1);
  circuit.updateMatrixWorld(true);

  circuit.traverse(o => {
    if (!o.isMesh) return;

    const objectName = o.name || '';
    const materialName = o.material?.name || '';

    /*
     * Remove only the baked background plane.
     */
    if (
      /Background/i.test(objectName) ||
      /Background/i.test(materialName)
    ) {
      o.visible = false;
      return;
    }

    if (/TarmacDark/i.test(materialName)) {
      tarmac = o;
    }
  });

  prepModel(circuit, false);

  scene.add(circuit);
  circuit.visible = false;

  racingLine = new THREE.CatmullRomCurve3(
    TRACK_CENTERLINE,
    true,
    'centripetal',
    0.18
  );

  /*
   * Keep the racing line subtle and only show it
   * while touring the circuit.
   */
  const lineGeometry =
    new THREE.BufferGeometry().setFromPoints(
      racingLine.getPoints(1000)
    );

  const lineMaterial =
    new THREE.LineBasicMaterial({
      color: 0xe8002d,
      transparent: true,
      opacity: 0.60
    });

  racingLineObject =
    new THREE.Line(
      lineGeometry,
      lineMaterial
    );

  racingLineObject.visible = false;
  circuit.add(racingLineObject);

  iProg.style.width = '100%';
}

/* ---------------- camera ---------------- */
function placeTrackCamera() {
  if (!racingLine) return;

  const p = racingLine.getPointAt(
    tLine,
    tempPoint
  );

  racingLine.getTangentAt(
    tLine,
    tempTangent
  );

  tempForward
    .copy(tempTangent)
    .setY(0)
    .normalize();

  desiredCamera
    .copy(p)
    .addScaledVector(
      tempForward,
      -32
    )
    .add(
      new THREE.Vector3(
        0,
        12,
        0
      )
    );

  desiredTarget
    .copy(p)
    .add(
      new THREE.Vector3(
        0,
        1.8,
        0
      )
    );

  camera.position.copy(desiredCamera);
  controls.target.copy(desiredTarget);
}

/* ---------------- modes ---------------- */
function setMode(newMode) {
  mode = newMode;

  mStudio.classList.toggle(
    'active',
    newMode === 'studio'
  );

  mTrack.classList.toggle(
    'active',
    newMode === 'track'
  );

  mTour.classList.toggle(
    'active',
    newMode === 'tour'
  );

  controls.autoRotate = false;
  mAuto.classList.remove('active');

  if (racingLineObject) {
    racingLineObject.visible =
      newMode === 'tour';
  }

  if (newMode === 'studio') {
    if (circuit) circuit.visible = false;

    ground.visible = true;

    if (currentCar) {
      currentCar.visible = true;
    }

    carGroup.position.set(0, 0, 0);
    carGroup.quaternion.identity();
    carGroup.scale.setScalar(1);

    camera.position.set(
      6.5,
      3.2,
      7.5
    );

    controls.target.set(
      0,
      0.5,
      0
    );

    controls.maxDistance = 30;
    controls.minDistance = 3;

    scene.fog.near = 60;
    scene.fog.far = 260;

    return;
  }

  if (!circuit || !racingLine || !currentCar) return;

  circuit.visible = true;
  ground.visible = false;

  scene.fog.near = 1200;
  scene.fog.far = 5200;

  controls.maxDistance = 4000;
  controls.minDistance = 5;

  /*
   * Start at the selected track start position.
   */
  tLine = 0;

  setCarTransformAt(tLine);
  placeTrackCamera();
}

/* ---------------- buttons ---------------- */
mStudio.onclick = () =>
  setMode('studio');

mTrack.onclick = () =>
  setMode('track');

mTour.onclick = () =>
  setMode('tour');

mAuto.onclick = event => {
  /*
   * Auto rotate is useful for Studio only.
   */
  if (mode !== 'studio') return;

  controls.autoRotate =
    !controls.autoRotate;

  event.target.classList.toggle(
    'active',
    controls.autoRotate
  );
};

/* ---------------- team buttons ---------------- */
for (const team of TEAMS) {
  const button =
    document.createElement('button');

  button.className = 'team';
  button.dataset.id = team.id;

  button.innerHTML =
    `<span class="dot" style="background:${team.color}"></span>${team.team}`;

  button.onclick = () =>
    setCar(team);

  teams.appendChild(button);
}

/* ---------------- animation ---------------- */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const dt =
    clock.getDelta();

  if (
    mode === 'tour' &&
    racingLine &&
    currentCar
  ) {
    /*
     * Smooth complete-lap motion.
     * At this speed the car takes roughly 3 minutes
     * for a complete tour.
     */
    tLine =
      (tLine + dt * TOUR_SPEED) % 1;

    setCarTransformAt(tLine);

    racingLine.getTangentAt(
      tLine,
      tempTangent
    );

    tempForward
      .copy(tempTangent)
      .setY(0)
      .normalize();

    const p =
      racingLine.getPointAt(
        tLine,
        tempPoint
      );

    desiredCamera
      .copy(p)
      .addScaledVector(
        tempForward,
        -24
      )
      .add(
        new THREE.Vector3(
          0,
          8,
          0
        )
      );

    desiredTarget
      .copy(p)
      .add(
        new THREE.Vector3(
          0,
          1.7,
          0
        )
      );

    camera.position.lerp(
      desiredCamera,
      1 - Math.pow(0.001, dt)
    );

    controls.target.lerp(
      desiredTarget,
      1 - Math.pow(0.0005, dt)
    );
  }

  controls.update();

  renderer.render(
    scene,
    camera
  );
}

/* ---------------- resize ---------------- */
addEventListener(
  'resize',
  () => {
    camera.aspect =
      innerWidth / innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      innerWidth,
      innerHeight
    );
  }
);

/* ---------------- boot ---------------- */
(async () => {
  camera.position.set(
    6.5,
    3.2,
    7.5
  );

  controls.target.set(
    0,
    0.5,
    0
  );

  await setCar(
    TEAMS[0]
  );

  barEl.style.width =
    '35%';

  await loadCircuit();

  barEl.style.width =
    '100%';

  document
    .getElementById('loader')
    .classList.add('done');

  animate();
})();
