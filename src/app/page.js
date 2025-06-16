"use client"
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, CameraControls, Environment, useGLTF, ContactShadows, PerspectiveCamera, 
  axesHelper, KeyboardControls, useKeyboardControls, Box} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import gsap from 'gsap';
import Swal from 'sweetalert2'



function ClawModel({clawPos, isLowering, hasPrize}) {
  const clawModel = useGLTF(`claw.glb`);
  const clawModelRef = useRef();

  useFrame((state) => {
    if (clawModelRef.current) {
      
      clawModelRef.current.traverse((child) => {

        if (child.name === 'claw') {
          child.position.set(clawPos.x, clawPos.y, clawPos.z);
        }

        if(isLowering) return;

        if (child.name === 'clawBase') {
          child.position.set(clawPos.x, clawPos.y+0.15, clawPos.z);
        }

        if (child.name === 'track') {
          child.position.set(0.011943, clawPos.y+0.15, clawPos.z);
        }

        if (child.name === 'bear') {
          child.visible = hasPrize;
        }
      });
    }
  })
  
  return (
    <primitive
      ref={clawModelRef}
      object={clawModel.scene}
      scale={[0.6, 0.6, 0.6]}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  );
}


function Camera({setClawPos, boxRef, clawPos, isLowering, setIsLowering, hasPrize, setHasPrize}) {
  const cameraRef = useRef();
  
  //  [注意] useFrame and useKeyboardControls 都需要放在 Canvas 的子组件中
  
  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 1, 0);
    }
  });

  const [, getKeys] = useKeyboardControls();


  useFrame((state) => {
    const { forward, backward, left, right, jump } = getKeys();
    const speed = 0.01;
    const limitX = 0.4;
    const limitZ = 0.4;
    
    if (boxRef.current) {
      if(!isLowering){
        if (forward) {
          setClawPos({x: clawPos.x, y: clawPos.y, z: clawPos.z - speed});
        }
        if (backward) {
          setClawPos({x: clawPos.x, y: clawPos.y, z: clawPos.z + speed});
        }
        if (left) {
          setClawPos({x: clawPos.x - speed, y: clawPos.y, z: clawPos.z});
        }
        if (right) {
          setClawPos({x: clawPos.x + speed, y: clawPos.y, z: clawPos.z});
        }
  
        if (clawPos.x > limitX) {
          setClawPos({x: limitX, y: clawPos.y, z: clawPos.z});
        }
        if (clawPos.x < -limitX) {
          setClawPos({x: -limitX, y: clawPos.y, z: clawPos.z});
        }
        if (clawPos.z > limitZ) {
          setClawPos({x: clawPos.x, y: clawPos.y, z: limitZ});
        }
        if (clawPos.z < -limitZ) {
          setClawPos({x: clawPos.x, y: clawPos.y, z: -limitZ});
        }

        if(jump){
          setHasPrize(false);
          console.log('jump');
          setIsLowering(true);
          
          //setClawPos with gsap
          console.log("down");

          
          const random = Math.random();
          let prizeWon = null; 

         
          if (random < 0.1) { 
              prizeWon = 'big';
          } else if (random < 0.35) { 
              prizeWon = 'regular';
          } else if (random < 0.65) { 
              prizeWon = 'small';
          }
          
          // Has Prize 在這裡不會被更新，給同學練習
          setHasPrize(prizeWon !== null); 
          
          //gsap convet to timeline
           gsap.timeline().to(clawPos, { y: 2, duration: 2})
            .to(clawPos, { y: 2.7, duration: 3})
            .then(() => {

              setIsLowering(false);
              if (prizeWon === 'big') {
                console.log("恭喜抽中大獎！");
                Swal.fire({
                  title: '中大獎了！',
                  text: '恭喜你抽到大獎:樂園一日門票2張!',
                  icon: 'success', 
                  confirmButtonText: '確定',
                  
                  background: '#FFFFFF', 
                  color: '#E74635', 
                  confirmButtonColor: '#E74635', 
                  showCloseButton: true,
                  backdrop: `rgba(0,0,0,0.6)`, 
                  
                  
                  imageUrl: '/big.gif', 
                  imageWidth: 180, 
                  imageHeight: 180, 
                  imageAlt: '中大獎動畫', 
                  
                  width: '500px', 
                  padding: '1em', 
                  showClass: {
                    popup: 'animate__animated animate__bounceIn'
                  },
                  hideClass: {
                    popup: 'animate__animated animate__bounceOut'
                  }
                });
              } else if (prizeWon === 'regular') {
                console.log("中獎");
                Swal.fire({
                  title: '抽到小獎',
                  text: '恭喜抽到小獎:樂園餐廳200元抵用券1張!',
                  icon: 'success',
                  confirmButtonText: '確定',
                  customClass: { 
                    popup: 'my-sweet-alert-popup'
                  },
                 
                  background: '#E7E7E7', 
                  color: '#333333', 
                  confirmButtonColor: '#E74635', 
                  showCloseButton: true,
                  backdrop: `rgba(0,0,0,0.4)`, 
                  
                  
                  imageUrl: '/mid.gif', 
                  imageWidth: 150, 
                  imageHeight: 150, 

                  width: '500px',
                  padding: '1em',
                });
              } else if (prizeWon === 'small') {
                console.log("中安慰獎");
                Swal.fire({
                  title: '中安慰獎',
                  text: '恭喜你中安慰獎:樂園專屬人物貼紙1張!',
                  icon: 'warning', 
                  confirmButtonText: '確定',
                  customClass: { 
                    popup: 'my-sweet-alert-popup'
                  },
                  background: '#FFFFFF', 
                  color: '#E74635', 
                  confirmButtonColor: '#AA352C', 
                  showCloseButton: true,
                  backdrop: `rgba(0,0,0,0.6)`, 

                  
                  imageUrl: '/comfort.gif', 
                  imageWidth: 180, 
                  imageHeight: 180, 
                  imageAlt: '安慰獎動畫', 
                  
                  width: '500px',
                  padding: '1em',
                  showClass: {
                    popup: 'animate__animated animate__lightSpeedInRight'
                  },
                  hideClass: {
                    popup: 'animate__animated animate__lightSpeedOutLeft'
                  }
                });
              } else {
                console.log("沒中獎");
                Swal.fire({
                  title: '沒中獎',
                  text: '再接再厲',
                  icon: 'error',
                  confirmButtonText: '確定',
                  customClass: { 
                    popup: 'my-sweet-alert-popup'
                  },
                  background: '#333333', 
                  color: '#E7E7E7', 
                  confirmButtonColor: '#E74635',
                  showCloseButton: true,
                  backdrop: `rgba(0,0,0,0.8)`, 

                
                  imageUrl: '/no.gif', 
                  imageWidth: 180, 
                  imageHeight: 180, 
                  imageAlt: '沒中獎動畫', 
                  
                  width: '500px',
                  padding: '1em',
                  showClass: {
                    popup: 'animate__animated animate__shakeX'
                  },
                  hideClass: {
                    popup: 'animate__animated animate__fadeOut' 
                  }
                });
              }
            });

        }
        
      }
      
    }
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 1, 3]} // 3 ~ 6
    />
  );
}



export default function Home() {
  const boxRef = useRef();
  const isHidden = true;

  const [clawPos, setClawPos] = useState({x: -0.4, y: 2.7, z: 0.2});
  const [isLowering, setIsLowering] = useState(false);
  const [hasPrize, setHasPrize] = useState(false);


  return (
    <div className="w-full h-screen">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
          

          {
            !isHidden && <RoundedBox
              args={[1, 1, 1]} 
              radius={0.05} 
              smoothness={4} 
              bevelSegments={4} 
              creaseAngle={0.4} 
            >
              <meshPhongMaterial color="#f3f3f3"/>
            </RoundedBox>
          }

          <Box ref={boxRef} args={[0.1, 0.1, 0.1]} position={[0, 0, 0]}>
            <meshPhongMaterial color="#f3f3f3"/>
          </Box>


          <Suspense fallback={null}>
            <ClawModel clawPos={clawPos} isLowering={isLowering} hasPrize={hasPrize} />
          </Suspense>


          <Environment
            background={true}
            files="/boma_2k.exr" // 指向 public 裡的 exr
            />


          <ContactShadows opacity={1} scale={10} blur={10} far={10} resolution={256} color="#DDDDDD" />

          <Camera boxRef={boxRef} clawPos={clawPos} setClawPos={setClawPos} isLowering={isLowering} setIsLowering={setIsLowering}
            hasPrize={hasPrize} setHasPrize={setHasPrize}
          />
          <CameraControls enablePan={false} enableZoom={false} />
          <axesHelper args={[10]} />


        </Canvas>
      </KeyboardControls>
    </div>
  );
}