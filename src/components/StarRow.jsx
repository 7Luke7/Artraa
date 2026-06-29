export const StarRow = (props) => {
    const { rating } = props
    return <div class="flex items-center gap-0.5" aria-label={`${rating} ვარსკვლავი 5-დან`}>
        {[1, 2, 3, 4, 5].map(i => {
            const r = props.rating
            return <img
                key={i}
                src={i === Math.ceil(r) && r % 1 !== 0 ? '/svg/star-half.svg' : i <= Math.floor(r) ? '/svg/star-filled.svg' :
                    '/svg/star-outline.svg'
                } width={20}
                height={20}
                alt=""
                loading="lazy"
                decoding="async"
            />
        })}
    </div>
}