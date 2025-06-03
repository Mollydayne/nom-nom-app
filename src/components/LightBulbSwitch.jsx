// src/components/LightBulbSwitch.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(MorphSVGPlugin, Draggable);

export default function LightBulbSwitch() {
  const cordRefs = useRef([]);
  const dummyCordRef = useRef(null);
  const hitSpotRef = useRef(null);
  const proxyRef = useRef(null);
  const stateRef = useRef({ on: false });

  useEffect(() => {
    const cords = cordRefs.current;
    const dummyCord = dummyCordRef.current;
    const hit = hitSpotRef.current;
    const proxy = document.createElement('div');
    proxyRef.current = proxy;
    document.body.appendChild(proxy);

    const ENDX = dummyCord.getAttribute('x2');
    const ENDY = dummyCord.getAttribute('y2');

    const reset = () => {
      gsap.set(proxy, { x: ENDX, y: ENDY });
      gsap.set(dummyCord, {
        attr: { x2: ENDX, y2: ENDY },
      });
    };

    reset();

    const toggleState = () => {
      stateRef.current.on = !stateRef.current.on;
      document.documentElement.style.setProperty('--on', stateRef.current.on ? '1' : '0');
      if (stateRef.current.on) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    const cordTimeline = gsap.timeline({
      paused: true,
      onStart: () => {
        toggleState();
        gsap.set(dummyCord, { autoAlpha: 0 });
        gsap.set(hit, { autoAlpha: 0 });
        gsap.set(cords[0], { autoAlpha: 1 });
        new Audio('https://assets.codepen.io/605876/click.mp3').play();
      },
      onComplete: () => {
        gsap.set(dummyCord, { autoAlpha: 1 });
        gsap.set(hit, { autoAlpha: 1 });
        gsap.set(cords[0], { autoAlpha: 0 });
        reset();
      },
    });

    for (let i = 1; i < cords.length; i++) {
      cordTimeline.to(cords[0], {
        morphSVG: cords[i],
        duration: 0.05,
        ease: 'power1.inOut',
        repeat: 1,
        yoyo: true,
      }, i * 0.05);
    }

    Draggable.create(proxy, {
      trigger: hit,
      type: 'x,y',
      onPress: function (e) {
        this.startX = e.x;
        this.startY = e.y;
      },
      onDrag: function () {
        gsap.set(dummyCord, {
          attr: {
            x2: this.x,
            y2: this.y,
          },
        });
      },
      onRelease: function (e) {
        const dx = Math.abs(e.x - this.startX);
        const dy = Math.abs(e.y - this.startY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        gsap.to(dummyCord, {
          attr: { x2: ENDX, y2: ENDY },
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            if (dist > 50) {
              cordTimeline.restart();
            } else {
              reset();
            }
          },
        });
      },
    });

    return () => document.body.removeChild(proxy);
  }, []);

  const cordPaths = [
    "M123.228-28.56v150.493",
    "M123.228-28.56c-5 30 5 60 0 90s5 60 0 90",
    "M123.228-28.56c-10 40 10 80 0 120s10 40 0 60",
    "M123.228-28.56c-15 20 15 100 0 130",
    "M123.228-28.56c-20 60 20 100 0 140",
  ];

  return (
    <svg className="fixed top-[60%] left-0 -translate-y-1/2 ml-4 w-24 h-auto toggle-scene overflow-visible max-w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" viewBox="0 0 197.451 481.081">
      <defs>
        {[...Array(5)].map((_, i) => (
          <marker key={i} id={String.fromCharCode(97 + i)} orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </marker>
        ))}
        <clipPath id="g" clipPathUnits="userSpaceOnUse">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.677" d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z" />
        </clipPath>
      </defs>

      <g className="toggle-scene__cords">
        {cordPaths.map((d, i) => (
          <path
            key={i}
            ref={el => (cordRefs.current[i] = el)}
            className="toggle-scene__cord"
            markerEnd="url(#a)"
            fill="none"
            strokeLinecap="square"
            strokeWidth="6"
            d={d}
            transform="translate(-24.503 256.106)"
            style={{ display: i === 0 ? 'block' : 'none' }}
          />
        ))}
        <g className="toggle-scene__dummy-cord">
          <line
            ref={dummyCordRef}
            markerEnd="url(#a)"
            x1="98.7255"
            x2="98.7255"
            y1="240.5405"
            y2="380.5405"
            stroke="black"
            strokeWidth="6"
          />
        </g>
        <circle
          ref={hitSpotRef}
          className="toggle-scene__hit-spot"
          cx="98.7255"
          cy="380.5405"
          r="60"
          fill="transparent"
        />
      </g>

      <g className="toggle-scene__bulb bulb" transform="translate(844.069 -645.213)">
        <path className="bulb__cap" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.677" d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z" />
        <path className="bulb__cap-shine" d="M-778.379 802.873h25.512v118.409h-25.512z" clipPath="url(#g)" transform="matrix(.52452 0 0 .90177 -368.282 82.976)" />
        <path className="bulb__cap" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v0s-8.439 10.115-28.817 10.115c-21.673 0-29.59-10.115-29.59-10.115z" />
        <path className="bulb__cap-outline" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.677" d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z" />
        <g className="bulb__filament" fill="none" strokeLinecap="round" strokeWidth="5">
          <path d="M-752.914 823.875l-8.858-33.06" />
          <path d="M-737.772 823.875l8.858-33.06" />
        </g>
        <path className="bulb__bulb" strokeLinecap="round" strokeWidth="5" d="M-783.192 803.855c5.251 8.815 5.295 21.32 13.272 27.774 12.299 8.045 36.46 8.115 49.127 0 7.976-6.454 8.022-18.96 13.273-27.774 3.992-6.7 14.408-19.811 14.408-19.811 8.276-11.539 12.769-24.594 12.769-38.699 0-35.898-29.102-65-65-65-35.899 0-65 29.102-65 65 0 13.667 4.217 26.348 12.405 38.2 0 0 10.754 13.61 14.746 20.31z" />
        <circle className="bulb__flash animate-pulse" cx="-745.343" cy="743.939" r="83.725" fill="none" strokeDasharray="10,30" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10" style={{ opacity: 'var(--on)' }} />
        <path className="bulb__shine" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M-789.19 757.501a45.897 45.897 0 013.915-36.189 45.897 45.897 0 0129.031-21.957" />
      </g>
    </svg>
  );
}
