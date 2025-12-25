import { createSignal } from "solid-js";

export const Accordion = ({ accordion_content = [
    {description: "ლორემ იპსუმ წავალთ შევედი უკუნეთი, ქილიკობდნენ ლივ, მეფის დაიდო, მატადორში ტალანი. წავალთ შევედი უკუნეთი ქილიკობდნენ ლივ, მეფის დაიდო მატადორში ტალანი მიირთო კინოთეატრები გავიფიქრე ვარჯიში.", title: "ლორემ იპსუმ წავალთ შევედი უკუნეთი, ქილიკობდნენ ლივ, მატადორში ტალანი."},
    {description: "ლორემ იპსუმ წავალთ შევედი უკუნეთი, ქილიკობდნენ ლივ, მეფის დაიდო, მატადორში ტალანი. წავალთ შევედი უკუნეთი ქილიკობდნენ ლივ, მეფის დაიდო მატადორში ტალანი მიირთო კინოთეატრები გავიფიქრე ვარჯიში.", title: "ლორემ იპსუმ წავალთ შევედი უკუნეთი, ქილიკობდნენ ლივ, მატადორში ტალანი."},
    {description: "ლორემ იპსუმ წავალთ შევედი უკუნეთი, ქილიკობდნენ ლივ, მეფის დაიდო, მატადორში ტალანი. წავალთ შევედი უკუნეთი ქილიკობდნენ ლივ, მეფის დაიდო მატადორში ტალანი მიირთო კინოთეატრები გავიფიქრე ვარჯიში.", title: "ლორემ იპსუმ წავალთ შევედი უკუნეთი, ქილიკობდნენ ლივ, მატადორში ტალანი."},
    {description: "ლორემ იპსუმ წავალთ შევედი უკუნეთი, ქილიკობდნენ ლივ, მეფის დაიდო, მატადორში ტალანი. წავალთ შევედი უკუნეთი ქილიკობდნენ ლივ, მეფის დაიდო მატადორში ტალანი მიირთო კინოთეატრები გავიფიქრე ვარჯიში.", title: "ლორემ იპსუმ წავალთ შევედი უკუნეთი, ქილიკობდნენ ლივ, მატადორში ტალანი."},
    {description: "ლორემ იპსუმ წავალთ შევედი უკუნეთი, ქილიკობდნენ ლივ, მეფის დაიდო, მატადორში ტალანი. წავალთ შევედი უკუნეთი ქილიკობდნენ ლივ, მეფის დაიდო მატადორში ტალანი მიირთო კინოთეატრები გავიფიქრე ვარჯიში.", title: "ლორემ იპსუმ წავალთ შევედი უკუნეთი, ქილიკობდნენ ლივ, მატადორში ტალანი."},
    ] }) => {
    const [accordionContent, setAccordionContent] = createSignal(accordion_content?.map((ac) => ({ ...ac, is_selected: false })) || [])

    const expandContent = (selectedIndex) => {
        setAccordionContent((state) => {
            return state.map((c, index) => {
                if (index === selectedIndex) {
                    return {...c, is_selected: !c["is_selected"]}
                }
                return c
            })
        })
    }
    return <div class="border border-gray-300 divide-y divide-gray-300 rounded-lg overflow-hidden">
            <For each={accordionContent()}>{(ac, i) => (
                <div role="accordion">
                    <button onClick={() => expandContent(i())} class="cursor-pointer w-full text-base text-left py-4 px-6 hover:bg-gray-100 text-slate-900 justify-between font-gsans font-medium flex items-center transition-all">
                        <h2 class="mr-4">{ac.title}</h2>
                        <img style={{transform: ac.is_selected && "rotate(180deg)"}} src='/svg/dropdown.svg' width={24} height={24} class="ml-auto shrink-0 transition-transform duration-300"></img>
                    </button>
                    <div style={{"max-height": !ac.is_selected ? 0 : "100%"}} class="overflow-hidden transition-all duration-300 ease-in-out">
                        <div class="py-4 px-6">
                            <p class="text-sm text-slate-600 leading-relaxed">
                                {ac.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}</For>
        </div>
}