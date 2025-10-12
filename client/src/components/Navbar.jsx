import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import VariableProximity from "../blocks/TextAnimations/VariableProximity/VariableProximity";
import gsap from "gsap";

const Navbar = () => {
  const location = useLocation();
  const containerRef = useRef(null);

  const navRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    const navbar = navRef.current;
    const links = linksRef.current?.children;

    // Set initial state
    gsap.set(navbar, { y: -100, opacity: 0 });
    gsap.set(links, { y: -50, opacity: 0 });

    // Animate navbar entrance
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(navbar, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.8)",
    }).to(
      links,
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
      "-=0.6"
    );

    // Add hover animations for links
    if (links) {
      Array.from(links).forEach((link) => {
        const linkElement = link.querySelector("a");
        if (linkElement) {
          linkElement.addEventListener("mouseenter", () => {
            gsap.to(linkElement, {
              scale: 1.1,
              y: -3,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          linkElement.addEventListener("mouseleave", () => {
            gsap.to(linkElement, {
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        }
      });
    }

    return () => {
      // Cleanup animations
      gsap.killTweensOf([navbar, links]);
    };
  }, []);

  const handleLogoHover = () => {
    gsap.to(containerRef.current, {
      rotation: 360,
      duration: 0.6,
      ease: "power2.inOut",
    });
  };

  return (
    <nav ref={navRef} style={styles.navbar}>
      <div
        ref={containerRef}
        style={{ position: "relative", cursor: "pointer" }}
        onMouseEnter={handleLogoHover}
      >
        <h2>
          <VariableProximity
            label={"Sudo Bits"}
            className={"variable-proximity-animated"}
            fromFontVariationSettings="'wght' 100, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 10"
            containerRef={containerRef}
            radius={60}
            falloff="gaussian"
          />
        </h2>
      </div>

      <ul ref={linksRef} style={styles.links}>
        <li>
          <Link
            to="/"
            style={{
              ...styles.link,
              ...(location.pathname === "/" ? styles.activeLink : {}),
            }}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            style={{
              ...styles.link,
              ...(location.pathname === "/about" ? styles.activeLink : {}),
            }}
          >
            About
          </Link>
        </li>

        <li>
          <Link
            to="/dashboard"
            style={{
              ...styles.link,
              ...(location.pathname === "/login" ? styles.activeLink : {}),
            }}
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    width: "90%",
    padding: "10px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "transparent",
    position: "absolute",
    top: 0,
    zIndex: 20,
    color: "white",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  links: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    transition: "all 0.3s ease",
  },
  activeLink: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
};

export default Navbar;
