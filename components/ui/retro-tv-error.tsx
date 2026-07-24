'use client';

import React from 'react';

interface RetroTvErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
}

export function RetroTvError({
  title = 'Ups',
  message = 'Solo en boletería',
  className = '',
  ...props
}: RetroTvErrorProps) {
  return (
    <div className={`retro-tv-wrapper ${className}`} {...props}>
      <style>{`
        .retro-tv-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 24px 0 8px;
        }
        .retro-tv-scene { position: relative; }
        .retro-tv {
          width: 180px;
          background: #2a2a2a;
          border-radius: 18px 18px 12px 12px;
          padding: 14px 14px 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08);
          position: relative;
        }
        .retro-tv-antenna {
          display: flex;
          justify-content: center;
          gap: 28px;
          margin-bottom: 6px;
          position: relative;
        }
        .retro-tv-antenna::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 4px;
          background: #3a3a3a;
          border-radius: 2px;
        }
        .retro-tv-antenna span {
          display: block;
          width: 3px;
          height: 36px;
          background: #555;
          border-radius: 2px;
          transform-origin: bottom center;
        }
        .retro-tv-antenna span:first-child { transform: rotate(-25deg); }
        .retro-tv-antenna span:last-child  { transform: rotate(25deg); }

        .retro-tv-screen-outer {
          background: #111;
          border-radius: 10px;
          padding: 6px;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.6);
        }
        .retro-tv-screen {
          background: #0d0d0d;
          border-radius: 7px;
          height: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .retro-tv-screen::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.15) 2px,
            rgba(0,0,0,0.15) 4px
          );
          pointer-events: none;
        }
        .retro-tv-screen-title {
          color: #f5f5f5;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1;
          font-family: monospace;
          text-shadow: 0 0 12px rgba(255,255,255,0.4);
          animation: retro-flicker 4s infinite;
        }
        .retro-tv-screen-msg {
          color: #aaa;
          font-size: 8px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-top: 6px;
          font-family: monospace;
        }
        @keyframes retro-flicker {
          0%,95%,100% { opacity: 1; }
          96% { opacity: 0.85; }
          97% { opacity: 1; }
          98% { opacity: 0.7; }
          99% { opacity: 1; }
        }
        .retro-tv-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 4px;
        }
        .retro-tv-knobs { display: flex; gap: 6px; }
        .retro-tv-knob {
          width: 12px; height: 12px;
          background: #444;
          border-radius: 50%;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
        }
        .retro-tv-knob.red { background: #c0392b; }
        .retro-tv-speaker {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .retro-tv-speaker span {
          display: block;
          width: 22px; height: 2px;
          background: #444;
          border-radius: 1px;
        }
        .retro-tv-base {
          width: 120px;
          height: 10px;
          background: #222;
          border-radius: 0 0 6px 6px;
          margin: 0 auto;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .retro-tv-feet {
          display: flex;
          justify-content: center;
          gap: 40px;
        }
        .retro-tv-feet span {
          display: block;
          width: 16px; height: 6px;
          background: #1a1a1a;
          border-radius: 0 0 4px 4px;
        }
        .retro-tv-label {
          text-align: center;
        }
        .retro-tv-label-title {
          font-size: 13px;
          font-weight: 700;
          color: #0A0A0A;
          letter-spacing: -0.01em;
        }
        .retro-tv-label-sub {
          font-size: 10px;
          color: #888;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-top: 2px;
        }
        @media (prefers-color-scheme: dark) {
          .retro-tv-label-title { color: #f2f2f7; }
          .retro-tv-label-sub   { color: #636366; }
        }
        :root[data-theme="light"] .retro-tv-label-title { color: #0A0A0A; }
        :root[data-theme="light"] .retro-tv-label-sub   { color: #888; }
        :root[data-theme="dark"]  .retro-tv-label-title { color: #f2f2f7; }
        :root[data-theme="dark"]  .retro-tv-label-sub   { color: #636366; }
      `}</style>

      <div className="retro-tv-scene">
        {/* Antenas */}
        <div className="retro-tv-antenna">
          <span /><span />
        </div>

        {/* Cuerpo */}
        <div className="retro-tv">
          <div className="retro-tv-screen-outer">
            <div className="retro-tv-screen">
              <div className="retro-tv-screen-title">{title}</div>
              <div className="retro-tv-screen-msg">{message}</div>
            </div>
          </div>
          <div className="retro-tv-controls">
            <div className="retro-tv-knobs">
              <div className="retro-tv-knob red" />
              <div className="retro-tv-knob" />
            </div>
            <div className="retro-tv-speaker">
              <span /><span /><span />
            </div>
          </div>
        </div>

        {/* Base */}
        <div className="retro-tv-base" />
        <div className="retro-tv-feet"><span /><span /></div>
      </div>

      <div className="retro-tv-label">
        <p className="retro-tv-label-title">Venta online cerrada</p>
        <p className="retro-tv-label-sub">Entradas solo en boletería</p>
      </div>
    </div>
  );
}
