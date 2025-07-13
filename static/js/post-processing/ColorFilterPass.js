// ColorFilterPass.js
THREE.ColorFilterPass = function () {
  this.uniforms = {
    tDiffuse: { value: null },
    pink: { value: new THREE.Vector3(1.0, 0.0, 1.0) },   // Pink RGB
    darkBlue: { value: new THREE.Vector3(0.0, 0.0, 0.545) } // Dark Blue RGB (RGB(0, 0, 139) normalized)
  };

  this.material = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec3 pink;
      uniform vec3 darkBlue;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        // Check if the pixel color closely matches pink
        if (distance(color.rgb, pink) < 0.1) { // Adjustable threshold
          color.rgb = darkBlue;  // Change pink to dark blue
        }
        gl_FragColor = color;
      }
    `
  });
};

// Inherit from Pass
THREE.ColorFilterPass.prototype = Object.create(THREE.Pass.prototype);
THREE.ColorFilterPass.prototype.constructor = THREE.ColorFilterPass;

THREE.ColorFilterPass.prototype.render = function (renderer, writeBuffer, readBuffer, delta) {
  this.uniforms.tDiffuse.value = readBuffer;
  renderer.render(this.scene, this.camera, this.renderToScreen ? undefined : writeBuffer);
};
