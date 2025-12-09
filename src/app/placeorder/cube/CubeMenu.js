'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls, Edges, useCursor } from '@react-three/drei';
import * as THREE from 'three';

// --- Components ---

const MenuItemList = ({ items, color }) => {
  return (
    <group position={[-0.8, 0.6, 0.02]}>
      {items.slice(0, 5).map((item, i) => (
        <group key={item.id} position={[0, -i * 0.25, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            maxWidth={1.2}
            // Removed custom font to prevent loading errors
          >
            {item.name}
          </Text>
          <Text
            position={[1.5, 0, 0]}
            fontSize={0.12}
            color={color}
            anchorX="right"
            anchorY="middle"
          >
            {item.price}
          </Text>
        </group>
      ))}
      {items.length > 5 && (
        <Text
          position={[0, -1.4, 0]}
          fontSize={0.1}
          color={color}
          anchorX="left"
          anchorY="middle"
        >
          + {items.length - 5} more...
        </Text>
      )}
    </group>
  );
};

const CategoryPanel = ({ category, menuItems, position, rotation, onClick, isHovered, onHover, onUnhover }) => {
  const meshRef = useRef();
  
  // Neon Colors
  const neonCyan = '#00f3ff';
  const neonPink = '#ff00ff';
  
  const isActive = isHovered;
  const mainColor = isActive ? neonPink : neonCyan;

  useFrame((state) => {
    if (meshRef.current) {
      const targetZ = isActive ? 0.2 : 0;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(category);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(category);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onUnhover();
        }}
      >
        <boxGeometry args={[1.9, 1.9, 0.05]} />
        {/* Robust Standard Material */}
        <meshStandardMaterial
          color="#0a0a1a"
          emissive={mainColor}
          emissiveIntensity={isActive ? 0.3 : 0.1}
          roughness={0.2}
          metalness={0.8}
        />
        
        {/* Wireframe Edges */}
        <Edges
          scale={1}
          threshold={15}
          color={mainColor}
          renderOrder={1000}
        >
          <meshBasicMaterial transparent opacity={1} toneMapped={false} linewidth={2} />
        </Edges>
      </mesh>

      {/* Decoration Line */}
      <group position={[0, 0, 0.04]}>
         <mesh position={[0, 0.8, 0]}>
            <planeGeometry args={[1.8, 0.02]} />
            <meshBasicMaterial color={mainColor} opacity={0.8} transparent />
         </mesh>
      </group>

      {/* Content */}
      <group position={[0, 0, 0.06]}>
        <group position={[-0.8, 0.6, 0]}>
          <Text
            fontSize={0.2}
            color={mainColor}
            anchorX="left"
            anchorY="middle"
            fontWeight="bold"
            // Removed custom font
          >
            {category.toUpperCase()}
          </Text>
        </group>

        <MenuItemList items={menuItems} color={mainColor} />
      </group>
    </group>
  );
};

const ExpandedMenu = ({ categories, menu, onCategorySelect }) => {
  const groupRef = useRef();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  useCursor(!!hoveredCategory);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle float
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const getCategoryItems = (category) => {
    return menu.filter(item => item.category === category);
  };

  const displayCategories = useMemo(() => {
    const cats = categories || []; // Safety check
    const sliced = cats.slice(0, 6);
    while (sliced.length < 6) sliced.push(null);
    return sliced;
  }, [categories]);

  // Curved Wall Layout
  const panels = [
    { pos: [-2.1, 1.05, 0.4], rot: [0, 0.25, 0] },
    { pos: [0, 1.05, 0], rot: [0, 0, 0] },
    { pos: [2.1, 1.05, 0.4], rot: [0, -0.25, 0] },
    { pos: [-2.1, -1.05, 0.4], rot: [0, 0.25, 0] },
    { pos: [0, -1.05, 0], rot: [0, 0, 0] },
    { pos: [2.1, -1.05, 0.4], rot: [0, -0.25, 0] },
  ];

  return (
    <Float floatIntensity={0.2} rotationIntensity={0.1} speed={1}>
      <group ref={groupRef}>
        {panels.map((layout, index) => {
          const category = displayCategories[index];
          if (!category) return null;

          return (
            <CategoryPanel
              key={category}
              category={category}
              menuItems={getCategoryItems(category)}
              position={layout.pos}
              rotation={layout.rot}
              onClick={onCategorySelect}
              isHovered={hoveredCategory === category}
              onHover={setHoveredCategory}
              onUnhover={() => setHoveredCategory(null)}
            />
          );
        })}
      </group>
    </Float>
  );
};

const CubeMenu = ({ categories, menu, onCategorySelect }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Safety check for data
  if (!categories || categories.length === 0) {
    return (
        <div style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>
            No categories available to display.
        </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '600px',
      position: 'relative',
      background: '#050510',
      overflow: 'hidden'
    }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7], fov: 45 }}
      >
        <color attach="background" args={['#050510']} />
        
        {/* Strong Lighting */}
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        <pointLight position={[0, 0, 5]} intensity={1} color="#ffffff" />

        <ExpandedMenu
          categories={categories}
          menu={menu}
          onCategorySelect={onCategorySelect}
        />

        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: '#00f3ff',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          textShadow: '0 0 10px #00f3ff'
        }}>
          Menu Wall
        </h1>
      </div>
    </div>
  );
};

export default CubeMenu;
