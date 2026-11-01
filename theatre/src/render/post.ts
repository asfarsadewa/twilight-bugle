import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { Pass } from 'three/examples/jsm/postprocessing/Pass.js';

// The camera's eye, in order:
//   ambient occlusion   contact shadow where a flat meets the floor and where layers stand close
//   depth of field      a miniature's shallow focus: the backcloth and the audience soften a little
//   bloom               lamps, flames and gold leaf glow
//   grade               vignette, warmth, fine grain (seeded by frame, so a video and a live view match)
// Light beams, particles and strings carry userData.noAO. They stay out of the occlusion and depth passes,
// so a beam of light never casts a dark halo.

const Grade = {
  uniforms: { tDiffuse: { value: null }, frame: { value: 0 }, vignette: { value: 0.5 }, grain: { value: 0.018 }, warmth: { value: 0.035 } },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float frame, vignette, grain, warmth; varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + frame * 0.618) * 43758.5453); }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 d = vUv - 0.5; d.x *= 1.25;
      c.rgb *= mix(1.0, smoothstep(0.85, 0.2, length(d)), vignette);
      c.rgb += vec3(warmth, warmth * 0.4, -warmth * 0.6) * c.rgb;
      c.rgb += (hash(vUv * 1000.0) - 0.5) * grain;
      gl_FragColor = c;
    }`,
};

/** Runs a pass with every noAO object hidden. */
function excluding(scene: THREE.Scene, pass: Pass) {
  const render = pass.render.bind(pass);
  pass.render = (...args: Parameters<Pass['render']>) => {
    const hidden: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if (o.userData.noAO && o.visible) {
        o.visible = false;
        hidden.push(o);
      }
    });
    render(...args);
    for (const o of hidden) o.visible = true;
  };
}

export class Post {
  readonly composer: EffectComposer;
  readonly bloom: UnrealBloomPass;
  private grade: ShaderPass;
  private bokeh: BokehPass;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, w: number, h: number) {
    this.composer = new EffectComposer(renderer);
    this.composer.setPixelRatio(renderer.getPixelRatio());
    this.composer.addPass(new RenderPass(scene, camera));
    const ao = new GTAOPass(scene, camera, w, h);
    ao.blendIntensity = 0.9;
    ao.updateGtaoMaterial({ radius: 0.3, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: 16 });
    ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, rings: 2, samples: 16 });
    excluding(scene, ao);
    this.composer.addPass(ao);
    this.bokeh = new BokehPass(scene, camera, { focus: 7, aperture: 0.0005, maxblur: 0.004 });
    excluding(scene, this.bokeh);
    this.composer.addPass(this.bokeh);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.55, 0.9);
    this.composer.addPass(this.bloom);
    this.grade = new ShaderPass(Grade);
    this.composer.addPass(this.grade);
    this.composer.addPass(new OutputPass());
    this.composer.setSize(w, h);
  }

  setSize(w: number, h: number) {
    this.composer.setSize(w, h);
  }

  /** Focus distance in world units from the camera, and the aperture (0 is pin sharp). */
  focus(distance: number, aperture: number) {
    const u = this.bokeh.uniforms as Record<string, { value: number }>;
    u.focus!.value = distance;
    u.aperture!.value = aperture;
  }

  render(frame: number) {
    this.grade.uniforms.frame!.value = frame % 997;
    this.composer.render();
  }
}
