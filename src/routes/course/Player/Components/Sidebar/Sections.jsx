import { createSignal, For } from "solid-js"
import { Section } from "./Section"

export const Sections = (props) => {
    const [expandedSections, setExpandedSections] = createSignal([props.course.default_expanded_section_idx])

    const toggleSection = (idx) => {
        setExpandedSections(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        )
    }

    return <For each={props.course?.course_content}>
        {(section, sectionIndex) => <Section 
        course={props.course}
        section={section}
        sectionIndex={sectionIndex}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        ></Section>}
    </For>
}