"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type React from "react"

interface LayeredTextProps {
  lines?: Array<{ top: string; bottom: string }>
  fontSize?: string
  lineHeight?: number
  className?: string
}

export function LayeredText({
  lines = [
    { top: " ",    bottom: "TU" },
    { top: "TU",        bottom: "ACCESO" },
    { top: "ACCESO",    bottom: "A LOS" },
    { top: "A LOS",     bottom: "MEJORES" },
    { top: "MEJORES",   bottom: "EVENTOS" },
    { top: "EVENTOS",   bottom: " " },
  ],
  fontSize = "clamp(52px, 9vw, 110px)",
  lineHeight = 72,
  className = "",
}: LayeredTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline>()

  const calculateTranslateX = (index: number) => {
    const center = Math.floor(lines.length / 2)
    return (index - center) * 28
  }

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const paragraphs = container.querySelectorAll("p")

    timelineRef.current = gsap.timeline({ paused: true })
    timelineRef.current.to(paragraphs, {
      y: -lineHeight,
      duration: 0.72,
      ease: "power3.out",
      stagger: 0.06,
    })

    const play    = () => timelineRef.current?.play()
    const reverse = () => timelineRef.current?.reverse()

    container.addEventListener("mouseenter", play)
    container.addEventListener("mouseleave", reverse)
    return () => {
      container.removeEventListener("mouseenter", play)
      container.removeEventListener("mouseleave", reverse)
      timelineRef.current?.kill()
    }
  }, [lines, lineHeight])

  return (
    <div
      ref={containerRef}
      className={`font-[family-name:var(--font-bebas-neue)] tracking-[-0.015em] uppercase text-[#0A0A0A] cursor-pointer select-none ${className}`}
      style={{ fontSize } as React.CSSProperties}
    >
      <ul className="list-none p-0 m-0 flex flex-col items-start">
        {lines.map((line, index) => {
          const tx = calculateTranslateX(index)
          const isEven = index % 2 === 0
          return (
            <li
              key={index}
              className="overflow-hidden relative"
              style={{
                height: `${lineHeight}px`,
                transform: `translateX(${tx}px) skew(${isEven ? "60deg,-30deg" : "0deg,-30deg"}) scaleY(${isEven ? "0.66667" : "1.33333"})`,
              }}
            >
              <p className="whitespace-nowrap m-0 px-2" style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}>
                {line.top}
              </p>
              <p className="whitespace-nowrap m-0 px-2" style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}>
                {line.bottom}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
