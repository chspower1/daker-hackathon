#!/bin/bash
sed -i 's/h-20 max-w-\[1400px\]/h-16 max-w-7xl/g' components/layout/SharedAppShell.tsx
sed -i 's/gap-4 font-black text-2xl/gap-3 font-black text-xl/g' components/layout/SharedAppShell.tsx
sed -i 's/w-10 h-10/w-8 h-8/g' components/layout/SharedAppShell.tsx
sed -i 's/text-xl">H/text-lg">H/g' components/layout/SharedAppShell.tsx
sed -i 's/ml-12 flex gap-8 text-base/ml-8 flex gap-6 text-sm/g' components/layout/SharedAppShell.tsx
sed -i 's/h-20/h-16/g' components/layout/SharedAppShell.tsx
sed -i 's/decoration-4/decoration-2/g' components/layout/SharedAppShell.tsx
sed -i 's/border-b-4/border-b-2/g' components/layout/SharedAppShell.tsx
echo "AppShell sizes fixed."
