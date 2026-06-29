import { createSignal, onMount, onCleanup } from "solid-js"
 
export const PageLoader = () => {
    const [width, setWidth] = createSignal(0)
    let interval
 
    onMount(() => {
        setWidth(15)
 
        interval = setInterval(() => {
            setWidth(prev => {
                if (prev >= 85) {
                    clearInterval(interval)
                    return prev
                }
                const increment = prev < 40 ? 8 : prev < 65 ? 4 : 1
                return Math.min(prev + increment, 85)
            })
        }, 120)
    })
 
    onCleanup(() => clearInterval(interval))
 
    return (
        <>
            <div class="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-transparent">
                <div
                    class="h-full bg-[#E85A4F] transition-all duration-300 ease-out rounded-r-full shadow-[0_0_8px_rgba(232,90,79,0.6)]"
                    style={{ width: `${width()}%` }}
                />
            </div>
 
            <div class="fixed inset-0 z-[9998] bg-gray-50/80 backdrop-blur-[2px] flex items-center justify-center">
                <div class="flex flex-col items-center gap-4">
                    <div class="relative w-10 h-10">
                        <div class="absolute inset-0 rounded-full border-2 border-gray-200" />
                        <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E85A4F] animate-spin" />
                    </div>
                    <p class="text-xs font-gsans text-gray-400 tracking-wide">იტვირთება...</p>
                </div>
            </div>
        </>
    )
}
