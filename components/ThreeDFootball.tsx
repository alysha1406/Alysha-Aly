
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeDFootball: React.FC<{ size?: number }> = ({ size = 300 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create a football-like geometry (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    
    // Custom material with wireframe to look like ball panels
    const material = new THREE.MeshPhongMaterial({
      color: 0xff4b1f,
      wireframe: false,
      flatShading: true,
      shininess: 100,
    });
    
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x1d4ed8,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    const ball = new THREE.Mesh(geometry, material);
    const wireframe = new THREE.Mesh(geometry, wireMaterial);
    wireframe.scale.set(1.01, 1.01, 1.01);
    
    const ballGroup = new THREE.Group();
    ballGroup.add(ball);
    ballGroup.add(wireframe);
    scene.add(ballGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      ballGroup.rotation.y += 0.005;
      ballGroup.rotation.x += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      wireMaterial.dispose();
      renderer.dispose();
    };
  }, [size]);

  return <div ref={mountRef} className="cursor-grab active:cursor-grabbing hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_30px_rgba(255,75,31,0.4)]" />;
};

export default ThreeDFootball;
