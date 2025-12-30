"use client";

import Image from "next/image";

import { useState, MouseEvent } from "react";

interface CardValues {
    name: number;
    disc: string;
}

export default function Card({ name, disc }: CardValues) {
    const [transformStyle, setTransformStyle] = useState<string>("");
    const [width, setWidth] = useState<number>(200);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = (y / rect.height - 0.5) * 25;
        const rotateY = (x / rect.width - 0.5) * -25;

        const translateX = (x / rect.width - 0.5) * 12;
        const translateY = (y / rect.height - 0.5) * 12;

        setTransformStyle(
            `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px)`,
        );
    };

    const handleMouseLeave = () => {
        setTransformStyle(
            "perspective(800px) rotateX(0deg) rotateY(0deg) translate(0px, 0px)",
        );
    };

    return (
        <div className="flex justify-center items-center">
            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group p-4 relative rounded-2xl shadow-lg bg-transparent overflow-hidden cursor-pointer flex items-center justify-center aspect-[2/3]"
                style={{
                    transform: transformStyle,
                    width: width, // aspect ratio will auto adjust height
                }}
            >
                {/* Image filling full container */}
                <Image
                    src={`/stool/types2/${name}.png`}
                    alt={`Stool ${name}`}
                    fill
                    className="object-contain"
                />

                {/* Bottom text reveal from bottom */}
                <div
                    className="absolute bottom-0 w-full p-4 font-bold text-gray-900 drop-shadow-[0_0_6px_white] translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                >
                    <h3 className="text-xl font-black">{`Type ${name}`}</h3>
                    <p className="text-sm opacity-80 mt-1 group-hover:opacity-100 transition">
                        {disc}
                    </p>
                </div>
            </div>
        </div>
    );
}
