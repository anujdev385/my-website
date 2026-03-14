/* Three.js लाइब्रेरी import कर रहे हैं
यह पूरी 3D engine library है जिससे scene, camera, object आदि बनते हैं */
import * as THREE from "three";

/* GLTFLoader import कर रहे हैं
इसका उपयोग .glb या .gltf 3D model load करने के लिए होता है */
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* नया 3D scene बना रहे हैं
scene को 3D world समझ सकते हैं जिसमें objects, lights और camera होते हैं */
const scene = new THREE.Scene();

/* scene का background color white कर रहे हैं
इससे पूरी screen का background सफेद दिखेगा */
scene.background = new THREE.Color(0xffffff);

/* perspective camera बना रहे हैं
camera को viewer की आँख समझ सकते हैं */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

/* camera को z axis पर पीछे रख रहे हैं
इससे object camera से थोड़ी दूरी पर दिखाई देगा */
camera.position.z = 4;

/* WebGL renderer बना रहे हैं
यह scene और camera को combine करके browser में draw करता है */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

/* renderer का size screen के बराबर कर रहे हैं */
renderer.setSize(window.innerWidth, window.innerHeight);

/* pixel ratio set कर रहे हैं
इससे retina screens पर rendering sharp दिखती है */
renderer.setPixelRatio(window.devicePixelRatio);

/* renderer का canvas HTML body में add कर रहे हैं */
document.body.appendChild(renderer.domElement);

/* hemisphere light बना रहे हैं
यह soft lighting देती है जिससे model realistic दिखता है */
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);

/* light को scene में add कर रहे हैं */
scene.add(light);

/* flower model store करने के लिए variable */
let flower;

/* flower के लिए parent group बना रहे हैं
यह pivot control और rotation के लिए उपयोग होगा */
let flowerGroup = new THREE.Group();

/* group को scene में add कर रहे हैं */
scene.add(flowerGroup);

/* GLTF loader create कर रहे हैं */
const loader = new GLTFLoader();

/* rose.glb model load कर रहे हैं */
loader.load("./models/rose.glb", (gltf) => {
  /* loaded model को flower variable में store कर रहे हैं */
  flower = gltf.scene;

  /* model का bounding box calculate कर रहे हैं */
  const box = new THREE.Box3().setFromObject(flower);

  /* bounding box का center point निकाल रहे हैं */
  const center = box.getCenter(new THREE.Vector3());

  /* model को center में shift कर रहे हैं */
  flower.position.sub(center);

  /* model का size निकाल रहे हैं */
  const size = box.getSize(new THREE.Vector3());

  /* flower model को group के अंदर add कर रहे हैं */
  flowerGroup.add(flower);

  /* flower को नीचे shift कर रहे हैं ताकि rotation top pivot से हो */
  flower.position.y -= size.y / 2;

  /* flower का initial scale set कर रहे हैं */
  flower.scale.set(1.6, 1.6, 1.6);

  /* 🔥 initial position bottom पर रख रहे हैं */
  flowerGroup.position.set(0, -2, 0);
});

/* animation function बना रहे हैं */
function animate() {
  requestAnimationFrame(animate);

  if (flower) {
    /* page कितना scroll हुआ है */
    const scrollY = window.scrollY;

    /* page का total scrollable height */
    const maxScroll = document.body.scrollHeight - window.innerHeight;

    /* scroll को percentage में convert */
    const scrollPercent = scrollY / maxScroll;

    /* scroll के अनुसार flower rotate होगा */
    flowerGroup.rotation.x = (scrollPercent * Math.PI) / 2;

    flowerGroup.rotation.y = scrollPercent * Math.PI * 1.5;

    /* scroll के अनुसार flower पीछे जाएगा */
    flowerGroup.position.z = -scrollPercent * 2;

    /* 🔥 bottom से center move होगा */

    const startY = -2; // bottom
    const endY = 0; // center

    flowerGroup.position.y =
      startY + (endY - startY) * scrollPercent;

    /* scroll के अनुसार flower का size बढ़ेगा */

    const minScale = 1.6;
    const maxScale = 5.5;

    const scale = minScale + (maxScale - minScale) * scrollPercent;

    flower.scale.set(scale, scale, scale);

    /* camera distance */

    const startCameraZ = 4;
    const endCameraZ = 4;

    camera.position.z =
      startCameraZ + (endCameraZ - startCameraZ) * scrollPercent;
  }

  /* scene को render कर रहे हैं */
  renderer.render(scene, camera);
}

/* animation start */
animate();

/* window resize होने पर camera और renderer update */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});