import { useAction } from "@solidjs/router"
import { createSignal, Show } from "solid-js"
import { get_image_upload_url, save_profile_picture } from "~/routes/api/user/images/cloudflare"

export const ProfilePicture = (props) => {
    const [preview, setPreview] = createSignal(null)
    const [file, setFile] = createSignal(null)
    const [loading, setLoading] = createSignal(false)
    const [error, setError] = createSignal("")
    const saveAvatar = useAction(save_profile_picture)

    const currentAvatar = () =>
        preview() || props.user?.()?.avatar

    const handleFileChange = (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        if (f.size > 10 * 1024 * 1024) {
            setError("ფაილი 10MB-ზე მეტია")
            return
        }
        setError("")
        setFile(f)
        setPreview(URL.createObjectURL(f))
        e.target.value = ""
    }

    const handleCancel = () => {
        if (preview()) URL.revokeObjectURL(preview())
        setPreview(null)
        setFile(null)
        setError("")
    }

    const handleConfirm = async () => {
        if (!file()) return
        setLoading(true)
        setError("")

        try {
            const result = await get_image_upload_url()

            if (!result.ok) throw new Error("upload failed");
            const { uploadURL, id } = result.result

            const form = new FormData()
            form.append("file", file())
            const uploadRes = await fetch(uploadURL, { method: "POST", body: form })
            if (!uploadRes.ok) throw new Error("upload failed")

            saveAvatar(id)

            URL.revokeObjectURL(preview())
            setPreview(null)
            setFile(null)
        } catch (e) {
            console.error(e)
            setError("ატვირთვა ვერ მოხერხდა, სცადეთ ხელახლა")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div class="relative">
            <div class="h-24 md:h-32 rounded-t-2xl bg-gradient-to-r from-[#E85A4F]/20 via-[#E85A4F]/10 to-transparent" />
            <div class="absolute -bottom-12 left-6 md:left-8 flex flex-col items-start gap-3">
                <div class="relative group">
                    <img
                        src={currentAvatar()}
                        onError={(e) => e.currentTarget.src = '/default_profile.png'}
                        alt={props.user?.()?.name}
                        width={96}
                        height={96}
                        loading="lazy"
                        class={`w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white shadow-lg transition-all duration-200 ${loading() ? "opacity-50" : ""}`}
                    />
                    <Show when={loading()}>
                        <div class="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[2px]">
                            <svg class="animate-spin w-7 h-7 text-[#E85A4F]" viewBox="0 0 24 24" fill="none">
                                <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                                <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    </Show>

                    <Show when={!preview() && !loading()}>
                        <label
                            for="profile_picture_input"
                            class="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 group-hover:bg-black/30 transition-all duration-200 cursor-pointer"
                            aria-label="პროფილის სურათის შეცვლა"
                        >
                            <img src='/svg/camera.svg' width={22} height={22} alt=""/>
                        </label>
                        <input
                            id="profile_picture_input"
                            type="file"
                            class="hidden"
                            accept="image/webp,image/png,image/jpeg,image/jpg"
                            onChange={handleFileChange}
                            disabled={loading()}
                        />
                    </Show>
                </div>
                <Show when={preview() && !loading()}>
                    <div class="flex items-center gap-2">
                        <button
                            onClick={handleConfirm}
                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E85A4F] hover:bg-[#D84A3F] text-white text-xs font-gsans font-bold transition-all duration-150 shadow-sm active:scale-95"
                            aria-label="სურათის დაყენება"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12l5 5l10 -10" />
                            </svg>
                            დაყენება
                        </button>
                        <button
                            onClick={handleCancel}
                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-gsans font-medium transition-all duration-150 active:scale-95"
                            aria-label="გაუქმება"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6l-12 12" />
                                <path d="M6 6l12 12" />
                            </svg>
                            გაუქმება
                        </button>
                    </div>
                </Show>
                <Show when={error()}>
                    <p class="text-xs text-[#E85A4F] font-gsans">{error()}</p>
                </Show>
            </div>
        </div>
    )
}