#!/bin/bash

# 1. HackathonList.tsx
sed -i 's/text-sm font-black uppercase tracking-widest/text-xs font-bold uppercase tracking-wider/g' components/hackathons/HackathonList.tsx
sed -i 's/p-8 shadow-\[8px_8px_0px_0px_rgba(0,0,0,1)\]/p-5 shadow-\[4px_4px_0px_0px_rgba(0,0,0,1)\]/g' components/hackathons/HackathonList.tsx
sed -i 's/gap-10 md:grid-cols-2/gap-6 md:grid-cols-2/g' components/hackathons/HackathonList.tsx
sed -i 's/space-y-12/space-y-8/g' components/hackathons/HackathonList.tsx

# 2. HackathonDetailContent.tsx
sed -i 's/space-y-16 pb-32/space-y-10 pb-20/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/text-4xl font-black tracking-tighter/text-2xl font-black tracking-tighter/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/text-xl py-2 px-6/text-base py-1 px-4/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/top-20 z-20 overflow-x-auto border-4/top-16 z-20 overflow-x-auto border-2/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/text-lg font-black uppercase tracking-widest/text-sm font-bold uppercase tracking-wider/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/px-6 py-2/px-4 py-1.5/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/space-y-8 pt-8/space-y-5 pt-5/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/text-xl font-bold leading-relaxed/text-sm font-medium leading-relaxed/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/border-l-8/border-l-4/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/text-lg font-bold leading-relaxed/text-sm font-medium leading-relaxed/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/text-2xl text-white/text-lg text-white/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/text-3xl font-black uppercase tracking-tighter/text-xl font-black uppercase tracking-tighter/g' components/hackathons/HackathonDetailContent.tsx
sed -i 's/text-sm font-bold text-content-subtle bg-white border-2 border-content-base px-4 py-2/text-xs font-bold text-content-subtle bg-white border-2 border-content-base px-3 py-1/g' components/hackathons/HackathonDetailContent.tsx

# 3. CampView.tsx
sed -i 's/max-w-\[1400px\] mx-auto px-6 py-16/max-w-7xl mx-auto px-4 md:px-6 py-10/g' components/camp/CampView.tsx
sed -i 's/space-y-12 mt-8/space-y-8 mt-6/g' components/camp/CampView.tsx
sed -i 's/border-8 shadow-\[12px_12px_0px_0px_rgba(0,0,0,1)\]/border-2 shadow-\[4px_4px_0px_0px_rgba(0,0,0,1)\]/g' components/camp/CampView.tsx
sed -i 's/text-4xl/text-xl/g' components/camp/CampView.tsx
sed -i 's/text-xl font-black uppercase tracking-widest/text-sm font-black uppercase tracking-wider/g' components/camp/CampView.tsx
sed -i 's/h-16 px-10 text-xl/h-10 px-6 text-sm/g' components/camp/CampView.tsx
sed -i 's/text-2xl/text-lg/g' components/camp/CampView.tsx
sed -i 's/text-lg font-bold leading-relaxed/text-sm font-medium leading-relaxed/g' components/camp/CampView.tsx
sed -i 's/text-base pt-4 border-t-4/text-sm pt-4 border-t-2/g' components/camp/CampView.tsx

echo "Complex components updated"
