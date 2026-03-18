#!/bin/bash
sed -i 's/max-w-\[1400px\]/max-w-7xl/g' components/landing/LandingPage.tsx
sed -i 's/border-b-4/border-b-2/g' components/landing/LandingPage.tsx
sed -i 's/text-6xl md:text-8xl lg:text-\[7.5rem\]/text-5xl md:text-7xl lg:text-8xl/g' components/landing/LandingPage.tsx
sed -i 's/text-2xl md:text-3xl text-content-base font-bold/text-xl md:text-2xl text-content-base font-medium/g' components/landing/LandingPage.tsx
sed -i 's/text-2xl px-12 h-20/text-lg px-8 h-14/g' components/landing/LandingPage.tsx
sed -i 's/text-xl px-10 h-20/text-base px-6 h-14/g' components/landing/LandingPage.tsx
echo "LandingPage sizes fixed."
