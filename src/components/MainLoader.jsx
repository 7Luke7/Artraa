import { Title } from "@solidjs/meta"
import "./Loader.css"

export const Loading = () => {
    return <>
        <Title>იტვირთება...</Title>
        <div class="h-screen flex justify-center items-center">
            <div class="dot-spinner">
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
            </div>
        </div>
    </>
}